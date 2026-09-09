import { Router, Request, Response, NextFunction } from 'express';
import { DispensaryStock } from '../models/DispensaryStock.js';

const router = Router();

/** GET /api/stock — list all stock items */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await DispensaryStock.find().sort({ name: 1 });
    res.json(items);
  } catch (err) { next(err); }
});

/** GET /api/stock/:id — single item */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await DispensaryStock.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Stock item not found.' });
    res.json(item);
  } catch (err) { next(err); }
});

/** POST /api/stock — create new stock item */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await DispensaryStock.create(req.body);
    res.status(201).json(item);
  } catch (err) { next(err); }
});

/** PATCH /api/stock/:id — update stock (e.g. adjust inStockUnits) */
router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await DispensaryStock.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Stock item not found.' });
    Object.assign(item, req.body);
    await item.save(); // triggers pre-save isLowStock hook
    res.json(item);
  } catch (err) { next(err); }
});

/** DELETE /api/stock/:id — remove a stock item */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await DispensaryStock.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Stock item not found.' });
    res.json({ message: 'Deleted.' });
  } catch (err) { next(err); }
});

export default router;
