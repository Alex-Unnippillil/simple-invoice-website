from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import List, Optional, Dict, Any


class LeaseStatus(Enum):
    """Possible states of a lease."""
    PENDING = "pending"
    ACTIVE = "active"
    PAUSED = "paused"
    TERMINATED = "terminated"


@dataclass
class LeaseEvent:
    """Represents a lifecycle event for auditing purposes."""
    action: str
    timestamp: datetime
    note: str = ""


@dataclass
class Lease:
    """Represents a lease with lifecycle management."""
    id: int
    tenant: str
    balance: float = 0.0
    status: LeaseStatus = LeaseStatus.PENDING
    activated_at: Optional[datetime] = None
    paused_at: Optional[datetime] = None
    terminated_at: Optional[datetime] = None
    audit_log: List[LeaseEvent] = field(default_factory=list)

    def _log(self, action: str, note: str = "") -> None:
        self.audit_log.append(LeaseEvent(action=action, timestamp=datetime.utcnow(), note=note))

    def activate(self) -> None:
        """Activate the lease from pending or paused states."""
        if self.status not in {LeaseStatus.PENDING, LeaseStatus.PAUSED}:
            raise ValueError("Lease cannot be activated from current status")
        self.status = LeaseStatus.ACTIVE
        self.activated_at = datetime.utcnow()
        self._log("activate")

    def pause(self) -> None:
        """Pause an active lease."""
        if self.status != LeaseStatus.ACTIVE:
            raise ValueError("Only active leases can be paused")
        self.status = LeaseStatus.PAUSED
        self.paused_at = datetime.utcnow()
        self._log("pause")

    def terminate(self) -> Dict[str, Any]:
        """Terminate the lease and generate a final invoice."""
        if self.status == LeaseStatus.TERMINATED:
            raise ValueError("Lease already terminated")
        self.status = LeaseStatus.TERMINATED
        self.terminated_at = datetime.utcnow()
        self._log("terminate")
        return self._generate_final_invoice()

    def _generate_final_invoice(self) -> Dict[str, Any]:
        """Create a final invoice/receipt with remaining charges or credits."""
        invoice = {
            "lease_id": self.id,
            "tenant": self.tenant,
            "final_balance": self.balance,
            "generated_at": datetime.utcnow(),
        }
        self._log("final_invoice", note=f"balance={self.balance}")
        return invoice
