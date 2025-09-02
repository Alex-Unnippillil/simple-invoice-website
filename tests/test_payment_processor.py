from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1]))

from dashboard import recovery_rate_by_decline_reason
from dunning_strategy import recommend_actions
from payment_processor import PaymentProcessor
from database import init_db


def test_record_and_dashboard(tmp_path: Path):
    db_file = tmp_path / "test.db"
    init_db(db_file)
    processor = PaymentProcessor(db_file)

    # Simulate a payment that fails then succeeds
    processor.attempt_payment(
        "pay_1", [("failed", "insufficient_funds"), ("succeeded", None)]
    )

    # Simulate a payment that fails twice and never recovers
    processor.attempt_payment(
        "pay_2",
        [
            ("failed", "insufficient_funds"),
            ("failed", "insufficient_funds"),
        ],
    )

    rates = recovery_rate_by_decline_reason(db_file)
    assert rates["insufficient_funds"] == 0.5

    recs = recommend_actions(db_file)
    assert recs["insufficient_funds"] == "Retry twice before escalation"
