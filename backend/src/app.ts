import express, { Request, Response, NextFunction } from 'express';
import { generateClinicalResponse } from './services/clinicalAssistant.js';
import stockRoutes from './routes/stock.js';
import ordersRoutes from './routes/orders.js';
import prescriptionsRoutes from './routes/prescriptions.js';
import arbitrageRoutes from './routes/arbitrage.js';
import tenantsRoutes from './routes/tenants.js';

/** Creates and configures the Express application. */
export function createApp() {
  const app = express();
  const frontendOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000';

  // ── Middleware ────────────────────────────────────────────────────────────
  app.use(express.json({ limit: '16kb' }));

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.headers.origin === frontendOrigin) {
      res.setHeader('Access-Control-Allow-Origin', frontendOrigin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  // ── Health check ──────────────────────────────────────────────────────────
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ── Domain routes ─────────────────────────────────────────────────────────
  app.use('/api/stock',         stockRoutes);
  app.use('/api/orders',        ordersRoutes);
  app.use('/api/prescriptions', prescriptionsRoutes);
  app.use('/api/arbitrage',     arbitrageRoutes);
  app.use('/api/tenants',       tenantsRoutes);

  // ── Clinical AI assistant ────────────────────────────────────────────────
  app.post('/api/clinical-assistant', async (req: Request, res: Response, next: NextFunction) => {
    const query = typeof req.body?.query === 'string' ? req.body.query.trim() : '';
    if (!query) {
      return res.status(400).json({ error: 'A clinical-assistant query is required.' });
    }
    if (query.length > 2_000) {
      return res.status(400).json({ error: 'The query must be 2,000 characters or fewer.' });
    }
    try {
      res.json(await generateClinicalResponse(query));
    } catch (err) {
      next(err);
    }
  });

  // ── Global error handler ─────────────────────────────────────────────────
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[API Error]', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  });

  return app;
}
