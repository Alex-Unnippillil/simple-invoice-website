import sqlite3
from datetime import datetime
from pathlib import Path

DB_PATH = Path('data.db')


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_conn()
    cur = conn.cursor()
    # Transactions table
    cur.execute(
        '''CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            property_id TEXT NOT NULL,
            date TEXT NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('charge','receipt','fee','payout')),
            amount REAL NOT NULL
        )'''
    )
    # Owners table
    cur.execute(
        '''CREATE TABLE IF NOT EXISTS owners (
            property_id TEXT PRIMARY KEY,
            email TEXT NOT NULL
        )'''
    )
    # Statements history table
    cur.execute(
        '''CREATE TABLE IF NOT EXISTS statements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            property_id TEXT NOT NULL,
            year INTEGER NOT NULL,
            month INTEGER NOT NULL,
            pdf_path TEXT NOT NULL,
            generated_at TEXT NOT NULL
        )'''
    )
    conn.commit()
    conn.close()


if __name__ == '__main__':
    init_db()
