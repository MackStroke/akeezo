import { Router } from 'express';
import { Package } from '../models/Package.js';
import { isDatabaseConnected } from '../config/db.js';
import { readCollection, FILES } from '../utils/store.js';

const router = Router();

// GET /api/packages
router.get('/', async (req, res, next) => {
  try {
    let data;
    if (isDatabaseConnected()) {
      data = await Package.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 }).lean();
    } else {
      const rows = await readCollection(FILES.packages);
      data = rows.filter(r => r.isActive !== false).sort((a, b) => {
        const orderA = a.sortOrder || 0;
        const orderB = b.sortOrder || 0;
        return orderA - orderB;
      });
    }

    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});

export default router;
