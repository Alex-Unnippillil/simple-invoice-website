from dataclasses import dataclass
from typing import Optional


@dataclass
class Organization:
    """Represents an organization using the invoicing system."""

    name: str
    tax_enabled: bool = False
    stripe_tax_rate: Optional[float] = None

    def enable_taxes(self, stripe_tax_rate: float) -> None:
        """Enable tax calculation for the organization.

        Args:
            stripe_tax_rate: The tax rate configured in Stripe (e.g., 0.07 for 7%).
        """
        self.tax_enabled = True
        self.stripe_tax_rate = stripe_tax_rate
