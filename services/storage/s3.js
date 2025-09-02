const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

function createClient() {
  return new S3Client({
    region: process.env.AWS_REGION,
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
    credentials: process.env.S3_ACCESS_KEY
      ? {
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_KEY,
        }
      : undefined,
  });
}

async function uploadBuffer(buffer, key, mimetype) {
  const client = createClient();
  const cmd = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  });
  await client.send(cmd);
  return { storageKey: key };
}

async function generateDownloadUrl(storageKey) {
  const client = createClient();
  const command = new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: storageKey });
  return await getSignedUrl(client, command, { expiresIn: 3600 });
}

module.exports = { uploadBuffer, generateDownloadUrl };
