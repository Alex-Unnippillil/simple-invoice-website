import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { StripeInstrumentation } from '@opentelemetry/instrumentation-stripe';

const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
});

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]:
      process.env.OTEL_SERVICE_NAME || 'simple-invoice-service',
  }),
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations(),
    new StripeInstrumentation(),
  ],
});

export function startTelemetry(): Promise<void> {
  return sdk.start();
}

export function shutdownTelemetry(): Promise<void> {
  return sdk.shutdown();
}
