import { Router } from 'express';
import { Doctor } from '../models/Doctor.js';

const router = Router();

// GET /api/doctors
router.get('/', async (req, res, next) => {
  try {
    const { consultationType } = req.query;
    let query = { available: true };
    
    if (consultationType) {
      query.consultationType = consultationType;
    }

    const doctors = await Doctor.find(query).sort({ createdAt: -1 });
    res.json({ ok: true, data: doctors });
  } catch (error) {
    next(error);
  }
});

// For seeding/testing if needed
router.post('/', async (req, res, next) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.json({ ok: true, data: doctor });
  } catch (error) {
    next(error);
  }
});

export default router;
