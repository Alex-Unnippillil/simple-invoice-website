from flask import Flask, request, render_template, redirect, url_for, flash
import sqlite3

app = Flask(__name__)
app.secret_key = 'dev'


def get_db():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.execute(
        '''CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            phone TEXT UNIQUE,
            email_risky INTEGER DEFAULT 0,
            phone_risky INTEGER DEFAULT 0
        )'''
    )
    conn.commit()
    conn.close()


init_db()


@app.route('/')
def index():
    conn = get_db()
    contacts = conn.execute('SELECT * FROM contacts').fetchall()
    conn.close()
    return render_template('index.html', contacts=contacts)


@app.post('/add')
def add_contact():
    email = request.form.get('email') or None
    phone = request.form.get('phone') or None
    conn = get_db()
    conn.execute('INSERT INTO contacts (email, phone) VALUES (?, ?)', (email, phone))
    conn.commit()
    conn.close()
    return redirect(url_for('index'))


@app.route('/send/email/<int:id>', methods=['POST'])
def send_email(id):
    conn = get_db()
    contact = conn.execute('SELECT * FROM contacts WHERE id=?', (id,)).fetchone()
    conn.close()
    if contact['email_risky']:
        flash('Warning: email marked risky')
    else:
        flash('Email sent (simulated)')
    return redirect(url_for('index'))


@app.route('/send/phone/<int:id>', methods=['POST'])
def send_phone(id):
    conn = get_db()
    contact = conn.execute('SELECT * FROM contacts WHERE id=?', (id,)).fetchone()
    conn.close()
    if contact['phone_risky']:
        flash('Warning: phone marked risky')
    else:
        flash('SMS sent (simulated)')
    return redirect(url_for('index'))


@app.post('/webhook/resend')
def webhook_resend():
    data = request.get_json() or {}
    email = data.get('email')
    if not email:
        return {'error': 'missing email'}, 400
    conn = get_db()
    conn.execute(
        'INSERT INTO contacts (email, email_risky) VALUES (?, 1) ON CONFLICT(email) DO UPDATE SET email_risky=1',
        (email,),
    )
    conn.commit()
    conn.close()
    return {'status': 'ok'}


@app.post('/webhook/twilio')
def webhook_twilio():
    data = request.get_json() or {}
    phone = data.get('phone')
    if not phone:
        return {'error': 'missing phone'}, 400
    conn = get_db()
    conn.execute(
        'INSERT INTO contacts (phone, phone_risky) VALUES (?, 1) ON CONFLICT(phone) DO UPDATE SET phone_risky=1',
        (phone,),
    )
    conn.commit()
    conn.close()
    return {'status': 'ok'}


if __name__ == '__main__':
    app.run(debug=True)
