from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import requests
import base64
import datetime
from core.models.transaction import Transaction

class MpesaAPI(APIView):
    """
    API for handling M-Pesa payment transactions.
    """
    def post(self, request):
        try:
            data = request.data
            amount = data['amount']
            phone_number = data['phone_number']

            # Mpesa authentication logic
            token = self.get_mpesa_token()
            timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
            password = base64.b64encode(f'{settings.MPESA_SHORTCODE}{settings.MPESA_LIVE_PASSKEY}{timestamp}'.encode()).decode()
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            payload = {
                "ShortCode": settings.MPESA_SHORTCODE,
                "Password": password,
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": amount,
                "PartyA": phone_number,
                "PartyB": settings.MPESA_SHORTCODE,
                "PhoneNumber": phone_number,
                "CallBackURL": settings.MPESA_CALLBACK_URL,
                "AccountReference": "EVcharge",
                "TransactionDesc": "charge for EV",
            }

            response = requests.post(settings.MPESA_STK_URL, json=payload, headers=headers)

            # save transaction details to the database
            transaction.objects.create(
                check_out_id=response.json()['CheckoutRequestID'],
                phone_number=phone_number,
                amount=amount,
                status=response.status_code,
            )
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def get_mpesa_token(self):
        """
        Function to get the M-Pesa token.
        """
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

class PaymentCallbackAPI(APIView):
    """
    API for handling M-Pesa payment callback.
    """
    def post(self, request):
       data = request.data

       return Response({"ResultCode": 0})