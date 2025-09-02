const provider = process.env.STORAGE_BACKEND === 'minio' ? 'minio' : 's3';
const adapter = provider === 'minio' ? require('./minio') : require('./s3');
module.exports = adapter;
