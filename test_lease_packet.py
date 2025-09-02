from pathlib import Path

from PyPDF2 import PdfWriter

from lease_packet import (
    download_link,
    merge_signed_documents,
    request_landlord_countersign,
    store_final_packet,
)


def _blank_pdf(path: Path) -> Path:
    writer = PdfWriter()
    writer.add_blank_page(width=72, height=72)
    with path.open("wb") as f:
        writer.write(f)
    return path


def test_countersign_message():
    msg = request_landlord_countersign("123")
    assert "landlord" in msg
    msg_provider = request_landlord_countersign("123", provider="DocuSign")
    assert "DocuSign" in msg_provider


def test_merge_and_store(tmp_path: Path):
    summary = _blank_pdf(tmp_path / "summary.pdf")
    docs = [_blank_pdf(tmp_path / "sign1.pdf"), _blank_pdf(tmp_path / "sign2.pdf")]
    output = tmp_path / "123_final_packet.pdf"
    merged = merge_signed_documents(summary, docs, output)
    assert merged.exists()
    library = tmp_path / "library"
    stored = store_final_packet(merged, library)
    assert stored.exists() and stored.parent == library
    link = download_link("123", library)
    assert link and link.exists()
