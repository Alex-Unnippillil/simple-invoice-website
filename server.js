const express = require('express');
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN || '',
  tracesSampleRate: 1.0,
});

const app = express();

// Capture request data for Sentry and set up tracing.
app.use(Sentry.Handlers.requestHandler());

app.use((req, res, next) => {
  const traceparent = req.header('traceparent');
  console.log(`Incoming request ${req.method} ${req.originalUrl} traceparent=${traceparent || 'none'}`);

  const transaction = Sentry.startTransaction({
    name: `${req.method} ${req.path}`,
    op: 'http.server',
    traceparent,
  });
  Sentry.getCurrentHub().configureScope(scope => scope.setSpan(transaction));
  res.on('finish', () => transaction.finish());
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'hello' });
});

// Route to demonstrate Sentry error capture
app.get('/error', () => {
  throw new Error('Test error');
});

app.use(Sentry.Handlers.errorHandler());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
