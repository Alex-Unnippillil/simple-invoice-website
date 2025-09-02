# Runbook

## PCI Compliance and SAQ A Scope

This application relies on Stripe-hosted payment pages and Stripe.js to handle all cardholder interactions. As a result, it is eligible for PCI DSS Self-Assessment Questionnaire (SAQ) A.

- No primary account numbers (PAN) are processed, stored, or transmitted by our servers.
- Card data is entered only on Stripe-controlled interfaces and exchanged for tokens before reaching our backend.
- Server-side operations use these tokens and non-sensitive metadata when creating charges or managing payments.

For detailed guidance on maintaining this security posture and minimizing PCI scope, consult Stripe's security guides:

- https://stripe.com/docs/security
