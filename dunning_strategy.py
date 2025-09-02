from dashboard import recovery_rate_by_decline_reason


def recommend_actions(db_path=None) -> dict[str, str]:
    """Return simple dunning recommendations based on recovery rates."""
    rates = recovery_rate_by_decline_reason(db_path)
    recommendations: dict[str, str] = {}
    for code, rate in rates.items():
        if rate <= 0.2:
            action = "Escalate after first retry"
        elif rate <= 0.5:
            action = "Retry twice before escalation"
        else:
            action = "Allow multiple retries"
        recommendations[code] = action
    return recommendations


if __name__ == "__main__":
    recs = recommend_actions()
    for code, action in recs.items():
        print(f"Decline code {code}: {action}")
