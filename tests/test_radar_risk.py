import logging
import os
import sys

# Ensure the package can be imported when tests are executed from the tests
# directory.
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from simple_invoice.payments import PaymentRecord, capture_radar_risk
from simple_invoice.views import payment_detail_html


def sample_payment_intent(risk_score=42, risk_level="normal"):
    outcome = {
        "risk_score": risk_score,
        "risk_level": risk_level,
    }
    charge = {"id": "ch_test", "outcome": outcome}
    return {"id": "pi_test", "charges": {"data": [charge]}}


def test_capture_radar_risk_populates_record():
    record = PaymentRecord(id="pay_1", amount=1000)
    capture_radar_risk(sample_payment_intent(), record)

    assert record.risk_score == 42
    assert record.risk_level == "normal"
    assert record.radar_link.endswith("/ch_test")


def test_payment_detail_html_contains_link_and_summary():
    record = PaymentRecord(id="pay_2", amount=1000)
    capture_radar_risk(sample_payment_intent(70, "elevated"), record)

    html = payment_detail_html(record)
    assert "elevated" in html
    assert "Stripe Radar analytics" in html
    assert record.radar_link in html


def test_missing_risk_logs_warning(caplog):
    record = PaymentRecord(id="pay_3", amount=500)
    # Simulate outcome without risk information
    capture_radar_risk(sample_payment_intent(risk_score=None, risk_level=None), record)

    assert any(
        "missing Radar risk score" in message
        for message in caplog.text.splitlines()
    )
