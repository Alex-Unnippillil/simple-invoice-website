import os
import sys

import pytest

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from app import app, db, User, MAX_FAILED_LOGINS


@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.app_context():
        db.create_all()
        user = User(username='user', email='user@example.com')
        user.set_password('password')
        db.session.add(user)
        db.session.commit()
    with app.test_client() as client:
        yield client
    with app.app_context():
        db.drop_all()


def login(client, username, password):
    return client.post('/login', data={'username': username, 'password': password}, follow_redirects=True)


def test_lockout_after_failed_attempts(client, monkeypatch):
    sent = {}

    def fake_send(user):
        sent['email'] = user.email

    monkeypatch.setattr('app.send_notification', fake_send)

    for _ in range(MAX_FAILED_LOGINS):
        login(client, 'user', 'wrong')

    # account should be locked and email sent
    with app.app_context():
        user = User.query.filter_by(username='user').first()
        assert user.locked
        assert sent['email'] == 'user@example.com'


def test_admin_unlock(client):
    for _ in range(MAX_FAILED_LOGINS):
        login(client, 'user', 'wrong')

    # unlock via admin interface
    client.post('/admin', data={'username': 'user'}, follow_redirects=True)

    with app.app_context():
        user = User.query.filter_by(username='user').first()
        assert not user.locked
        assert user.failed_logins == 0

    # user can log in successfully now
    response = login(client, 'user', 'password')
    assert b'Logged in' in response.data
