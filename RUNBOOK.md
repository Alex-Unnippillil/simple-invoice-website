# Runbook

## PCI Compliance and SAQ A Scope

This application relies on Stripe-hosted payment pages and Stripe.js to handle all cardholder interactions. As a result, it is eligible for PCI DSS Self-Assessment Questionnaire (SAQ) A.

- No primary account numbers (PAN) are processed, stored, or transmitted by our servers.
- Card data is entered only on Stripe-controlled interfaces and exchanged for tokens before reaching our backend.
- Server-side operations use these tokens and non-sensitive metadata when creating charges or managing payments.

For detailed guidance on maintaining this security posture and minimizing PCI scope, consult Stripe's security guides:

- https://stripe.com/docs/security

## Feature Flag Ramp and Rollback

### Ramping Up a Feature

1. Confirm the feature has a flag defined in `lib/flags.ts` and that it is set to `true`.
2. Use the admin emergency switch to keep features disabled until ready to ramp.
3. Disable the emergency switch to enable all flagged features.
4. Monitor logs, telemetry and audit logs for any anomalies.

### Rolling Back

1. Trigger the emergency switch in the admin UI to immediately disable all flagged features.
2. If a longer-term rollback is required, set individual flags in `lib/flags.ts` to `false` and redeploy.
3. Verify system stability before re-enabling features.
