from datetime import datetime, time, timezone

from notifications import UserSettings, schedule_notification


def test_schedule_respects_quiet_hours_overnight():
    settings = UserSettings("America/New_York", time(22), time(7))
    send_time = datetime(2023, 8, 1, 3, tzinfo=timezone.utc)
    scheduled = schedule_notification(settings, send_time)
    assert scheduled == datetime(2023, 8, 1, 11, tzinfo=timezone.utc)


def test_schedule_within_day_quiet_hours():
    settings = UserSettings("Europe/London", time(12), time(14))
    send_time = datetime(2023, 6, 1, 12, 30, tzinfo=timezone.utc)
    scheduled = schedule_notification(settings, send_time)
    assert scheduled == datetime(2023, 6, 1, 13, tzinfo=timezone.utc)


def test_schedule_when_not_quiet():
    settings = UserSettings("Asia/Tokyo", time(23), time(6))
    send_time = datetime(2023, 6, 1, 6, tzinfo=timezone.utc)
    scheduled = schedule_notification(settings, send_time)
    assert scheduled == send_time
