import boto3
import os
import urllib.parse
import subprocess
import logging
from typing import Dict

s3_client = boto3.client('s3')
sns_client = boto3.client('sns')
logger = logging.getLogger()
logger.setLevel(logging.INFO)

ADMIN_SNS_TOPIC_ARN = os.environ.get('ADMIN_SNS_TOPIC_ARN')
QUARANTINE_BUCKET = os.environ.get('QUARANTINE_BUCKET')


def update_metadata(bucket: str, key: str, metadata: Dict[str, str]) -> None:
    """Update object metadata preserving existing values."""
    head = s3_client.head_object(Bucket=bucket, Key=key)
    current_meta = head.get('Metadata', {})
    current_meta.update(metadata)
    s3_client.copy_object(
        Bucket=bucket,
        Key=key,
        CopySource={'Bucket': bucket, 'Key': key},
        Metadata=current_meta,
        MetadataDirective='REPLACE',
        ContentType=head.get('ContentType', 'binary/octet-stream'),
    )


def notify_admin(message: str) -> None:
    if ADMIN_SNS_TOPIC_ARN:
        sns_client.publish(TopicArn=ADMIN_SNS_TOPIC_ARN, Message=message)
    else:
        logger.warning('ADMIN_SNS_TOPIC_ARN not set; notification not sent')


def lambda_handler(event, context):
    for record in event.get('Records', []):
        bucket = record['s3']['bucket']['name']
        key = urllib.parse.unquote_plus(record['s3']['object']['key'])

        # Mark file as pending
        update_metadata(bucket, key, {'av-status': 'PENDING'})

        download_path = f"/tmp/{os.path.basename(key)}"
        s3_client.download_file(bucket, key, download_path)

        result = subprocess.run(['clamscan', '--stdout', download_path],
                                capture_output=True, text=True)
        infected = result.returncode == 1

        if infected:
            update_metadata(bucket, key, {'av-status': 'INFECTED'})
            if QUARANTINE_BUCKET:
                s3_client.copy_object(
                    Bucket=QUARANTINE_BUCKET,
                    Key=key,
                    CopySource={'Bucket': bucket, 'Key': key},
                    MetadataDirective='COPY',
                )
            s3_client.delete_object(Bucket=bucket, Key=key)
            notify_admin(f"Infected file removed: s3://{bucket}/{key}\n{result.stdout}")
        else:
            update_metadata(bucket, key, {'av-status': 'CLEAN'})

        os.remove(download_path)
