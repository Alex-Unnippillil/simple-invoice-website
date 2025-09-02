from __future__ import annotations

"""Utility for scheduling notifications respecting user time zones and quiet hours."""

from dataclasses import dataclass
from datetime import datetime, time, timedelta, timezone
from zoneinfo import ZoneInfo


@dataclass
class UserSettings:
    """Configuration for a user's notification preferences.

    Attributes:
        timezone: IANA timezone name, e.g. ``"America/New_York"``.
        quiet_hours_start: Local time when quiet hours begin (inclusive).
        quiet_hours_end: Local time when quiet hours end (exclusive).
    """

    timezone: str
    quiet_hours_start: time
    quiet_hours_end: time

    def tzinfo(self) -> ZoneInfo:
        return ZoneInfo(self.timezone)


def _is_quiet_time(settings: UserSettings, local_dt: datetime) -> bool:
    """Return True if the datetime falls within the user's quiet hours."""
    start = settings.quiet_hours_start
    end = settings.quiet_hours_end
    local_time = local_dt.time()

    if start < end:
        return start <= local_time < end
    return local_time >= start or local_time < end


def schedule_notification(settings: UserSettings, send_time_utc: datetime) -> datetime:
    """Return the UTC datetime when a notification should be sent.

    If the desired send time falls within the user's quiet hours, the returned
    datetime is postponed to the end of the quiet period respecting the user's
    local timezone.
    """
    if send_time_utc.tzinfo is None or send_time_utc.tzinfo != timezone.utc:
        raise ValueError("send_time_utc must be timezone-aware and in UTC")

    tz = settings.tzinfo()
    local_dt = send_time_utc.astimezone(tz)

    if not _is_quiet_time(settings, local_dt):
        return send_time_utc

    start = settings.quiet_hours_start
    end = settings.quiet_hours_end

    if start < end:
        # Quiet hours are within a single day
        target_local = datetime.combine(local_dt.date(), end, tzinfo=tz)
        if local_dt.time() >= end:
            target_local += timedelta(days=1)
    else:
        # Quiet hours wrap past midnight
        if local_dt.time() >= start:
            target_local = datetime.combine(local_dt.date() + timedelta(days=1), end, tzinfo=tz)
        else:
            target_local = datetime.combine(local_dt.date(), end, tzinfo=tz)

    return target_local.astimezone(ZoneInfo("UTC"))

