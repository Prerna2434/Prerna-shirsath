# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/) and the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.

---

## [0.5.0] — 2026-09-09

### Added
- `frontend/src/components/ui/ErrorBoundary.tsx` — React class component that catches
  unhandled render/lifecycle errors and renders a branded recovery UI with "Try to
  recover" (state reset) and "Reload page" actions. Links to the bug-report template.
  Ready for a monitoring SDK swap in `componentDidCatch`.
- `ErrorBoundary` wraps the full app tree in `frontend/src/main.tsx`.
- `.github/ISSUE_TEMPLATE/bug-report.yml` — structured bug-report form with severity
  dropdown (Critical / High / Medium / Low), affected-area dropdown, steps-to-reproduce,
  expected/actual behaviour, browser, and URL fields.
- `.github/workflows/hotfix.yml` — manual-trigger workflow; validates full CI suite
  (tests + type checks for frontend and backend) then deploys from any branch to GitHub
  Pages. Writes a summary table (branch, reason, actor, live URL) to the workflow run.
- `CONTRIBUTING.md` — contributor guide covering privacy rules, bug-report process,
  severity SLAs, branch conventions, local dev setup, PR checklist, performance budget
  guidance, and hotfix process.

### Changed
- `ci.yml` — new "Check performance budget" step after the production build: measures
  gzip sizes of JS and CSS assets; fails the workflow if JS > 150 kB or CSS > 20 kB.
- `OPERATIONS.md` — added runtime error tracking section (ErrorBoundary + future SDK),
  performance budget table, hotfix workflow reference, and expanded feedback triage to
  include the bug-report template.

## [0.4.0] — 2026-09-09

### Added
- `scripts/smoke-test.sh` — standalone bash smoke-test script with 8 production checks
  (HTTP 200, React root div, page title, viewport meta, OG tags, JS asset + content,
  CSS asset + content, Google Fonts hint). Exits 0 on all-pass, 1 on any failure;
  accepts an optional `BASE_URL` argument for testing non-production deployments.
- `ANNOUNCE.md` — public launch announcement with feature table, tech stack overview,
  CI/CD pipeline description, usage guide, privacy note, and Phase 5 roadmap.

### Changed
- `production-health.yml` expanded from 2 steps to 8 distinct assertions: page title,
  viewport meta, JS asset content check, CSS asset content check, OG meta tags,
  and a final summary line on success.

### Fixed
- Production build verified with `--base=/Prerna-shirsath/` flag: 48 modules, zero
  TypeScript or Vite errors, nominal bundle sizes (JS 419 kB / CSS 53 kB).

## [0.3.1] — 2026-09-09

### Added
- Production health-check workflow for deployment-triggered and daily availability checks.
- Privacy-safe public feedback form and post-launch incident-response playbook.

## [0.3.0] — 2026-09-09

### Added
- GitHub Actions continuous-integration workflow for automated tests, TypeScript checks, and a production build.
- GitHub Pages deployment workflow for the static Vite bundle.
- Launch runbook covering one-time Pages setup, smoke testing, and environment safety.

## [0.2.1] — 2026-09-09

### Fixed
- Corrected offline AI intent matching so patient questions using either "save" or "saving"
  receive the generic-arbitrage economics response.

### Quality
- Completed automated QA for arbitrage calculations, dispensary workflows, and clinical AI fallback
  guidance (25 passing tests).
- Completed TypeScript, production-build, and manual accessibility checks.

## [0.2.0] — 2026-09-08

### Added
- **Executive Dashboard Integration**: Mounted `DashboardView` as the primary operational hub with aggregate KPIs, sparkline charts, and quick portal links.
- **Platform & Profile Settings**: Mounted `SettingsView` with notification controls, dark mode preferences, and profile management accessible from sidebar and user dropdown.
- **Clinical AI Drug Assistant (`AiAssistantPanel`)**:
  - Global floating button and header quick trigger with live pulsing indicator.
  - Streaming responses using `@google/genai` (Gemini 1.5 Flash).
  - High-precision clinical fallback engine with streaming simulation when offline or unconfigured.
  - Contextual AI triggers across prescription cases, inventory items, and competing pharmacy cards.
- **Dispensary Matrix & Fulfillment Enhancements**:
  - Interactive "Add Generic Stock" modal for registering new bioequivalent drugs into the formulary.
  - One-click stock quantity adjusters (+/-) with automatic low-stock flag calculation.
  - Wholesale Purchase Order (PO) generation for depleted inventory items.
  - Order status filtering (`All`, `Pending`, `Dispatched`) and real-time courier dispatching.
- **Price Comparison & Arbitrage Optimization**:
  - Dynamic multi-attribute composite scoring algorithm that re-ranks pharmacies based on weight sliders (Price, ETA, Quality, Margin).
  - Interactive Custom Medicine Savings Calculator simulating 1, 3, 6, and 12-month patient savings.
  - Clinical AI review triggers for FDA therapeutic equivalence validation.
- **Doctor E-Prescription & DDI Workflow**:
  - Persistent prescription status badges (`Generic Approved`, `Brand Locked`, `Rejected`).
  - Interactive Clinical EHR Progress Notes textarea with timestamped entry.
  - 1-click AI DDI & allergy safety screening trigger.
- **Patient Mobile App Experience**:
  - Optical Smart Scanner with multi-prescription sample presets (Lipitor, Metformin, Zoloft) and dynamic extraction summary.
  - Real-time search and category filtering (Cholesterol, Diabetes, Anxiety, Blood Pressure, Antibiotics).
  - Simulated checkout with order confirmation and tracking.

---

## [0.1.0] — 2026-09-08

### Added
- Initial project setup with React 19 + Vite + TypeScript + TailwindCSS v4.
- Integrated `@google/genai` SDK for Gemini AI-powered features.
- `EnterpriseHeader` and `EnterpriseSidebar` layout components.
- 4 core enterprise views:
  - `DispensaryMatrixView` — pharmacy stock management
  - `PriceComparisonEngineView` — brand vs. generic price engine
  - `DoctorPrescriptionReviewView` — e-prescription review with DDI alerts
  - `GlobalPlatformOperationsView` — multi-tenant clearinghouse monitoring
- `PatientMobileApp` — mobile marketplace with OCR scanner.
- `UnifiedAuthPage` — unified login/registration for doctor, patient, and pharmacy portals.
- `PrdViewerModal` — in-app PRD specification viewer.
- Multi-tenant `TenantSchema` data model.
- Shared TypeScript types: `ArbitrageTransaction`, `DispensaryStockItem`, `DispensaryOrder`, `PrescriptionCase`, `CompetingPharmacy`, `UserProfile`.
- `.env.example` with `GEMINI_API_KEY` and `APP_URL` placeholders.
- `.gitignore` configured for node_modules, dist, build, logs, and env files.
- Project documentation: `decisions.md`, `rules.md`, `memory.md`, `changelog.md`, `Phase.md`.

---

<!-- 
  Format for future entries:
  ## [X.Y.Z] — YYYY-MM-DD
  ### Added | Changed | Deprecated | Removed | Fixed | Security
  - Description of the change.
-->
