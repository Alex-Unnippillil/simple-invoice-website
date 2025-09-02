from flask import Flask, request, render_template, redirect, url_for, flash
from models import db, User
import os
from email.message import EmailMessage
import smtplib

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'dev'

db.init_app(app)

MAX_FAILED_LOGINS = 3


def send_notification(user: User) -> None:
    """Send email notifying the user that their account was locked."""
    sender = os.environ.get('EMAIL_SENDER', 'noreply@example.com')
    msg = EmailMessage()
    msg['Subject'] = 'Account locked'
    msg['From'] = sender
    msg['To'] = user.email
    msg.set_content(
        f"Hello {user.username}, your account has been locked due to too many failed login attempts."
    )
    try:
        with smtplib.SMTP('localhost') as server:
            server.send_message(msg)
    except Exception:
        # In this environment we may not have an SMTP server; log to console instead
        print(f"Failed to send email to {user.email}")


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user is None or not user.check_password(password):
            if user:
                user.failed_logins += 1
                if user.failed_logins >= MAX_FAILED_LOGINS:
                    user.locked = True
                    send_notification(user)
                db.session.commit()
            flash('Invalid credentials')
            return redirect(url_for('login'))
        if user.locked:
            flash('Account locked')
            return redirect(url_for('login'))
        user.failed_logins = 0
        db.session.commit()
        return 'Logged in'
    return render_template('login.html')


@app.route('/admin', methods=['GET', 'POST'])
def admin():
    if request.method == 'POST':
        username = request.form['username']
        user = User.query.filter_by(username=username, locked=True).first()
        if user:
            user.locked = False
            user.failed_logins = 0
            db.session.commit()
            flash('User unlocked')
        return redirect(url_for('admin'))
    locked_users = User.query.filter_by(locked=True).all()
    return render_template('admin.html', users=locked_users)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
