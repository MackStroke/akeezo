import { Router } from 'express';
import { findPaginated, updateById, create, deleteById, FILES } from '../utils/store.js';
import { isDatabaseConnected } from '../config/db.js';
import { Package } from '../models/Package.js';
import crypto from 'crypto';

const router = Router();

// GET /api/admin/packages
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    let result;
    if (isDatabaseConnected()) {
      const skip = (page - 1) * limit;
      const data = await Package.find({}).sort({ sortOrder: 1, createdAt: -1 }).skip(skip).limit(limit).lean();
      const total = await Package.countDocuments({});
      result = { data, total, page, limit };
    } else {
      result = await findPaginated(Package, FILES.packages, {
        sort: { sortOrder: 1, createdAt: -1 },
        page,
        limit,
      });
    }

    res.json({ ok: true, data: result });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/packages
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    
    if (!data.planId) {
      data.planId = 'PKG-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    }

    const result = await create(Package, FILES.packages, data);
    res.json({ ok: true, data: result });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ ok: false, error: 'A package with this ID already exists.' });
    }
    next(err);
  }
});

// PUT /api/admin/packages/:id
router.put('/:id', async (req, res, next) => {
  try {
    const data = req.body;
    // Don't allow changing planId via update easily, or ensure it's not tampered to empty
    delete data._id;
    delete data.planId;

    const result = await updateById(Package, FILES.packages, req.params.id, data);
    if (!result) return res.status(404).json({ ok: false, error: 'Package not found' });
    
    res.json({ ok: true, data: result });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/packages/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await deleteById(Package, FILES.packages, req.params.id);
    if (!result) return res.status(404).json({ ok: false, error: 'Package not found' });
    
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
