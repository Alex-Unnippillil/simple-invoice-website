const Sentry = require('@sentry/node');

function initSentry(options = {}) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({ dsn: process.env.SENTRY_DSN, ...options });
    return true;
  } else {
    console.log('Sentry disabled in development environment');
    return false;
  }
}

module.exports = { Sentry, initSentry };
