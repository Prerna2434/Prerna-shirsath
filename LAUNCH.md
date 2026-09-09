# Launch Runbook

## Deployment target

The application is configured for GitHub Pages at:

`https://prerna2434.github.io/Prerna-shirsath/`

The deployment workflow builds the Vite application with the required
`/Prerna-shirsath/` base path and publishes the `dist/` artifact.

## One-time repository setup

1. In the GitHub repository, open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Merge or push the prepared workflows to `main`.
4. Open the **Actions** tab and confirm that **Continuous Integration** and
   **Deploy to GitHub Pages** complete successfully.

## Production checks

1. Open the published URL and verify the dashboard renders without missing styles or scripts.
2. Open the AI assistant and confirm the offline fallback works without a key.
3. Test the Dispensary Matrix, Price Engine, and Doctor E-Prescription views.
4. Confirm the mobile portal renders correctly at a narrow viewport.

## Environment guidance

GitHub Pages is a static host. Do not add `GEMINI_API_KEY` as a Vite-prefixed
variable because it would be exposed to every browser. The application remains
fully usable with its offline clinical guidance fallback. A future live Gemini
integration should call a protected server-side endpoint.
