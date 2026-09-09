import { Router, Request, Response, NextFunction } from 'express';
import { DispensaryOrder } from '../models/DispensaryOrder.js';

const router = Router();

/** GET /api/orders — list orders (optional ?status=dispatched|pending) */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.status === 'dispatched') filter.isDispatched = true;
    if (req.query.status === 'pending') filter.isDispatched = false;
    const orders = await DispensaryOrder.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { next(err); }
});

/** GET /api/orders/:id */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await DispensaryOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json(order);
  } catch (err) { next(err); }
});

/** POST /api/orders — create a new order */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await DispensaryOrder.create(req.body);
    res.status(201).json(order);
  } catch (err) { next(err); }
});

/** PATCH /api/orders/:id/dispatch — mark an order as dispatched */
router.patch('/:id/dispatch', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await DispensaryOrder.findByIdAndUpdate(
      req.params.id,
      { isDispatched: true, trackingId: req.body.trackingId ?? `TRK-${Date.now()}` },
      { new: true },
    );
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json(order);
  } catch (err) { next(err); }
});

/** DELETE /api/orders/:id */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await DispensaryOrder.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json({ message: 'Deleted.' });
  } catch (err) { next(err); }
});

export default router;
