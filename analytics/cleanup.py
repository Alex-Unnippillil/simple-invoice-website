"""Helpers for removing or anonymising old experiment analytics data."""

from __future__ import annotations

import sqlite3
from datetime import datetime, timedelta
from pathlib import Path

DB_PATH = Path("analytics.db")


DEFAULT_TTL_DAYS = 90


def purge_expired_events(*, ttl_days: int = DEFAULT_TTL_DAYS, db_path: Path = DB_PATH) -> int:
    """Delete analytics rows older than the supplied TTL.

    Returns the number of deleted rows."""
    cutoff = datetime.utcnow() - timedelta(days=ttl_days)
    with sqlite3.connect(db_path) as conn:
        cur = conn.execute(
            "DELETE FROM analytics_events WHERE created_at < ?", (cutoff,)
        )
        return cur.rowcount


def anonymize_old_experiments(*, ttl_days: int = DEFAULT_TTL_DAYS, db_path: Path = DB_PATH) -> int:
    """Remove potentially identifying event data for outdated experiments.

    Returns the number of anonymised rows."""
    cutoff = datetime.utcnow() - timedelta(days=ttl_days)
    with sqlite3.connect(db_path) as conn:
        cur = conn.execute(
            "UPDATE analytics_events SET event_data = NULL WHERE created_at < ?",
            (cutoff,),
        )
        return cur.rowcount


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Cleanup analytics experiment data")
    sub = parser.add_subparsers(dest="action", required=True)

    purge_cmd = sub.add_parser("purge", help="Delete events older than TTL")
    purge_cmd.add_argument("ttl", type=int, help="Retention window in days")

    anon_cmd = sub.add_parser("anonymize", help="Anonymize events older than TTL")
    anon_cmd.add_argument("ttl", type=int, help="Retention window in days")

    args = parser.parse_args()
    if args.action == "purge":
        removed = purge_expired_events(ttl_days=args.ttl)
        print(f"Purged {removed} rows")
    else:
        updated = anonymize_old_experiments(ttl_days=args.ttl)
        print(f"Anonymized {updated} rows")
