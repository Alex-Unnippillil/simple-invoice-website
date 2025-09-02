from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from database import get_connection, init_db


@dataclass
class PaymentResult:
    payment_id: str
    attempt_no: int
    status: str
    decline_code: Optional[str]
    timestamp: str


class PaymentProcessor:
    """Record payment attempts and their outcomes."""

    def __init__(self, db_path=None):
        if db_path:
            init_db(db_path)
            self.db_path = db_path
        else:
            init_db()
            from database import DB_PATH
            self.db_path = DB_PATH

    def record_attempt(
        self, payment_id: str, attempt_no: int, status: str, decline_code: Optional[str] = None
    ) -> PaymentResult:
        """Persist a payment attempt in the database."""
        timestamp = datetime.utcnow().isoformat()
        with get_connection(self.db_path) as conn:
            conn.execute(
                """
                INSERT INTO payment_attempts(payment_id, attempt_no, status, decline_code, timestamp)
                VALUES (?, ?, ?, ?, ?)
                """,
                (payment_id, attempt_no, status, decline_code, timestamp),
            )
            conn.commit()
        return PaymentResult(payment_id, attempt_no, status, decline_code, timestamp)

    def attempt_payment(
        self,
        payment_id: str,
        simulate_results: list[tuple[str, Optional[str]]],
    ) -> list[PaymentResult]:
        """Simulate payment processing and record each attempt.

        Args:
            payment_id: Identifier for the payment.
            simulate_results: A list of tuples in the form (status, decline_code).
                Each tuple represents the outcome of an attempt. The first tuple is
                for attempt_no=1, the next for attempt_no=2, etc. When status is
                'succeeded', decline_code should be None.

        Returns:
            List of PaymentResult entries recorded.
        """
        results: list[PaymentResult] = []
        for attempt_no, (status, decline_code) in enumerate(simulate_results, start=1):
            result = self.record_attempt(
                payment_id, attempt_no, status, decline_code
            )
            results.append(result)
            if status == "succeeded":
                break
        return results
