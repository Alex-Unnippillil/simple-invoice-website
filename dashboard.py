from collections import defaultdict

from database import get_connection, init_db


def recovery_rate_by_decline_reason(db_path=None) -> dict[str, float]:
    """Compute recovery rate by decline code."""
    init_db(db_path)
    if db_path is None:
        from database import DB_PATH
        db_path = DB_PATH

    with get_connection(db_path) as conn:
        rows = conn.execute(
            """
            SELECT payment_id, attempt_no, status, decline_code
            FROM payment_attempts
            ORDER BY payment_id, attempt_no
            """
        ).fetchall()

    # Determine first decline per payment and whether it later succeeded
    first_decline: dict[str, str] = {}
    success_after_decline: defaultdict[str, set[str]] = defaultdict(set)
    total_failures: defaultdict[str, set[str]] = defaultdict(set)

    for payment_id, attempt_no, status, decline_code in rows:
        if payment_id not in first_decline and status == "failed" and decline_code:
            first_decline[payment_id] = decline_code
            total_failures[decline_code].add(payment_id)
        if status == "succeeded" and payment_id in first_decline:
            code = first_decline[payment_id]
            success_after_decline[code].add(payment_id)

    rates: dict[str, float] = {}
    for code, payments in total_failures.items():
        recovered = len(success_after_decline.get(code, set()))
        rate = recovered / len(payments) if payments else 0.0
        rates[code] = rate
    return rates


if __name__ == "__main__":
    rates = recovery_rate_by_decline_reason()
    for code, rate in rates.items():
        print(f"Decline code {code}: recovery rate {rate:.2%}")
