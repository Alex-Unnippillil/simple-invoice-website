const assert = require('assert');
const path = require('path');
const S3rver = require('s3rver');

(async () => {
  const server = new S3rver({
    port: 4569,
    address: '127.0.0.1',
    directory: path.join(__dirname, '.s3'),
    configureBuckets: [{ name: 'test-bucket' }],
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER'
  });
  await server.run();

  try {
    // Test S3 adapter
    process.env.STORAGE_BACKEND = 's3';
    process.env.AWS_REGION = 'us-east-1';
    process.env.S3_BUCKET = 'test-bucket';
    process.env.S3_ENDPOINT = 'http://127.0.0.1:4569';
    process.env.S3_FORCE_PATH_STYLE = 'true';
    process.env.S3_ACCESS_KEY = 'S3RVER';
    process.env.S3_SECRET_KEY = 'S3RVER';

    let storage = require('../services/storage');
    await storage.uploadBuffer(Buffer.from('hello'), 's3.txt', 'text/plain');
    let url = await storage.generateDownloadUrl('s3.txt');
    let res = await fetch(url);
    let text = await res.text();
    assert.strictEqual(text, 'hello');

    // reset module cache for minio
    delete require.cache[require.resolve('../services/storage')];

    // Test MinIO adapter
    process.env.STORAGE_BACKEND = 'minio';
    process.env.MINIO_ENDPOINT = '127.0.0.1';
    process.env.MINIO_PORT = '4569';
    process.env.MINIO_USE_SSL = 'false';
    process.env.MINIO_ACCESS_KEY = 'S3RVER';
    process.env.MINIO_SECRET_KEY = 'S3RVER';
    process.env.MINIO_BUCKET = 'test-bucket';

    storage = require('../services/storage');
    await storage.uploadBuffer(Buffer.from('hello2'), 'minio.txt', 'text/plain');
    url = await storage.generateDownloadUrl('minio.txt');
    res = await fetch(url);
    text = await res.text();
    assert.strictEqual(text, 'hello2');
  } finally {
    await server.close();
  }
})();
