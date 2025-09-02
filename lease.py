from dataclasses import dataclass, field
from datetime import date
from typing import List, Tuple


@dataclass
class DepositInvoice:
    amount: float
    date: date


@dataclass
class DepositPayment:
    amount: float
    date: date


@dataclass
class LedgerEntry:
    entry_type: str  # deposit_invoice, deposit_payment, deposit_refund
    amount: float
    date: date
    note: str = ""


@dataclass
class Lease:
    tenant: str
    deposit_invoices: List[DepositInvoice] = field(default_factory=list)
    deposit_payments: List[DepositPayment] = field(default_factory=list)
    refunds: List[DepositPayment] = field(default_factory=list)
    ledger: List[LedgerEntry] = field(default_factory=list)

    def invoice_deposit(self, amount: float, invoice_date: date | None = None) -> DepositInvoice:
        """Record a deposit invoice and ledger entry."""
        invoice_date = invoice_date or date.today()
        invoice = DepositInvoice(amount, invoice_date)
        self.deposit_invoices.append(invoice)
        self.ledger.append(
            LedgerEntry("deposit_invoice", amount, invoice_date, "Security deposit invoice")
        )
        return invoice

    def pay_deposit(self, amount: float, payment_date: date | None = None) -> DepositPayment:
        """Record a deposit payment and ledger entry."""
        payment_date = payment_date or date.today()
        payment = DepositPayment(amount, payment_date)
        self.deposit_payments.append(payment)
        self.ledger.append(
            LedgerEntry("deposit_payment", -amount, payment_date, "Security deposit payment")
        )
        return payment

    def move_out(self, refund_amount: float, refund_date: date | None = None) -> str:
        """Generate a deposit refund receipt and ledger entry."""
        refund_date = refund_date or date.today()
        refund = DepositPayment(refund_amount, refund_date)
        self.refunds.append(refund)
        self.ledger.append(
            LedgerEntry("deposit_refund", refund_amount, refund_date, "Deposit refund")
        )
        return (
            f"Deposit refund receipt for {self.tenant}: $"
            f"{refund_amount:.2f} on {refund_date.isoformat()}"
        )

    def deposit_balance(self) -> float:
        """Return outstanding deposit balance."""
        invoiced = sum(i.amount for i in self.deposit_invoices)
        paid = sum(p.amount for p in self.deposit_payments)
        refunded = sum(r.amount for r in self.refunds)
        return invoiced - paid - refunded

    def deposit_history(self) -> List[Tuple[str, date, float]]:
        """Return sorted history of deposit invoices, payments and refunds."""
        history: List[Tuple[str, date, float]] = []
        for inv in self.deposit_invoices:
            history.append(("invoice", inv.date, inv.amount))
        for pay in self.deposit_payments:
            history.append(("payment", pay.date, pay.amount))
        for ref in self.refunds:
            history.append(("refund", ref.date, ref.amount))
        history.sort(key=lambda x: x[1])
        return history


def render_deposit_history_html(lease: Lease) -> str:
    """Produce a simple HTML table for deposit history and balance."""
    rows = ""
    for kind, dt, amt in lease.deposit_history():
        rows += f"<tr><td>{kind}</td><td>{dt}</td><td>{amt:.2f}</td></tr>"
    balance = lease.deposit_balance()
    html = (
        "<table><tr><th>Type</th><th>Date</th><th>Amount</th></tr>"
        f"{rows}</table><p>Outstanding balance: ${balance:.2f}</p>"
    )
    return html


if __name__ == "__main__":
    lease = Lease("John Doe")
    lease.invoice_deposit(500)
    lease.pay_deposit(500)
    print(render_deposit_history_html(lease))
    print("Balance:", lease.deposit_balance())
