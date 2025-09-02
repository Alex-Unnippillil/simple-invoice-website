from flask import Flask, request, redirect, render_template
import db
import xero_api

app = Flask(__name__)

db.init_db()


@app.route('/')
def index():
    invoices = db.get_invoices()
    return render_template('index.html', invoices=invoices)


@app.route('/tenants', methods=['GET', 'POST'])
def tenants():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        tenant_id = db.add_tenant(name, email)
        contact_id = xero_api.create_or_update_contact({'name': name, 'email': email})
        db.update_tenant_xero(tenant_id, contact_id)
        return redirect('/tenants')
    tenants = db.get_tenants()
    return render_template('tenants.html', tenants=tenants)


@app.route('/invoices', methods=['GET', 'POST'])
def invoices():
    if request.method == 'POST':
        tenant_id = int(request.form['tenant_id'])
        amount = float(request.form['amount'])
        invoice_id = db.add_invoice(tenant_id, amount)
        tenants = {t[0]: t for t in db.get_tenants()}
        tenant = tenants[tenant_id]
        if not tenant[3]:
            contact_id = xero_api.create_or_update_contact({'name': tenant[1], 'email': tenant[2]})
            db.update_tenant_xero(tenant_id, contact_id)
        else:
            contact_id = tenant[3]
        xero_id, url = xero_api.create_invoice({'amount': amount}, contact_id)
        db.update_invoice_xero(invoice_id, xero_id, url)
        return redirect('/')
    tenants = db.get_tenants()
    return render_template('invoices.html', tenants=tenants)


if __name__ == '__main__':
    app.run(debug=True)
