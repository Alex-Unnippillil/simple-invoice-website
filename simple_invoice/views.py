from .payments import PaymentRecord


def payment_detail_html(payment: PaymentRecord) -> str:
    """Return an HTML snippet displaying payment risk information.

    The snippet includes a summary of the risk assessment and a link to
    the Stripe Radar dashboard for the associated charge when available.
    """

    risk_summary = "Unknown"
    if payment.risk_score is not None and payment.risk_level:
        risk_summary = f"{payment.risk_level} ({payment.risk_score})"

    link = (
        f'<a href="{payment.radar_link}" target="_blank">Stripe Radar analytics</a>'
        if payment.radar_link
        else ""
    )

    return f"<div class='risk-summary'>Risk: {risk_summary}<br>{link}</div>"
