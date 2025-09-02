from dataclasses import dataclass, field
from typing import List
from organization import Organization


@dataclass
class LineItem:
    description: str
    amount: float  # Pre-tax amount per line item


@dataclass
class Invoice:
    organization: Organization
    items: List[LineItem] = field(default_factory=list)

    def subtotal(self) -> float:
        """Return the subtotal (pre-tax) for the invoice."""
        return sum(item.amount for item in self.items)

    def tax_amount(self) -> float:
        """Calculate the tax for the invoice based on organization settings."""
        if self.organization.tax_enabled and self.organization.stripe_tax_rate is not None:
            return self.subtotal() * self.organization.stripe_tax_rate
        return 0.0

    def total(self) -> float:
        """Return the total amount including tax."""
        return self.subtotal() + self.tax_amount()
