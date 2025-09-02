import os
import time
import stripe

stripe.api_key = os.environ.get("STRIPE_API_KEY", "")

def create_test_clock(start_time: int | None = None) -> stripe.test_helpers.TestClock:
    """Create a Stripe Test Clock.

    Parameters
    ----------
    start_time: int | None
        Unix timestamp to start the clock at. If not provided, current time is used.

    Returns
    -------
    stripe.test_helpers.TestClock
        The created test clock object.
    """
    if start_time is None:
        start_time = int(time.time())
    return stripe.test_helpers.TestClock.create(frozen_time=start_time)


def advance_test_clock(clock_id: str, new_time: int) -> stripe.test_helpers.TestClock:
    """Advance an existing test clock to a new frozen time.

    Parameters
    ----------
    clock_id: str
        Identifier of the test clock to advance.
    new_time: int
        Unix timestamp to advance the clock to.

    Returns
    -------
    stripe.test_helpers.TestClock
        The updated test clock object.
    """
    return stripe.test_helpers.TestClock.advance(clock_id, frozen_time=new_time)
