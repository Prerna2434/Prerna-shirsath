import { Router, Request, Response, NextFunction } from 'express';
import { Tenant } from '../models/Tenant.js';

const router = Router();

/** GET /api/tenants */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tenants = await Tenant.find().sort({ name: 1 });
    res.json(tenants);
  } catch (err) { next(err); }
});

/** GET /api/tenants/:id */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) return res.status(404).json({ error: 'Tenant not found.' });
    res.json(tenant);
  } catch (err) { next(err); }
});

/** POST /api/tenants */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenant = await Tenant.create(req.body);
    res.status(201).json(tenant);
  } catch (err) { next(err); }
});

/** PATCH /api/tenants/:id — update tenant health metrics or status */
router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!tenant) return res.status(404).json({ error: 'Tenant not found.' });
    res.json(tenant);
  } catch (err) { next(err); }
});

/** DELETE /api/tenants/:id */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenant = await Tenant.findByIdAndDelete(req.params.id);
    if (!tenant) return res.status(404).json({ error: 'Tenant not found.' });
    res.json({ message: 'Deleted.' });
  } catch (err) { next(err); }
});

export default router;
