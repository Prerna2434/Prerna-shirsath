import { Router, Request, Response, NextFunction } from 'express';
import { ArbitrageTransaction } from '../models/ArbitrageTransaction.js';

const router = Router();

/** GET /api/arbitrage — list transactions (optional ?settled=true|false, ?tenant=<code>) */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.settled === 'true') filter.isSettled = true;
    if (req.query.settled === 'false') filter.isSettled = false;
    if (req.query.tenant) filter.tenantCode = req.query.tenant;
    const txns = await ArbitrageTransaction.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json(txns);
  } catch (err) { next(err); }
});

/** GET /api/arbitrage/:id */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const txn = await ArbitrageTransaction.findById(req.params.id);
    if (!txn) return res.status(404).json({ error: 'Transaction not found.' });
    res.json(txn);
  } catch (err) { next(err); }
});

/** POST /api/arbitrage — record a new transaction */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const txn = await ArbitrageTransaction.create(req.body);
    res.status(201).json(txn);
  } catch (err) { next(err); }
});

/** PATCH /api/arbitrage/:id/settle — mark transaction as settled */
router.patch('/:id/settle', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const txn = await ArbitrageTransaction.findByIdAndUpdate(
      req.params.id,
      { isSettled: true },
      { new: true },
    );
    if (!txn) return res.status(404).json({ error: 'Transaction not found.' });
    res.json(txn);
  } catch (err) { next(err); }
});

export default router;
