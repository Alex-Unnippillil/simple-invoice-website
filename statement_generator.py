from pathlib import Path
from datetime import datetime
from typing import Dict

from fpdf import FPDF

from database import get_conn

ORGANIZATION_NAME = "Simple Rentals LLC"
STATEMENTS_DIR = Path('statements')
STATEMENTS_DIR.mkdir(exist_ok=True)


def aggregate(property_id: str, year: int, month: int) -> Dict[str, float]:
    """Aggregate transactions by type for a property and month."""
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        '''SELECT type, SUM(amount) as total FROM transactions
           WHERE property_id=? AND strftime('%Y', date)=? AND strftime('%m', date)=?
           GROUP BY type''',
        (property_id, str(year), f"{month:02d}")
    )
    rows = cur.fetchall()
    conn.close()
    aggregates = {row['type']: row['total'] for row in rows}
    for key in ['charge', 'receipt', 'fee', 'payout']:
        aggregates.setdefault(key, 0.0)
    return aggregates


def generate_pdf(property_id: str, year: int, month: int, aggregates: Dict[str, float]) -> Path:
    """Create PDF statement with organization branding."""
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", 'B', 16)
    pdf.cell(200, 10, ORGANIZATION_NAME, ln=True, align='C')
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, f"Statement for Property {property_id} - {month:02d}/{year}", ln=True, align='L')
    pdf.ln(5)
    for key, label in (
        ('charge', 'Charges'),
        ('receipt', 'Receipts'),
        ('fee', 'Fees'),
        ('payout', 'Payouts'),
    ):
        pdf.cell(200, 10, f"{label}: ${aggregates[key]:.2f}", ln=True, align='L')
    output_path = STATEMENTS_DIR / f"statement_{property_id}_{year}_{month:02d}.pdf"
    pdf.output(str(output_path))
    return output_path


def record_statement(property_id: str, year: int, month: int, pdf_path: Path) -> None:
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        '''INSERT INTO statements(property_id, year, month, pdf_path, generated_at)
           VALUES (?,?,?,?,?)''',
        (property_id, year, month, str(pdf_path), datetime.utcnow().isoformat())
    )
    conn.commit()
    conn.close()


def generate_statement(property_id: str, year: int, month: int) -> Path:
    aggregates = aggregate(property_id, year, month)
    pdf_path = generate_pdf(property_id, year, month, aggregates)
    record_statement(property_id, year, month, pdf_path)
    return pdf_path
