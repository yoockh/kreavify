import os
import base64
import requests
import time
from uuid import uuid4

def get_midtrans_auth_header():
    server_key = os.environ.get('MIDTRANS_SERVER_KEY', '')
    auth_string = f"{server_key}:"
    encoded_auth = base64.b64encode(auth_string.encode('utf-8')).decode('utf-8')
    return f"Basic {encoded_auth}"

def create_snap_transaction(invoice):
    is_production = os.environ.get('MIDTRANS_IS_PRODUCTION', 'False') == 'True'
    if is_production:
        base_url = "https://app.midtrans.com"
    else:
        base_url = "https://app.sandbox.midtrans.com"

    url = f"{base_url}/snap/v1/transactions"
    
    # Generate midtrans order id
    short_uuid = str(invoice.id)[:8]
    timestamp = int(time.time())
    order_id = f"KK-{short_uuid}-{timestamp}"
    
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

    payload = {
        "transaction_details": {
            "order_id": order_id,
            "gross_amount": int(invoice.total)
        },
        "customer_details": {
            "first_name": invoice.client_name,
        },
        "callbacks": {
            "finish": f"{frontend_url}/pay/success"
        }
    }

    if invoice.client_email:
        payload["customer_details"]["email"] = invoice.client_email
    if invoice.client_phone:
        payload["customer_details"]["phone"] = invoice.client_phone

    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": get_midtrans_auth_header()
    }

    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    
    data = response.json()
    return {
        "token": data.get('token'),
        "redirect_url": data.get('redirect_url'),
        "order_id": order_id
    }
