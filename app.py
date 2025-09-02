from flask import Flask, send_file, request, jsonify
from pathlib import Path
import os
import smtplib
from email.message import EmailMessage

from database import init_db, get_conn
from statement_generator import generate_statement

app = Flask(__name__)

init_db()


@app.route('/statements/<property_id>/<int:year>/<int:month>/download')
def download_statement(property_id: str, year: int, month: int):
    pdf_path = ensure_statement(property_id, year, month)
    return send_file(pdf_path, as_attachment=True)


def ensure_statement(property_id: str, year: int, month: int) -> Path:
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        'SELECT pdf_path FROM statements WHERE property_id=? AND year=? AND month=?',
        (property_id, year, month)
    )
    row = cur.fetchone()
    conn.close()
    if row:
        return Path(row['pdf_path'])
    return generate_statement(property_id, year, month)


@app.route('/statements/<property_id>/<int:year>/<int:month>/email', methods=['POST'])
def email_statement(property_id: str, year: int, month: int):
    data = request.get_json(force=True)
    email = data.get('email')
    if not email:
        return jsonify({'error': 'email required'}), 400
    pdf_path = ensure_statement(property_id, year, month)
    try:
        send_email(email, pdf_path)
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500
    return jsonify({'status': 'sent'})


def send_email(to_email: str, pdf_path: Path):
    msg = EmailMessage()
    msg['Subject'] = f"Your statement {pdf_path.stem}"
    msg['From'] = os.getenv('SMTP_FROM', 'noreply@example.com')
    msg['To'] = to_email
    msg.set_content('Please find attached your monthly statement.')
    with open(pdf_path, 'rb') as f:
        data = f.read()
    msg.add_attachment(data, maintype='application', subtype='pdf', filename=pdf_path.name)

    smtp_host = os.getenv('SMTP_HOST')
    smtp_port = int(os.getenv('SMTP_PORT', 25))
    if not smtp_host:
        raise RuntimeError('SMTP_HOST not configured')
    with smtplib.SMTP(smtp_host, smtp_port) as smtp:
        smtp.send_message(msg)


if __name__ == '__main__':
    app.run(debug=True)
