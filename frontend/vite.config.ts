import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  // In CI / deploy workflows the --base flag is passed on the CLI and takes
  // precedence, so VITE_BASE_PATH is only used when building locally with a
  // custom base (e.g. VITE_BASE_PATH=/Prerna-shirsath/ npm run build).
  const base = process.env.VITE_BASE_PATH ?? '/';

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      proxy: {
        // In development, proxy /api requests to the local Express backend.
        // In production the frontend uses VITE_API_BASE_URL (absolute URL).
        '/api': {
          target: process.env.VITE_API_BASE_URL || 'http://localhost:3001',
          changeOrigin: true,
        },
      },
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
