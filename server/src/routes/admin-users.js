import { Router } from 'express';
import { User } from '../models/User.js';
import { Lead } from '../models/Lead.js';

const router = Router();

// List all registered users
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    res.json({ ok: true, data: users });
  } catch (err) {
    next(err);
  }
});

// Get user details and their associated leads
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findOne({ userId: req.params.id }).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Find leads matching user email or phone
    const query = [];
    if (user.email) query.push({ email: user.email });
    if (user.phone) query.push({ phone: user.phone });
    
    let leads = [];
    if (query.length > 0) {
      leads = await Lead.find({ $or: query }).sort({ createdAt: -1 }).lean();
    }
    
    res.json({ ok: true, data: { user, leads } });
  } catch (err) {
    next(err);
  }
});

// Update user details
router.patch('/:id', async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { userId: req.params.id },
      { $set: req.body },
      { new: true }
    ).lean();
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ ok: true, data: user });
  } catch (err) {
    next(err);
  }
});

export default router;
