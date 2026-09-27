import { Router } from 'express';
import { FAQ } from '../models/FAQ.js';

const router = Router();

// Get all FAQs (including drafts)
router.get('/', async (req, res, next) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    res.json({ ok: true, data: faqs });
  } catch (err) {
    next(err);
  }
});

// Create FAQ
router.post('/', async (req, res, next) => {
  try {
    const newFaq = new FAQ(req.body);
    const saved = await newFaq.save();
    res.json({ ok: true, data: saved });
  } catch (err) {
    next(err);
  }
});

// Update FAQ
router.patch('/:id', async (req, res, next) => {
  try {
    const updated = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'FAQ not found' });
    res.json({ ok: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// Delete FAQ
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await FAQ.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'FAQ not found' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
