# 🚀 GeneticMedicine — Launch Announcement

**Date**: 2026-09-09  
**Version**: 0.4.0  
**Live URL**: [https://prerna2434.github.io/Prerna-shirsath/](https://prerna2434.github.io/Prerna-shirsath/)

---

## What is GeneticMedicine?

GeneticMedicine is an open-source medicine price-comparison and pharmacy operations platform that
helps patients find the lowest-cost generic alternatives, supports pharmacists managing dispensary
inventory, and gives doctors a streamlined e-prescription review workflow — all in a single
web application.

---

## What's live at launch

### 🏥 Enterprise Portal

| Module | What it does |
|---|---|
| **Executive Dashboard** | Aggregate KPIs, sparkline charts, and quick-links to every operational view |
| **Dispensary Matrix** | Real-time inventory management, generic stock registration, stock adjustments, and wholesale PO generation |
| **Price Comparison Engine** | Multi-pharmacy composite scoring with dynamic weight sliders (price, ETA, quality, margin) and a patient savings calculator |
| **Doctor E-Prescription Review** | Real-time prescription queue with DAW-0/DAW-1 attestation, AI DDI screening, and clinical progress notes |
| **Multi-Tenant Operations** | Platform-wide tenant health monitoring, DB storage, Redis hit-rate, and isolation-mode indicators |
| **Settings** | Notification preferences, dark-mode toggle, and profile management |

### 📱 Patient Mobile Experience

- Smart optical prescription scanner with preset extraction (Lipitor, Metformin, Zoloft)
- Category-based medicine discovery (Cholesterol, Diabetes, Anxiety, Blood Pressure, Antibiotics)
- Real-time generic vs. brand price comparison across pharmacies
- Simulated checkout with order confirmation

### 🤖 Clinical AI Assistant

- Accessible from any view via the persistent floating button or header trigger
- Powered by Google Gemini (streaming) when a server-side API key is configured
- Full offline fallback with high-precision clinical pharmacy guidance when no key is available
- Supports drug interaction checks, generic equivalence queries, and patient savings analysis

### 🔐 Unified Auth Portal

- Separate login and registration flows for Doctors, Patients, and Pharmacies
- Role-based access: each portal surfaces only the views appropriate for that user type

---

## Tech stack

- **Frontend**: React 19 + TypeScript + Vite 6 + TailwindCSS v4
- **AI**: Google Gemini via `@google/genai` (server-side, key never exposed to browser)
- **Backend**: Express + TypeScript (clinical assistant service)
- **Hosting**: GitHub Pages (static) with GitHub Actions CI/CD
- **Tests**: Vitest — 25 automated tests covering arbitrage, dispensary, and AI fallback logic

---

## CI/CD pipeline

Every push to `main`:
1. Runs 25 frontend unit/integration tests
2. Type-checks frontend and backend TypeScript
3. Builds the production bundle with the `/Prerna-shirsath/` base path
4. Runs backend tests and type checks
5. Deploys the `dist/` artifact to GitHub Pages

After each deployment, and daily at 19:17 UTC, the **Production Health Check** workflow
verifies:
- HTTP 200 on the public URL
- React root div, page title, and viewport meta are present
- JS and CSS assets load and contain expected content
- Open Graph meta tags are present

---

## How to use it

### Visit the live app
Go to [https://prerna2434.github.io/Prerna-shirsath/](https://prerna2434.github.io/Prerna-shirsath/).
No account is required to explore the enterprise portal. Use the **Enterprise Portal** view
buttons at the top to switch between modules.

### Switch to the Patient Mobile Experience
Click **Patient App** in the top navigation to open the mobile-optimised marketplace view.

### Try the AI Assistant
Click the **Ask AI Pharmacist** button (bottom-right corner) or the AI trigger button in
the header. The assistant works fully offline with built-in clinical guidance.

### Run it locally
```bash
git clone https://github.com/prerna2434/Prerna-shirsath.git
cd Prerna-shirsath/frontend
npm install
npm run dev          # opens on http://localhost:3000
```

---

## Privacy & safety note

This application is a demonstration platform. It does not collect, store, or transmit any
personal health information. The public issue tracker must not be used to share patient data —
see [OPERATIONS.md](./OPERATIONS.md) for the feedback and incident-response process.

---

## What's next (Phase 5)

- Live Gemini AI integration via a protected server-side endpoint
- Real-time error-log monitoring and uptime alerting
- User feedback triage and iteration based on collected reports
- Performance improvements: route-level code splitting to reduce the initial bundle size

---

_Built with ❤️ — GeneticMedicine v0.4.0 · 2026-09-09_
