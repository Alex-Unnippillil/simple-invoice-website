import os
import requests

BASE_URL = os.getenv('XERO_API_BASE', 'https://api.xero.com/api.xro/2.0')
TOKEN = os.getenv('XERO_TOKEN')
TENANT_ID = os.getenv('XERO_TENANT_ID')

HEADERS = {
    'Authorization': f'Bearer {TOKEN}' if TOKEN else '',
    'Xero-tenant-id': TENANT_ID or '',
    'Content-Type': 'application/json'
}


def create_or_update_contact(tenant):
    data = {
        'Contacts': [
            {
                'Name': tenant['name'],
                'EmailAddress': tenant['email']
            }
        ]
    }
    resp = requests.post(f"{BASE_URL}/Contacts", json=data, headers=HEADERS)
    resp.raise_for_status()
    contact = resp.json()['Contacts'][0]
    return contact['ContactID']


def create_invoice(invoice, contact_id):
    data = {
        'Invoices': [
            {
                'Type': 'ACCREC',
                'Contact': {'ContactID': contact_id},
                'LineItems': [
                    {
                        'Description': 'Rent',
                        'Quantity': 1,
                        'UnitAmount': invoice['amount']
                    }
                ]
            }
        ]
    }
    resp = requests.post(f"{BASE_URL}/Invoices", json=data, headers=HEADERS)
    resp.raise_for_status()
    inv = resp.json()['Invoices'][0]
    return inv['InvoiceID'], inv.get('Url') or inv.get('InvoiceNumber')
