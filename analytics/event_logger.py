"""Logging utilities for analytics events.

Events are stored in a local SQLite database with experiment and variant
identifiers so that experiments can be analyzed later."""

from __future__ import annotations

import json
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Any, Mapping, Optional

DB_PATH = Path("analytics.db")


def _ensure_schema(db_path: Path = DB_PATH) -> None:
    """Create the analytics table if it does not already exist."""
    with sqlite3.connect(db_path) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS analytics_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_name TEXT NOT NULL,
                event_data TEXT,
                experiment_id TEXT,
                variant_id TEXT,
                created_at TIMESTAMP NOT NULL
            )
            """
        )
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at)"
        )


def log_event(
    event_name: str,
    event_data: Optional[Mapping[str, Any]] = None,
    *,
    experiment_id: Optional[str] = None,
    variant_id: Optional[str] = None,
    db_path: Path = DB_PATH,
) -> None:
    """Persist an analytics event with experiment metadata.

    Parameters
    ----------
    event_name:
        The name of the event that occurred.
    event_data:
        Arbitrary structured data about the event. Must be JSON serialisable.
    experiment_id:
        Identifier for the experiment that generated the event.
    variant_id:
        Identifier for the specific variant within the experiment.
    db_path:
        Path to the SQLite database used for storage.
    """

    _ensure_schema(db_path)

    payload = json.dumps(event_data or {})
    with sqlite3.connect(db_path) as conn:
        conn.execute(
            """
            INSERT INTO analytics_events (event_name, event_data, experiment_id, variant_id, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (event_name, payload, experiment_id, variant_id, datetime.utcnow()),
        )
