# Feature Flag Rollout Runbook

This guide describes how to enable new features gradually from 1% to 100% using feature flags, how to disable features immediately with a kill switch, and how to monitor and roll back changes.

## Prerequisites
- Define the feature in `feature_flags.json`.
- Ensure monitoring dashboards and alerts are configured for key metrics.
- Communicate the rollout plan to the team.

## Gradual Rollout Procedure
1. **Initial Deployment (1%)**
   - Set the feature's `rollout` value to `1`.
   - Deploy the configuration and verify that a small cohort receives the feature.
   - Monitor metrics for errors, latency, and user behaviour.
2. **Incremental Increases**
   - Increase the rollout to `5%`, `10%`, `25%`, `50%`, and `100%` as confidence grows.
   - After each increase, allow time to observe metrics and user feedback.
3. **Kill Switch**
   - To immediately disable a feature, set `kill_switch` to `true` for that feature and redeploy the configuration.
   - This bypasses the rollout percentage and disables the feature for all users.

## Monitoring and Alerts
- Track key metrics (error rate, response time, traffic) throughout the ramp.
- Configure alerting thresholds so anomalies trigger notifications to the on-call channel.
- During rollout, review dashboards after each change and acknowledge alerts promptly.

## Rollback Procedures
1. Set the feature's `rollout` value back to `0` or enable the kill switch.
2. Redeploy the configuration and verify the feature is disabled.
3. Conduct a postmortem if the rollback was due to an incident.

## Team Training
- Review this runbook with the team before each feature rollout.
- Practice using the kill switch and reverting rollouts in a staging environment.
- Ensure on-call engineers know how to update `feature_flags.json` and redeploy quickly.

