const Minio = require('minio');

function createClient() {
  return new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT || '9000', 10),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
  });
}

async function uploadBuffer(buffer, key, mimetype) {
  const client = createClient();
  await client.putObject(process.env.MINIO_BUCKET, key, buffer, { 'Content-Type': mimetype });
  return { storageKey: key };
}

async function generateDownloadUrl(storageKey) {
  const client = createClient();
  return await client.presignedGetObject(process.env.MINIO_BUCKET, storageKey, 60 * 60);
}

module.exports = { uploadBuffer, generateDownloadUrl };
