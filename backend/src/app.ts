import express from 'express';
import { generateClinicalResponse } from './services/clinicalAssistant.js';

/** Creates the HTTP API used by the separated frontend. */
export function createApp() {
  const app = express();
  const frontendOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000';

  app.use(express.json({ limit: '16kb' }));
  app.use((req, res, next) => {
    if (req.headers.origin === frontendOrigin) res.setHeader('Access-Control-Allow-Origin', frontendOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.post('/api/clinical-assistant', async (req, res, next) => {
    const query = typeof req.body?.query === 'string' ? req.body.query.trim() : '';
    if (!query) return res.status(400).json({ error: 'A clinical-assistant query is required.' });
    if (query.length > 2_000) return res.status(400).json({ error: 'The query must be 2,000 characters or fewer.' });

    try {
      res.json(await generateClinicalResponse(query));
    } catch (error) {
      next(error);
    }
  });
  return app;
}
