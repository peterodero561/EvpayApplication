import base64
import datetime
from flask import Blueprint, request, jsonify, render_template
from flask_login import login_required, current_user
import os
import requests
import re
from dotenv import load_dotenv
from pyngrok import ngrok
from app.models.transaction import Transaction
from app.extensions import db

# Load environment variables from .env
load_dotenv()

# initializing flask Blueprint for payments
payments_bp = Blueprint('payments', __name__, template_folder='templates')

# M-Pesa credentials
CONSUMER_KEY = os.getenv('CONSUMER_KEY')
CONSUMER_SECRET = os.getenv('CONSUMER_SECRET')
SHORTCODE = os.getenv('SHORTCODE')
LIPA_NA_MPESA_PASSKEY = os.getenv('LIPA_NA_MPESA_PASSKEY')
BASE_URL = 'https://sandbox.safaricom.co.ke'

# Create call back using ngrok
public_url =  'not_set_up'#ngrok.connect(5000, bind_tls=True).public_url # when flask is runnig on port 5000
CALLBACK_URL = f"{public_url}/api/payments/callback"
print(f"CALLBACK_URL: {CALLBACK_URL}")

# Check if all required environment variables are set
if not all([CONSUMER_KEY, CONSUMER_SECRET, SHORTCODE, LIPA_NA_MPESA_PASSKEY, CALLBACK_URL]):
    raise ValueError("One or more environment variables for M-Pesa are missing")

# Function to get OAuth token
def get_token():
    api_url = f"{BASE_URL}/oauth/v1/generate?grant_type=client_credentials"

    # Encode consumer Key and Secet in Base64
    credentials = f"{CONSUMER_KEY}:{CONSUMER_SECRET}"
    encoded_credentials = base64.b64encode(credentials.encode()).decode()

    headers={
        "Authorization": f"Basic {encoded_credentials}",
        "Content-Type": "application/json"
    }
    try:
        response = requests.get(api_url, headers=headers)
        response.raise_for_status() # raise an error for 4XX or 5XX
        json_response = response.json()
        token = json_response.get("access_token")
        print(f"OAuth Token Retrived: {json_response}")
        return token
    except requests.exceptions.RequestException as e:
        print(f"Error fetching token: {str(e)}")
        if hasattr(e, 'response') and e.response:
            print(f"Response content: {e.response.text}")
        return None


# Function to initiate STK Push
def initiate_stk_push(phone_number, amount, seat_number):
    token = get_token()
    if not token:
        return {"error": "Failed to retrieve access token"}

    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    password_str = f"{SHORTCODE}{LIPA_NA_MPESA_PASSKEY}{timestamp}"
    password = base64.b64encode(password_str.encode()).decode()

    print("[DEBUG] Password String:", password_str)  # Check concatenation
    print("[DEBUG] Encoded Password:", password)     # Check encoding   

    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    payload = {
        "BusinessShortCode": SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone_number,
        "PartyB": SHORTCODE,
        "PhoneNumber": phone_number,
        "CallBackURL": CALLBACK_URL,
        "AccountReference": "BuygoodsOnline",
        "TransactionDesc": "Transport"
    }

    try:
        response = requests.post(f"{BASE_URL}/mpesa/stkpush/v1/processrequest", json=payload, headers=headers)
        response.raise_for_status()
        response_data = response.json()
        #print("Response: ", response_data)

        # create transaction record
        new_transaction = Transaction(
            checkout_request_id=response_data['CheckoutRequestID'],
            amount=amount,
            phone_number=phone_number,
            status='pending'
        )
        db.session.add(new_transaction)
        db.session.commit()

        return response_data
    except requests.exceptions.HTTPError as http_err:
        print(f'HTTP Error: {http_err.response.text}')
        return {'error': http_err.response.text}
    except requests.exceptions.RequestException as e:
        print(f"Error initiating STK Push: {e}")
        return {"error": "STK Push request failed"}


@payments_bp.route('/pay', methods=['POST'], strict_slashes=False)
def pay():
    # Get JSON data
    try:
        data = request.get_json()
        
        # If no JSON data Try looking in URL parameters
        if not data:
            return jsonify({'error': "No data received"}), 400
        
        required_fields = ['amount', 'payment_method', 'seat_number']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'missing required field: {field}'}), 400
        
        # additional for mpesa
        if data['payment_method'].lower() == 'm-pesa':
            if 'phone_number' not in data:
                return jsonify({'error': 'Phone Number is required for M-pesa payments'}), 400
            
            # validate phone number format
            if not re.match(r'^254\d{9}$', data['phone_number']):
                return jsonify({'error': 'Invalid phone number format use 2547XXXXXXX'}), 400
            
        # Initiate STK
        response = initiate_stk_push(data['phone_number'], data['amount'], data['seat_number'])
        if 'error' in response:
            return jsonify(response), 400
        return jsonify(response), 200
    except Exception as e:
        print(f'unxpected error in /api/payments/pay: {e}')
        return jsonify({'error': 'Internal Server Error'}), 500



@payments_bp.route('/callback', methods=['POST'])
def callback():
    # Handle callback from M-Pesa
    data = request.get_json()
    # Process the response from M-Pesa (e.g., log the transaction)
    try:
        callback_data = data['Body']['stkCallback']
        checkout_id = callback_data['CheckoutRequestID']
        result_code = callback_data['ResultCode']

        transaction = Transaction.query.filter_by(checkout_request_id=checkout_id).first()
        if transaction:
            transaction.status = "completed" if result_code == 0 else 'failed'
            transaction.result_code = result_code
            transaction.updated_at = datetime.datetime.utcnow()
            db.session.commit()
            
            print(f'Updated transaction {checkout_id} with status {transaction.status}')
    except Exception as e:
        print(f'Error processing callback: {str(e)}')
        db.session.rollback()

    return jsonify({"ResultCode": 0, "ResultDesc": "success"}), 200

@payments_bp.route('/transaction/status/<checkout_transaction_id>', methods=['GET'], strict_slashes=False)
def transaction_status(checkout_request_id):
    transation = Transaction.query.filter_by(checkout_request_id=checkout_request_id).first()

    if not transation:
        return jsonify({'error': 'Transaction not found'}), 404
    
    print(transation)
    return jsonify({
        'status': transation.status,
        'resultcode': transation.result_code,
        'checkout_request_id': checkout_request_id,
        'amount': transation.amount,
        'phone_number': transation.phone_number
    })

@payments_bp.route('/payment_page', methods=['GET'], strict_slashes=False)
def charge_page():
    # returnd charge.html page
    return render_template('fare_payment.html')