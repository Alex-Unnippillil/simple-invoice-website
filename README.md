# simple-invoice-website
basic rent invoicing system that records payments and generates printable/PDF rent receipts

## Experiment data retention

Analytics events are stored in a local SQLite database (`analytics.db`).
Each event can be associated with an `experiment_id` and a `variant_id` to
support A/B testing or other experiments.

Old experiment data should be cleaned up regularly:

- **Retention period** – experiment records are kept for 90 days by default.
- **Purging** – run `analytics.cleanup.purge_expired_events` to permanently
  remove rows older than the retention period.
- **Anonymisation** – run `analytics.cleanup.anonymize_old_experiments` to
  strip event payloads for outdated records while retaining aggregate counts.

Schedule these cleanup tasks (e.g. via cron) to maintain a small database
and respect privacy requirements.
