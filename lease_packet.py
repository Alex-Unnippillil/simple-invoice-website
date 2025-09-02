"""Lease document management module.

This module provides a simple workflow for requesting landlord countersignatures,
merging signed lease documents, storing the final packet, and exposing a download
path. The implementation is simplified for demonstration purposes and does not
integrate with a real signature provider.
"""
from __future__ import annotations

import shutil
from pathlib import Path
from typing import Iterable, Optional

from PyPDF2 import PdfMerger


def request_landlord_countersign(lease_id: str, provider: Optional[str] = None) -> str:
    """Simulate requesting a landlord countersignature.

    Args:
        lease_id: Identifier for the lease.
        provider: Optional name of a third-party signature provider.

    Returns:
        A message describing how the countersignature was requested.
    """
    if provider:
        return f"Requested landlord signature for lease {lease_id} via {provider}."
    return f"Prompted landlord to sign lease {lease_id} within the app."


def merge_signed_documents(lease_summary: Path, signed_docs: Iterable[Path], output_path: Path) -> Path:
    """Merge lease summary with signed documents into a single PDF."""
    merger = PdfMerger()
    merger.append(str(lease_summary))
    for doc in signed_docs:
        merger.append(str(doc))
    with output_path.open("wb") as f:
        merger.write(f)
    merger.close()
    return output_path


def store_final_packet(merged_pdf: Path, document_library: Path) -> Path:
    """Store the merged PDF in the document library directory."""
    document_library.mkdir(parents=True, exist_ok=True)
    dest = document_library / merged_pdf.name
    shutil.copy(merged_pdf, dest)
    return dest


def download_link(lease_id: str, document_library: Path) -> Optional[Path]:
    """Return the path to the stored packet for download."""
    expected = document_library / f"{lease_id}_final_packet.pdf"
    return expected if expected.exists() else None
