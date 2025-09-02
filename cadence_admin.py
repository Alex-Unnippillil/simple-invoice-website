"""Simple in-memory admin interface for managing retry cadences."""

# default cadence uses immediate, 3 days and 7 days after the failed payment
_cadence_schedule = {}
_default_schedule = [0, 3, 7]

def get_cadence(organization_id):
    """Return the retry schedule for an organization."""
    return _cadence_schedule.get(organization_id, list(_default_schedule))

def set_cadence(organization_id, schedule):
    """Update the retry schedule for an organization.

    Parameters
    ----------
    organization_id: str
        identifier for the organization whose schedule is adjusted.
    schedule: iterable
        collection of integers representing days after failure when retries occur.
    """
    _cadence_schedule[organization_id] = list(schedule)
