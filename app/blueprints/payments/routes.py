import base64
import datetime
from flask import Blueprint, request, jsonify
import os
import requests

# initializing flask Blueprint for payments
payments_bp = Blueprint('payments', __name__, template_folder='templates')

# M-Pesa credentials
CONSUMER_KEY = os.getenv('CONSUMER_KEY')
CONSUMER_SECRET = os.getenv('CONSUMER_SECRET')
SHORTCODE = os.getenv('SHORTCODE')
LIPA_NA_MPESA_ONLINE_PASSWORD = os.getenv('LIPA_NA_MPESA_ONLINE_PASSWORD')
CALLBACK_URL = os.getenv('CALLBACK_URL')
BASE_URL = 'https://sandbox.safaricom.co.ke'

# Check if all required environment variables are set
if not all([CONSUMER_KEY, CONSUMER_SECRET, SHORTCODE, LIPA_NA_MPESA_ONLINE_PASSWORD, CALLBACK_URL]):
    raise ValueError("One or more environment variables for M-Pesa are missing")

# Function to get OAuth token
def get_token():
    api_url = f"{BASE_URL}/oauth/v1/generate?grant_type=client_credentials"
    try:
        response = requests.get(api_url, auth=(CONSUMER_KEY, CONSUMER_SECRET))
        response.raise_for_status()
        json_response = response.json()
        return json_response['access_token']
    except requests.exceptions.RequestException as e:
        print(f"Error fetching token: {e}")
        return None



# Function to initiate STK Push
def initiate_stk_push(phone_number, amount):
    token = get_token()
    if not token:
        return {"error": "Failed to retrieve access token"}

    timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    password_str = f"{SHORTCODE}{LIPA_NA_MPESA_ONLINE_PASSWORD}{timestamp}"
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
    try:
        response = requests.post(f"{BASE_URL}/mpesa/stkpush/v1/processrequest", json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error initiating STK Push: {e}")
        return {"error": "STK Push request failed"}


@payments_bp.route('/pay', methods=['POST'])
def pay():
    data = request.get_json()
    phone_number = data['phone_number']
    amount = data['amount']

    response = initiate_stk_push(phone_number, amount)
    return jsonify(response)



@payments_bp.route('/callback', methods=['POST'])
def callback():
    # Handle callback from M-Pesa
    data = request.get_json()
    # Process the response from M-Pesa (e.g., log the transaction)
    print(data)
    return jsonify({"status": "success"}), 200