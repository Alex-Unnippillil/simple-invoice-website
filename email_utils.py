import os
from email.message import EmailMessage
from typing import List


# NOTE: This helper only logs emails for demonstration purposes.
def send_email(recipients: List[str], subject: str, body: str, attachments: List[str] | None = None) -> None:
    """Pretend to send an email with optional attachments."""
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = "noreply@example.com"
    msg["To"] = ", ".join(recipients)
    msg.set_content(body)

    for path in attachments or []:
        with open(path, "rb") as f:
            data = f.read()
        msg.add_attachment(
            data,
            maintype="application",
            subtype="octet-stream",
            filename=os.path.basename(path),
        )

    # For this example we simply print the email instead of sending it.
    print(f"Email prepared for {recipients} with {len(attachments or [])} attachments")
