import os
from datetime import datetime
from reportlab.pdfgen import canvas
import pandas as pd


def generate_pdf(report_type: str) -> str:
    """Create a simple PDF report and return the file path."""
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    filename = f"{report_type}_{timestamp}.pdf"
    c = canvas.Canvas(filename)
    c.drawString(100, 750, f"Report: {report_type}")
    c.save()
    return os.path.abspath(filename)


def generate_csv(report_type: str) -> str:
    """Create a simple CSV report and return the file path."""
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    filename = f"{report_type}_{timestamp}.csv"
    df = pd.DataFrame({"col1": [1, 2], "col2": [3, 4]})
    df.to_csv(filename, index=False)
    return os.path.abspath(filename)
