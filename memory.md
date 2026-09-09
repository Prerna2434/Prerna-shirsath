# Memory

This file serves as a living knowledge base — a place to capture important context, lessons learned, gotchas, and notes that are useful to remember across sessions.

---

## Project Overview

- **Project Name**: GeneticMedicine — Medicine Price Comparison & Pharmacy Platform
- **Started**: 2026-09-08
- **Stack**: React 19 + TypeScript + Vite + TailwindCSS v4 + Gemini AI (`@google/genai`)
- **Runtime**: Node.js / Express (server-side API) + Vite dev server (client)
- **Key Goal**: Online medicine marketplace comparing prices across pharmacies, highlighting lowest generic prices, doctor e-prescription review, and a dispensary matrix.

---

## Architecture

```
src/
├── App.tsx                  — Root component; handles routing between 4 modes & AI assistant
├── types.ts                 — All shared TypeScript interfaces
├── index.css                — Global TailwindCSS styles
├── main.tsx                 — React entry point
├── components/
│   ├── ai/                  — AiAssistantPanel (Gemini 1.5 Flash streaming & fallback intelligence)
│   ├── auth/                — UnifiedAuthPage (doctor / patient / pharmacy portals)
│   ├── docs/                — PrdViewerModal (PRD spec viewer)
│   ├── layout/              — EnterpriseHeader, EnterpriseSidebar
│   ├── mobile/              — PatientMobileApp, MobileScanner
│   └── views/               — 6 enterprise views:
│       ├── DashboardView
│       ├── DispensaryMatrixView
│       ├── PriceComparisonEngineView
│       ├── DoctorPrescriptionReviewView
│       ├── GlobalPlatformOperationsView
│       └── SettingsView
└── data/                    — mockData (DEFAULT_USERS, mock transactions, etc.)
```

### App Modes

| Mode | Description |
|------|-------------|
| `enterprise` | Main dashboard with sidebar & 4 views |
| `mobile` | Patient mobile experience (OCR scanner, generic marketplace) |
| `auth` | Unified login/registration for doctor, patient, pharmacy |
| `prd` | PRD specification document viewer |

---

## User Roles

| Role | Description |
|------|-------------|
| `admin` | Full platform access |
| `doctor` | E-prescription review, DDI alerts |
| `pharmacist` | Dispensary matrix, stock management |
| `patient` | Price comparison, mobile app |

---

## Key Domain Types

- `ArbitrageTransaction` — Price arbitrage between brand vs. generic medicines
- `DispensaryStockItem` — Pharmacy stock with pricing and batch info
- `DispensaryOrder` — Delivery / pickup orders with Rx data
- `PrescriptionCase` — Full doctor prescription with patient, drug, savings info
- `CompetingPharmacy` — Price comparison across nearby pharmacies
- `TenantSchema` — Multi-tenant clearinghouse schema

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `GEMINI_API_KEY` | Required for Gemini AI API calls (injected at runtime) |
| `APP_URL` | Hosted app URL for self-referential links and OAuth callbacks |

---

## Gotchas & Pitfalls

- TailwindCSS v4 is used via `@tailwindcss/vite` plugin — **not** the traditional `tailwind.config.js` approach.
- HMR is disabled when `DISABLE_HMR=true` (set in AI Studio); file watching is also disabled to save CPU.
- The `@` alias maps to the project root (`.`), not `./src`.
- `motion` (`framer-motion` successor) is available for animations.
- Camera permissions are requested (`requestFramePermissions: ["camera"]`) for the OCR scanner in the patient mobile app.

---

## Useful References

| Resource | Path / URL |
|----------|-----------|
| Entry Point | [`src/main.tsx`](./src/main.tsx) |
| Root Component | [`src/App.tsx`](./src/App.tsx) |
| All Types | [`src/types.ts`](./src/types.ts) |
| Vite Config | [`vite.config.ts`](./vite.config.ts) |
| Project Metadata | [`metadata.json`](./metadata.json) |
| Env Template | [`.env.example`](./.env.example) |

---

_Last updated: 2026-09-08_
