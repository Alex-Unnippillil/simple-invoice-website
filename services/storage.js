let S3Client, PutObjectCommand, GetObjectCommand, getSignedUrl;
try {
  ({ S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3'));
  ({ getSignedUrl } = require('@aws-sdk/s3-request-presigner'));
} catch (e) {
  // AWS SDK not installed; local storage will be used.
}
const path = require('path');
const fs = require('fs');

function getS3Client() {
  if (!process.env.AWS_REGION) return null;
  return new S3Client({ region: process.env.AWS_REGION });
}

async function uploadBuffer(buffer, key, mimetype) {
  const client = getS3Client();
  if (!client) {
    const uploadDir = path.join(__dirname, '../uploads');
    fs.mkdirSync(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, key);
    fs.writeFileSync(filePath, buffer);
    return { storageKey: key, local: true };
  }
  const cmd = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  });
  await client.send(cmd);
  return { storageKey: key, local: false };
}

async function generateDownloadUrl(storageKey) {
  const client = getS3Client();
  if (!client) {
    return `/uploads/${storageKey}`;
  }
  const command = new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: storageKey });
  return await getSignedUrl(client, command, { expiresIn: 3600 });
}

module.exports = { uploadBuffer, generateDownloadUrl };
