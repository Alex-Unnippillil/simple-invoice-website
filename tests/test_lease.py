import sys
import pathlib
import pytest

# Ensure project root is on sys.path
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))

from lease import Lease, LeaseStatus


def test_activation_and_pause():
    lease = Lease(id=1, tenant="Alice")
    lease.activate()
    assert lease.status == LeaseStatus.ACTIVE
    assert lease.activated_at is not None

    lease.pause()
    assert lease.status == LeaseStatus.PAUSED
    assert lease.paused_at is not None


def test_termination_generates_invoice_and_logs():
    lease = Lease(id=2, tenant="Bob", balance=100.0)
    lease.activate()
    invoice = lease.terminate()

    assert lease.status == LeaseStatus.TERMINATED
    assert lease.terminated_at is not None
    assert invoice["final_balance"] == 100.0
    actions = [event.action for event in lease.audit_log]
    assert actions[-2:] == ["terminate", "final_invoice"]


def test_invalid_transitions():
    lease = Lease(id=3, tenant="Charlie")
    with pytest.raises(ValueError):
        lease.pause()
    lease.activate()
    lease.terminate()
    with pytest.raises(ValueError):
        lease.activate()
