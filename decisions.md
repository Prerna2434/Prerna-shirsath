# Decisions

This file tracks key architectural, technical, and product decisions made throughout the project.

## Format

Each entry follows this structure:

---

### [YYYY-MM-DD] Decision Title

- **Status**: `Proposed` | `Accepted` | `Deprecated` | `Superseded`
- **Context**: What situation or problem prompted this decision?
- **Decision**: What was decided?
- **Consequences**: What are the trade-offs, outcomes, or follow-up actions?

---

## Log

---

### [2026-09-09] Deploy the static client through GitHub Pages

- **Status**: `Accepted`
- **Context**: The current application is a Vite-built static client, and the repository is already hosted on GitHub.
- **Decision**: Use GitHub Actions to validate each change and deploy the production `dist/` artifact to GitHub Pages on pushes to `main`.
- **Consequences**: The public site uses the `/Prerna-shirsath/` base path. Live Gemini access remains deferred until a protected server-side API is available; no secret is exposed to the browser.

---

### [2026-09-08] Use React 19 + Vite + TypeScript as the core frontend stack

- **Status**: `Accepted`
- **Context**: The project requires a fast, modern frontend with strong typing and component reuse across multiple views and user roles.
- **Decision**: Use React 19 with TypeScript, bundled via Vite 6. This provides fast HMR, native ESM, and excellent TypeScript support.
- **Consequences**: Leverages the latest React features (e.g., concurrent rendering). Vite's plugin ecosystem is used for TailwindCSS integration.

---

### [2026-09-08] Use TailwindCSS v4 via @tailwindcss/vite plugin

- **Status**: `Accepted`
- **Context**: The project needs a utility-first CSS approach with fast compilation.
- **Decision**: Use TailwindCSS v4 integrated directly via the `@tailwindcss/vite` Vite plugin instead of the traditional PostCSS + `tailwind.config.js` setup.
- **Consequences**: Simpler configuration. No `tailwind.config.js` needed. CSS variables and custom tokens are defined in `index.css`.

---

### [2026-09-08] Use Gemini AI (@google/genai) for AI-powered features

- **Status**: `Accepted`
- **Context**: The platform needs AI capabilities (e.g., prescription analysis, drug interaction checks, smart OCR-based scanner).
- **Decision**: Integrate Google Gemini via the `@google/genai` SDK. The API key is injected at runtime from environment secrets.
- **Consequences**: Requires `GEMINI_API_KEY` secret to be configured. Server-side calls are handled via Express to avoid exposing the key client-side.

---

### [2026-09-08] Multi-mode app architecture (enterprise / mobile / auth / prd)

- **Status**: `Accepted`
- **Context**: The platform serves multiple stakeholders (pharmacists, doctors, patients, admins) with very different UX needs.
- **Decision**: Use a single-page app with 4 distinct "modes" rendered by `App.tsx`: enterprise dashboard, patient mobile experience, unified auth portal, and PRD viewer.
- **Consequences**: Avoids separate routing libraries for now. Modes are toggled via a top-level `activeMode` state. Can be migrated to React Router if complexity grows.

---

### [2026-09-08] Multi-tenant clearinghouse using TenantSchema

- **Status**: `Accepted`
- **Context**: The platform supports multiple pharmacy tenants with isolated data.
- **Decision**: Model each tenant via the `TenantSchema` interface. Tenant health, DB storage, Redis hit rate, and isolation mode are tracked per tenant.
- **Consequences**: The `GlobalPlatformOperationsView` handles all multi-tenant monitoring. Future work may require a real backend database per tenant.

---

<!-- Add new decisions below, newest first -->
