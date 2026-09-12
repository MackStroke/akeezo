import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { find, findById, updateById, addNoteToLead, deleteById, FILES } from '../utils/store.js';
import { Lead } from '../models/Lead.js';
import { EmergencyRequest } from '../models/EmergencyRequest.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

// Auth middleware for admin routes
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  if (token === 'dummy-jwt-token') {
    // For development fallback
    req.user = { id: 'admin', role: 'admin' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Admin login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Hardcoded for demo/basic admin. Ideally check against DB.
  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ id: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ ok: true, token });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

router.use(requireAdminAuth);

// Get all leads
router.get('/leads', async (req, res, next) => {
  try {
    const leads = await find(Lead, FILES.leads);
    // Sort by createdAt descending
    leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ ok: true, data: leads });
  } catch (err) {
    next(err);
  }
});

// Fetch single lead
router.get('/leads/:id', async (req, res, next) => {
  try {
    const lead = await findById(Lead, FILES.leads, req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json({ ok: true, data: lead });
  } catch (err) {
    next(err);
  }
});

// Update lead (status, etc.)
router.patch('/leads/:id', async (req, res, next) => {
  try {
    const updatedLead = await updateById(Lead, FILES.leads, req.params.id, req.body);
    if (!updatedLead) return res.status(404).json({ error: 'Lead not found' });
    res.json({ ok: true, data: updatedLead });
  } catch (err) {
    next(err);
  }
});

// Add note to lead
router.post('/leads/:id/notes', async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Note text is required' });

    const newNote = {
      id: Date.now().toString(),
      text,
      author: req.user.name || 'Admin User',
      date: new Date().toISOString()
    };

    const updatedLead = await addNoteToLead(Lead, FILES.leads, req.params.id, newNote);
    if (!updatedLead) return res.status(404).json({ error: 'Lead not found' });
    
    res.json({ ok: true, data: updatedLead });
  } catch (err) {
    next(err);
  }
});

// Delete lead
router.delete('/leads/:id', async (req, res, next) => {
  try {
    const deletedLead = await deleteById(Lead, FILES.leads, req.params.id);
    if (!deletedLead) return res.status(404).json({ error: 'Lead not found' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// Dashboard stats
router.get('/stats', async (req, res, next) => {
  try {
    const leads = await find(Lead, FILES.leads);
    // Mocking stats
    res.json({
      ok: true,
      data: {
        totalLeads: leads.length,
        activeLeads: leads.filter(l => !l.status || l.status === 'New').length,
      }
    });
  } catch (err) {
    next(err);
  }
});

// Admin profile
router.get('/profile', (req, res) => {
  // Syncing with user injected by requireAdminAuth
  res.json({
    ok: true,
    data: {
      id: req.user.id,
      name: 'Mark Bennet',
      role: req.user.role,
      email: 'mark.bennet@akeezo.com',
      department: 'Platform Administration',
      location: 'India HQ',
      avatar: 'https://i.pravatar.cc/150?u=mark',
      twoFactorEnabled: true,
    }
  });
});

export default router;
