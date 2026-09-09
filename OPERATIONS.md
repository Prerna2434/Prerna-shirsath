# Post-Launch Operations

## Monitoring

`Production Health Check` runs after a successful Pages deployment and daily at
19:17 UTC. It verifies the published page and its generated JavaScript asset.
Review a failed workflow run in the GitHub Actions tab before treating it as an
outage, because scheduled GitHub Actions can be delayed during periods of high load.

The current static deployment has no server-side error-log source. When a backend
is introduced, add centralized application-error logging, uptime alerts, and
privacy-safe performance telemetry before enabling live clinical AI traffic.

### Runtime error tracking

A React `ErrorBoundary` component (`frontend/src/components/ui/ErrorBoundary.tsx`)
wraps the entire application. It catches unhandled render/lifecycle errors and
displays a recovery UI with "Try to recover" and "Reload page" actions instead of
a blank screen. Errors are logged to `console.error` with the component stack;
swap the `componentDidCatch` body for a real SDK call (e.g. Sentry) when a
monitoring service is introduced.

### Performance budget

CI enforces gzip-size budgets on every push and PR:

| Asset | Budget |
|---|---|
| JS bundle | ≤ 150 kB gzip |
| CSS bundle | ≤ 20 kB gzip |

A build that exceeds either threshold fails the `Check performance budget` CI step.
See `CONTRIBUTING.md` for guidance on keeping bundles within budget.

## Incident response

1. Confirm the failed deployment or health-check run and reproduce with the live URL.
2. If the release is unsafe or unavailable, restore the last known-good Pages deployment.
3. For critical production bugs that cannot wait for the normal PR cycle, use the
   **Hotfix Deploy** workflow (`.github/workflows/hotfix.yml`): create a `fix/<name>`
   branch, apply the minimal fix, get a review, merge, then trigger the workflow manually
   from the Actions tab with the target branch and a brief reason.
4. Record the cause and fix in `changelog.md`; add a regression test when applicable.
5. For a suspected exposure of health or personal data, immediately disable the affected
   intake or integration and follow the organisation's incident-response process.

## Feedback and iteration

Use the **User feedback** issue form for non-sensitive product feedback. Use the
**Bug report** form for reproducible defects (include severity, affected area, steps
to reproduce). Triage new items weekly into defects, usability improvements, and
roadmap candidates. Prioritise:

1. Safety or privacy defects.
2. Broken patient, prescriber, or pharmacy workflows.
3. Accessibility and performance regressions.
4. Feature improvements supported by repeated feedback.

See `CONTRIBUTING.md` for the full contribution, severity, and hotfix process.
