const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const path = require('path');
const fs = require('fs');

function getS3Client() {
  if (!process.env.AWS_REGION) return null;
  return new S3Client({ region: process.env.AWS_REGION });
}

async function uploadBuffer(buffer, key, mimetype) {
  const client = getS3Client();
  if (!client) {
    const filePath = path.join(__dirname, '../uploads', key);
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
