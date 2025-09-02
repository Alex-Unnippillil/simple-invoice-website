import io
import json
import os
import time
import zipfile
from typing import Dict, List

# In-memory document store for example purposes.
# In a real application, replace with calls to external storage (e.g., S3).
DOCUMENT_STORE: Dict[str, Dict[str, bytes]] = {
    'lease1': {
        'contract.txt': b'Sample contract text for lease1',
        'invoice.pdf': b'%PDF-1.4 example invoice for lease1',
    },
    'lease2': {
        'agreement.txt': b'Lease agreement text for lease2',
    },
}


def get_document_keys(lease_id: str) -> List[str]:
    """Return the list of document keys for a lease."""
    return list(DOCUMENT_STORE.get(lease_id, {}).keys())


def stream_zip_with_manifest(lease_id: str, store: bool = False) -> io.BytesIO:
    """Create a ZIP archive of all lease documents including a manifest.

    Args:
        lease_id: Lease identifier whose documents should be archived.
        store: When True, persist a copy of the archive for audit purposes.

    Returns:
        BytesIO containing the ZIP archive positioned at start.
    """
    docs = DOCUMENT_STORE.get(lease_id, {})
    buffer = io.BytesIO()
    manifest = []
    with zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED) as zf:
        for key, content in docs.items():
            zf.writestr(key, content)
            manifest.append({'key': key, 'size': len(content)})
        zf.writestr('manifest.json', json.dumps(manifest))

    buffer.seek(0)

    if store:
        os.makedirs('archives', exist_ok=True)
        filename = f'archives/lease_{lease_id}_{int(time.time())}.zip'
        with open(filename, 'wb') as f:
            f.write(buffer.getbuffer())
        buffer.seek(0)

    return buffer
