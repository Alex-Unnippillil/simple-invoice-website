import sqlite3
from contextlib import contextmanager
from pathlib import Path

DB_PATH = Path(__file__).with_name("payments.db")


def init_db(path: Path = DB_PATH) -> None:
    """Initialize the payments database with the required table."""
    conn = sqlite3.connect(path)
    try:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS payment_attempts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                payment_id TEXT NOT NULL,
                attempt_no INTEGER NOT NULL,
                status TEXT NOT NULL,
                decline_code TEXT,
                timestamp TEXT NOT NULL
            )
            """
        )
        conn.commit()
    finally:
        conn.close()


@contextmanager
def get_connection(path: Path = DB_PATH):
    """Context manager that yields a SQLite connection."""
    conn = sqlite3.connect(path)
    try:
        yield conn
    finally:
        conn.close()
