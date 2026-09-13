import { Router } from 'express';
import { EmergencyRequest } from '../models/EmergencyRequest.js';
import { find, findById, updateById, FILES, create } from '../utils/store.js';

const router = Router();

// Get all emergencies
router.get('/', async (req, res, next) => {
  try {
    const cases = await find(EmergencyRequest, FILES.emergency);
    // Sort by createdAt descending
    cases.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ ok: true, data: cases });
  } catch (err) {
    next(err);
  }
});

// Fetch single emergency
router.get('/:id', async (req, res, next) => {
  try {
    // Look up by caseId since that's the public ID
    let cases = await find(EmergencyRequest, FILES.emergency);
    let doc = cases.find(c => c.caseId === req.params.id || c._id?.toString() === req.params.id);
    
    if (!doc) {
      return res.status(404).json({ error: 'Emergency case not found' });
    }
    res.json({ ok: true, data: doc });
  } catch (err) {
    next(err);
  }
});

// Update status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status, note } = req.body;
    let cases = await find(EmergencyRequest, FILES.emergency);
    let doc = cases.find(c => c.caseId === req.params.id || c._id?.toString() === req.params.id);
    
    if (!doc) {
      return res.status(404).json({ error: 'Emergency case not found' });
    }

    const updatedTimeline = [...(doc.timeline || [])];
    updatedTimeline.push({
      at: new Date().toISOString(),
      status: status || doc.status,
      note: note || `Status updated to ${status}`,
      actor: req.user.id || 'admin'
    });

    const updated = await updateById(EmergencyRequest, FILES.emergency, doc._id || doc.id, {
      ...(status ? { status } : {}),
      timeline: updatedTimeline
    });

    res.json({ ok: true, data: updated });
  } catch (err) {
    next(err);
  }
});

export default router;
