# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/) and the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.

---

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
