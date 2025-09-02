import logging
from dataclasses import dataclass
from typing import Optional, Dict, Any


@dataclass
class PaymentRecord:
    """Representation of a payment stored by the invoicing system.

    Only the fields required for the Radar tracking features are
    modelled here. Additional fields would normally include customer
    information, amount, currency, etc.
    """

    id: str
    amount: int
    risk_score: Optional[int] = None
    risk_level: Optional[str] = None
    radar_link: Optional[str] = None


def capture_radar_risk(payment_intent: Dict[str, Any], record: PaymentRecord) -> None:
    """Populate ``record`` with Stripe Radar information.

    The function extracts the Radar risk assessment from the payment
    intent ``payment_intent`` returned by Stripe.  Any available risk
    score and level are stored on ``record`` together with a link to the
    Stripe dashboard where the full Radar analytics for the payment can
    be inspected.

    A missing risk score triggers a warning so that operators can monitor
    potential issues with the Stripe integration.  Unexpected errors are
    logged as errors to ease debugging.
    """

    try:
        charges = payment_intent.get("charges", {}).get("data", [])
        charge = charges[0] if charges else None
        if not charge:
            logging.warning("Payment %s missing charge information", record.id)
            return

        outcome = charge.get("outcome", {})
        record.risk_score = outcome.get("risk_score")
        record.risk_level = outcome.get("risk_level")
        record.radar_link = f"https://dashboard.stripe.com/payments/{charge.get('id')}"

        if record.risk_score is None:
            logging.warning(
                "Payment %s missing Radar risk score", record.id
            )
    except Exception as exc:  # pragma: no cover - defensive programming
        logging.error(
            "Error capturing Radar risk for payment %s: %s", record.id, exc
        )
