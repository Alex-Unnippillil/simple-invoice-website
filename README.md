# simple-invoice-website
basic rent invoicing system that records payments and generates printable/PDF rent receipts

## Feature Flags

This project uses the [Unleash](https://www.getunleash.io/) SDK to control rollout of features.

### Configuration

Flags live in `feature-flags.json` and are grouped by environment and optional user segment. Edit this file to toggle features, or set `UNLEASH_URL` and `UNLEASH_TOKEN` to connect to a remote Unleash instance.

Environment selection relies on `NODE_ENV`; segmentation can be specified with `USER_SEGMENT` (e.g. `beta`).

### Usage

```js
const { initFlags, isEnabled } = require('./src/featureFlags');

initFlags();

if (isEnabled('sampleFeature')) {
  // guarded feature logic
}
```

Use `isEnabled` to guard experimental code paths and safely roll out functionality.
