import { Router } from 'express';
import { FAQ } from '../models/FAQ.js';

const router = Router();

// Get all published FAQs
router.get('/', async (req, res, next) => {
  try {
    const faqs = await FAQ.find({ status: 'Published' }).sort({ category: 1, order: 1, createdAt: -1 });
    res.json({ ok: true, data: faqs });
  } catch (err) {
    next(err);
  }
});

export default router;
