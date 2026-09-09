# Post-Launch Operations

## Monitoring

`Production Health Check` runs after a successful Pages deployment and daily at
19:17 UTC. It verifies the published page and its generated JavaScript asset.
Review a failed workflow run in the GitHub Actions tab before treating it as an
outage, because scheduled GitHub Actions can be delayed during periods of high load.

The current static deployment has no server-side error-log source. When a backend
is introduced, add centralized application-error logging, uptime alerts, and
privacy-safe performance telemetry before enabling live clinical AI traffic.

## Incident response

1. Confirm the failed deployment or health-check run and reproduce with the live URL.
2. If the release is unsafe or unavailable, restore the last known-good Pages deployment.
3. Record the cause and fix in `changelog.md`; add a regression test when applicable.
4. For a suspected exposure of health or personal data, immediately disable the affected
   intake or integration and follow the organisation's incident-response process.

## Feedback and iteration

Use the **User feedback** issue form for non-sensitive product feedback. Triage new
items weekly into defects, usability improvements, and roadmap candidates. Prioritise:

1. Safety or privacy defects.
2. Broken patient, prescriber, or pharmacy workflows.
3. Accessibility and performance regressions.
4. Feature improvements supported by repeated feedback.
