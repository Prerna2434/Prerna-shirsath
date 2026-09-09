import { Router, Request, Response, NextFunction } from 'express';
import { PrescriptionCase } from '../models/PrescriptionCase.js';

const router = Router();

const VALID_STATUSES = ['Pending', 'Generic Approved', 'Brand Locked', 'Rejected'] as const;
type ReviewStatus = typeof VALID_STATUSES[number];

/** GET /api/prescriptions — list all cases (optional ?priority=STAT|Routine|DDI Alert|Refill) */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.priority) filter.priority = req.query.priority;
    const cases = await PrescriptionCase.find(filter).sort({ isStat: -1, createdAt: 1 });
    res.json(cases);
  } catch (err) { next(err); }
});

/** GET /api/prescriptions/:id */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rx = await PrescriptionCase.findById(req.params.id);
    if (!rx) return res.status(404).json({ error: 'Prescription case not found.' });
    res.json(rx);
  } catch (err) { next(err); }
});

/** POST /api/prescriptions — create a new case */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rx = await PrescriptionCase.create(req.body);
    res.status(201).json(rx);
  } catch (err) { next(err); }
});

/** PATCH /api/prescriptions/:id/review — update reviewStatus and optionally append a progress note */
router.patch('/:id/review', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, note } = req.body as { status?: string; note?: string };

    if (status && !(VALID_STATUSES as readonly string[]).includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}.` });
    }

    const rx = await PrescriptionCase.findById(req.params.id);
    if (!rx) return res.status(404).json({ error: 'Prescription case not found.' });

    if (status) rx.reviewStatus = status as ReviewStatus;
    if (note?.trim()) {
      const timestamp = new Date().toISOString();
      rx.progressNotes = rx.progressNotes
        ? `${rx.progressNotes}\n[${timestamp}] ${note.trim()}`
        : `[${timestamp}] ${note.trim()}`;
    }
    await rx.save();
    res.json(rx);
  } catch (err) { next(err); }
});

/** DELETE /api/prescriptions/:id */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rx = await PrescriptionCase.findByIdAndDelete(req.params.id);
    if (!rx) return res.status(404).json({ error: 'Prescription case not found.' });
    res.json({ message: 'Deleted.' });
  } catch (err) { next(err); }
});

export default router;
