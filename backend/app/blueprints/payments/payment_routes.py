import base64
import datetime
from flask import Blueprint, request, jsonify, render_template
from flask_login import login_required, current_user
import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# initializing flask Blueprint for payments
payments_bp = Blueprint('payments', __name__, template_folder='templates')

# M-Pesa credentials
CONSUMER_KEY = os.getenv('CONSUMER_KEY')
CONSUMER_SECRET = os.getenv('CONSUMER_SECRET')
SHORTCODE = os.getenv('SHORTCODE')
LIPA_NA_MPESA_PASSKEY = os.getenv('LIPA_NA_MPESA_PASSKEY')
CALLBACK_URL = os.getenv('CALLBACK_URL')
BASE_URL = 'https://sandbox.safaricom.co.ke'


# Check if all required environment variables are set
if not all([CONSUMER_KEY, CONSUMER_SECRET, SHORTCODE, LIPA_NA_MPESA_PASSKEY, CALLBACK_URL]):
    raise ValueError("One or more environment variables for M-Pesa are missing")

# Function to get OAuth token
def get_token():
    api_url = f"{BASE_URL}/oauth/v1/generate?grant_type=client_credentials"

    # Encode consumer Key and Secet in Base64
    credentials = f"{CONSUMER_KEY}: {CONSUMER_SECRET}"
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
        print(f"Error fetching token: {e}")
        return None



# Function to initiate STK Push
def initiate_stk_push(phone_number, amount):
    token = get_token()
    if not token:
        return {"error": "Failed to retrieve access token"}

    timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    password_str = f"{SHORTCODE}{LIPA_NA_MPESA_PASSKEY}{timestamp}"
    password = base64.b64encode(password_str.encode()).decode()

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

    print("Payload:", payload)
    print("Headers:", headers)


    try:
        response = requests.post(f"{BASE_URL}/mpesa/stkpush/v1/processrequest", json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        print('HTTP Error: {http_err.response.text}')
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
            data = request.args

        # Log parameters
        print(f"Incoming Request Data:{data}")

        # Confirm data is not none
        if data is None:
            return jsonify({'error': 'Invalid JSON Payload'}), 400
        
        # Ensure Phone number and amount parameters are present in URL
        if 'phone_number' not in data or 'amount' not in data:
            return jsonify({'error': 'missing required Phone Number'})
        
        # Retrive phone number and amount from data
        phone_number = data['phone_number']
        amount = data['amount']

        response = initiate_stk_push(phone_number, amount)
        return jsonify(response)
    except Exception as e:
        print('unxpected error in /api/payments/pay: {e}')
        return jsonify({'error': 'Internal Server Error'}), 500



@payments_bp.route('/callback', methods=['POST'])
def callback():
    # Handle callback from M-Pesa
    data = request.get_json()
    # Process the response from M-Pesa (e.g., log the transaction)
    print(data)
    return jsonify({"status": "success"}), 200

@payments_bp.route('/payment_page', methods=['GET'], strict_slashes=False)
def charge_page():
    # returnd charge.html page
    return render_template('fare_payment.html')