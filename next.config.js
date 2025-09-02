const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {};

module.exports = withSentryConfig(nextConfig, { silent: true });
