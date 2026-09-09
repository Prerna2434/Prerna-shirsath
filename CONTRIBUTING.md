# Contributing to GeneticMedicine

Thank you for helping improve GeneticMedicine. This guide covers how to report
bugs, share product feedback, and contribute code changes.

---

## Privacy first

**Never include personal health information** (patient names, prescriptions,
diagnoses, contact details) in issues, pull requests, or commit messages. This
is a public repository. See [OPERATIONS.md](./OPERATIONS.md) for the full
incident-response policy.

---

## Reporting a bug

1. Check the [existing issues](https://github.com/prerna2434/Prerna-shirsath/issues)
   to see if the bug has already been reported.
2. Open a new issue using the **Bug report** template.
3. Fill in every required field — severity, affected area, steps to reproduce,
   expected behaviour, and actual behaviour.
4. A maintainer will triage within **2 business days**.

### Severity definitions

| Level | Meaning | Target response |
|---|---|---|
| Critical | App crashes or data is incorrect | Within 24 hours |
| High | Core feature broken, no workaround | Within 48 hours |
| Medium | Feature degraded but usable | Next sprint |
| Low | Cosmetic or minor inconvenience | Backlog |

---

## Sharing product feedback

Use the **User feedback** issue template for non-bug suggestions. Keep feedback
specific: describe the experience you had and the outcome you expected. Triage
runs weekly — items are classified as defects, usability improvements, or
roadmap candidates.

---

## Contributing code

### 1. Fork & branch

```
git checkout -b fix/<short-description>    # bug fix
git checkout -b feat/<short-description>   # new feature
git checkout -b chore/<short-description>  # non-functional change
```

Branches are created from `main`. Do not commit directly to `main`.

### 2. Local development

```bash
# Frontend
cd frontend
npm install
npm run dev          # http://localhost:3000

# Backend
cd backend
npm install
npm run dev
```

### 3. Before opening a PR

```bash
# Frontend — all three must pass
npm test             # 25+ unit/integration tests
npm run lint         # TypeScript type check
npm run build -- --base=/Prerna-shirsath/   # production build

# Backend
npm test
npm run lint
```

CI enforces all of the above on every PR. A PR with a failing check will not
be merged.

### 4. Performance budget

The CI pipeline enforces these limits on every build:

| Asset | Gzip budget |
|---|---|
| JS bundle (`index-*.js`) | ≤ 150 kB |
| CSS bundle (`index-*.css`) | ≤ 20 kB |

If your change pushes a bundle over budget, refactor before opening a PR (e.g.
avoid importing large libraries; prefer tree-shakeable imports).

### 5. Pull request checklist

- [ ] Tests pass locally
- [ ] TypeScript type checks pass (`npm run lint`)
- [ ] Production build succeeds with the `/Prerna-shirsath/` base path
- [ ] No personal health information in diff or commit messages
- [ ] `changelog.md` updated under `[Unreleased]` or the next version
- [ ] PR title is ≤ 70 characters and follows the branch-naming convention

### 6. Hotfix process

For critical production bugs that cannot wait for the normal PR cycle:

1. Create a `fix/<name>` branch from `main`.
2. Apply the minimal fix and verify all tests pass locally.
3. Open a PR — get at least one review.
4. After merge, trigger the **Hotfix Deploy** workflow manually from the Actions
   tab, selecting `main` and providing a brief reason.

---

## Code style

- TypeScript strict mode is on; avoid `any`.
- React components use named exports.
- TailwindCSS utility classes only — no inline styles, no external CSS files.
- Accessibility: interactive elements must have accessible labels (`aria-label`,
  `title`, or visible text); colour contrast must meet WCAG AA.
- Comments explain *why*, not *what*.

---

## Questions?

Open a [User feedback](https://github.com/prerna2434/Prerna-shirsath/issues/new?template=user-feedback.yml)
issue or start a GitHub Discussion.
