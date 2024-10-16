import base64
import datetime
from flask import Blueprint, request, jsonify
import os
import requests

# initializing flask Blueprint for payments
payments_bp = Blueprint('payments', __name__)

# M-Pesa credentials
CONSUMER_KEY = os.environ('CONSUMER_KEY')
CONSUMER_SECRET = os.environ('CONSUMER_SECRET')
SHORTCODE = os.environ('SHORTCODE')
LIPA_NA_MPESA_ONLINE_PASSWORD = os.environ('LIPA_NA_MPESA_ONLINE_PASSWORD')
CALLBACK_URL = os.environ('CALLBACK_URL')
BASE_URL = 'https://sandbox.safaricom.co.ke'

# Function to get OAuth token
def get_token():
    api_url = f"{BASE_URL}/oauth/v1/generate?grant_type=client_credentials"
    response = requests.get(api_url, auth=(CONSUMER_KEY, CONSUMER_SECRET))
    json_response = response.json()
    return json_response['access_token']



# Function to initiate STK Push
def initiate_stk_push(phone_number, amount):
    token = get_token()
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    payload = {
        "BusinessShortCode": SHORTCODE,
        "Password": base64.b64encode(f"{SHORTCODE}{LIPA_NA_MPESA_ONLINE_PASSWORD}{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}".encode()).decode(),
        "Timestamp": datetime.datetime.now().strftime('%Y%m%d%H%M%S'),
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone_number,
        "PartyB": SHORTCODE,
        "PhoneNumber": phone_number,
        "CallBackURL": CALLBACK_URL,
        "AccountReference": "YourAccountReference",
        "TransactionDesc": "Payment for testing"
    }
    response = requests.post(f"{BASE_URL}/mpesa/stkpush/v1/processrequest", json=payload, headers=headers)
    return response.json()


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
