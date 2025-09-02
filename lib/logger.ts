import pino from 'pino';
import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContext {
  requestId?: string;
  userId?: string;
}

// AsyncLocalStorage keeps context per asynchronous execution chain
const context = new AsyncLocalStorage<RequestContext>();

const logger = pino({
  // Redact common PII fields to prevent sensitive data from being logged
  redact: ['password', 'creditCard', 'ssn', 'email'],
  mixin() {
    // Attach the request and user identifiers to every log entry
    const store = context.getStore() || {};
    return {
      requestId: store.requestId,
      userId: store.userId
    };
  }
});

// Helper to run a function within a given request context
export function withRequestContext<T>(ctx: RequestContext, fn: () => T): T {
  return context.run(ctx, fn);
}

export default logger;
