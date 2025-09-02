from flask import Flask, jsonify, render_template, request, send_file, url_for
from itsdangerous import URLSafeSerializer, BadSignature, SignatureExpired
import time
from archive import get_document_keys, stream_zip_with_manifest

app = Flask(__name__)
# Secret key for signing temporary links; in real deployments use env vars.
app.secret_key = "change-me"
serializer = URLSafeSerializer(app.secret_key)


@app.route("/leases/<lease_id>/documents")
def lease_documents(lease_id: str):
    """Render a simple page listing documents with download button."""
    keys = get_document_keys(lease_id)
    return render_template("lease_documents.html", lease_id=lease_id, keys=keys)


@app.route("/leases/<lease_id>/documents/link")
def generate_link(lease_id: str):
    """Return a temporary download link for the lease's document archive."""
    token = serializer.dumps({"lease_id": lease_id, "ts": int(time.time())})
    url = url_for("download_token", token=token, _external=True)
    return jsonify({"url": url})


@app.route("/download/<token>")
def download_token(token: str):
    """Download archive after validating temporary token."""
    try:
        data = serializer.loads(token, max_age=300)  # five-minute expiry
    except (BadSignature, SignatureExpired):
        return "Link expired or invalid", 400

    lease_id = data["lease_id"]
    store = request.args.get("store") == "1"
    buffer = stream_zip_with_manifest(lease_id, store=store)
    return send_file(
        buffer,
        mimetype="application/zip",
        as_attachment=True,
        download_name=f"lease_{lease_id}.zip",
    )


@app.route("/leases/<lease_id>/documents/archive")
def direct_archive(lease_id: str):
    """Directly stream ZIP archive without generating a link."""
    store = request.args.get("store") == "1"
    buffer = stream_zip_with_manifest(lease_id, store=store)
    return send_file(
        buffer,
        mimetype="application/zip",
        as_attachment=True,
        download_name=f"lease_{lease_id}.zip",
    )


if __name__ == "__main__":
    app.run(debug=True)
