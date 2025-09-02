import os, sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from unittest.mock import MagicMock, patch

from stripe_subscription import (
    Lease,
    create_subscription_for_lease,
    refresh_subscription_status,
)


def test_create_subscription_links_id():
    lease = Lease(id=1, monthly_rent=1000, stripe_customer_id="cus_123")
    with patch("stripe_subscription.stripe.Subscription.create") as create:
        create.return_value = MagicMock(id="sub_123")
        sub = create_subscription_for_lease(lease)
        create.assert_called_once()
        assert lease.stripe_subscription_id == "sub_123"
        assert sub.id == "sub_123"


def test_refresh_subscription_status():
    lease = Lease(
        id=1,
        monthly_rent=1000,
        stripe_customer_id="cus_123",
        stripe_subscription_id="sub_456",
    )
    with patch("stripe_subscription.stripe.Subscription.retrieve") as retrieve:
        retrieve.return_value = MagicMock(status="active")
        status = refresh_subscription_status(lease)
        retrieve.assert_called_once_with("sub_456")
        assert status == "active"
        assert lease.status == "active"
