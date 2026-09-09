# GeneticMedicine

GeneticMedicine is a medicine price-comparison and pharmacy platform with a React frontend and an Express API backend.

## Project structure

```
frontend/  React, Vite, Tailwind, UI tests, and static assets
backend/   Express API, Gemini integration, and backend tests
```

The browser never receives `GEMINI_API_KEY`. The frontend sends clinical-assistant questions to the backend at `/api/clinical-assistant`.

## Install dependencies

Install each application independently:

```sh
npm --prefix frontend install
npm --prefix backend install
```

## Configure environment variables

Copy the examples before starting the applications:

```sh
copy frontend\.env.example frontend\.env
copy backend\.env.example backend\.env
```

Set `GEMINI_API_KEY` only in `backend/.env` when live Gemini responses are required. Without a key, the backend returns the existing clinical fallback guidance. Leave `VITE_API_BASE_URL` blank for local development; Vite proxies `/api` to the backend.

## Start locally

Start the backend first, on port 3001:

```sh
npm --prefix backend run dev
```

In another terminal, start the frontend on port 3000:

```sh
npm --prefix frontend run dev
```

Open `http://localhost:3000`. The API health endpoint is available at `http://localhost:3001/api/health`.

## Validate

```sh
npm --prefix frontend test
npm --prefix frontend run lint
npm --prefix frontend run build
npm --prefix backend test
npm --prefix backend run lint
```

## Production API URL

For a separately hosted backend, set `VITE_API_BASE_URL` to its public origin when building the frontend and set `FRONTEND_ORIGIN` in the backend environment to the public frontend origin.
