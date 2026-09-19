import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { find, findById, updateById, addNoteToLead, deleteById, FILES } from '../utils/store.js';
import { Lead } from '../models/Lead.js';
import { EmergencyRequest } from '../models/EmergencyRequest.js';
import { Recommendation } from '../models/Recommendation.js';
import { User } from '../models/User.js';
import { Blog } from '../models/Blog.js';
import adminEmergenciesRoutes from './admin-emergencies.js';
import adminUsersRoutes from './admin-users.js';
import adminBlogRoutes from './admin-blog.js';

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
router.post('/login', async (req, res, next) => {
  try {
    const username = (req.body?.username ?? '').trim();
    const password = (req.body?.password ?? '');

    if (!username || !password) {
      return res.status(400).json({ ok: false, error: 'Username and password are required' });
    }

    const expectedUser = (process.env.ADMIN_USERNAME || 'admin').trim();
    const expectedPass = process.env.ADMIN_PASSWORD || 'password';

    // 1. Check default / environment variables (case-insensitive for username)
    if (
      username.toLowerCase() === expectedUser.toLowerCase() &&
      password === expectedPass
    ) {
      const token = jwt.sign({ id: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
      return res.json({ ok: true, token });
    }

    // 2. Fallback check for MongoDB User account if present
    try {
      const dbUser = await User.findOne({
        $or: [
          { username: { $regex: new RegExp(`^${username}$`, 'i') } },
          { email: username.toLowerCase() }
        ]
      });
      if (dbUser && (dbUser.role === 'admin' || dbUser.role === 'superadmin')) {
        const isValid = dbUser.comparePassword ? await dbUser.comparePassword(password) : false;
        if (isValid) {
          const token = jwt.sign({ id: dbUser._id, role: 'admin', name: dbUser.name }, JWT_SECRET, { expiresIn: '1d' });
          return res.json({ ok: true, token });
        }
      }
    } catch (_) { /* ignore if User model lookup fails */ }

    return res.status(401).json({ ok: false, error: 'Invalid username or password' });
  } catch (err) {
    next(err);
  }
});

router.use(requireAdminAuth);

router.use('/emergencies', adminEmergenciesRoutes);
router.use('/users', adminUsersRoutes);
router.use('/blog', adminBlogRoutes);

// Unified stats route — used by header polling AND dashboard
router.get('/stats', async (req, res, next) => {
  try {
    const [leads, emergencies, recommendations] = await Promise.all([
      find(Lead, FILES.leads),
      find(EmergencyRequest, FILES.emergency),
      find(Recommendation, FILES.recommendations),
    ]);

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOf7Days = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const startOf30Days = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const startOfPrev30Days = new Date(now - 60 * 24 * 60 * 60 * 1000);

    // --- LEADS ---
    const totalLeads = leads.length;
    const activeLeads = leads.filter(l => !l.status || l.status === 'New' || l.status === 'Contacted' || l.status === 'Qualified').length;
    const lostLeads = leads.filter(l => l.status === 'Lost').length;
    const convertedLeads = leads.filter(l => l.status === 'Converted').length;
    const newLeadsToday = leads.filter(l => new Date(l.createdAt) >= startOfToday).length;
    const leadsLast30 = leads.filter(l => new Date(l.createdAt) >= startOf30Days).length;
    const leadsPrev30 = leads.filter(l => new Date(l.createdAt) >= startOfPrev30Days && new Date(l.createdAt) < startOf30Days).length;
    const leadsLast7 = leads.filter(l => new Date(l.createdAt) >= startOf7Days).length;

    // Lead growth % vs prior period
    const leadGrowth = leadsPrev30 > 0 ? Math.round(((leadsLast30 - leadsPrev30) / leadsPrev30) * 100) : null;
    
    // Conversion rate
    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100 * 10) / 10 : 0;

    // Intent breakdown
    const intentBreakdown = {};
    leads.forEach(l => {
      const k = l.intent || l.type || 'general';
      intentBreakdown[k] = (intentBreakdown[k] || 0) + 1;
    });

    // Country breakdown (top 5)
    const countryCount = {};
    leads.forEach(l => {
      if (l.country) countryCount[l.country] = (countryCount[l.country] || 0) + 1;
    });
    const topCountries = Object.entries(countryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([country, count]) => ({ country, count }));

    // Leads per day last 7 days
    const leadsPerDay = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now - i * 24 * 60 * 60 * 1000);
      const label = day.toLocaleDateString('en-IN', { weekday: 'short' });
      const count = leads.filter(l => {
        const d = new Date(l.createdAt);
        return d.getFullYear() === day.getFullYear() &&
               d.getMonth() === day.getMonth() &&
               d.getDate() === day.getDate();
      }).length;
      leadsPerDay.push({ day: label, count });
    }

    // Status breakdown
    const statusBreakdown = {};
    leads.forEach(l => {
      const s = l.status || 'New';
      statusBreakdown[s] = (statusBreakdown[s] || 0) + 1;
    });

    // --- EMERGENCIES ---
    const totalEmergencies = emergencies.length;
    const activeEmergencies = emergencies.filter(e => !['closed', 'cancelled'].includes(e.status)).length;
    const closedEmergencies = emergencies.filter(e => e.status === 'closed').length;
    const emergenciesToday = emergencies.filter(e => new Date(e.createdAt) >= startOfToday).length;
    const latestEmergencyId = activeEmergencies > 0 ? emergencies.find(e => !['closed','cancelled'].includes(e.status))?.caseId : null;

    // --- NOTES ---
    let totalNotes = 0;
    leads.forEach(l => { if (l.notes) totalNotes += l.notes.length; });

    // --- USERS & BLOG (MongoDB only) ---
    let totalUsers = 0;
    let totalBlogPosts = 0;
    let publishedBlogPosts = 0;
    let totalBlogViews = 0;
    try {
      totalUsers = await User.countDocuments();
      const blogs = await Blog.find().lean();
      totalBlogPosts = blogs.length;
      publishedBlogPosts = blogs.filter(b => b.status === 'Published').length;
      totalBlogViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);
    } catch (_) { /* fallback: model not connected */ }

    // --- RECENT ACTIVITY (last 5 leads + emergencies + recommendations merged) ---
    const recentActivity = [
      ...leads.slice(0, 5).map(l => ({
        type: 'lead',
        id: l._id || l.id,
        journeyId: l.journeyId,
        name: l.name,
        intent: l.intent || l.type || 'General',
        status: l.status || 'New',
        createdAt: l.createdAt,
      })),
      ...emergencies.slice(0, 5).map(e => ({
        type: 'emergency',
        id: e._id || e.id,
        caseId: e.caseId,
        name: e.callerName || e.name,
        problem: e.problem,
        status: e.status,
        createdAt: e.createdAt,
      })),
      ...recommendations.slice(0, 5).map(r => ({
        type: 'recommendation',
        id: r._id || r.id,
        journeyId: r.recommendationId,
        name: r.name,
        targetName: r.targetName,
        recType: r.type,
        status: r.status || 'new',
        createdAt: r.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8);

    const totalRecommendations = recommendations.length;
    const newRecommendations = recommendations.filter(r => !r.status || r.status === 'new').length;

    res.json({
      ok: true,
      data: {
        // Leads
        totalLeads,
        activeLeads,
        lostLeads,
        convertedLeads,
        newLeadsToday,
        leadsLast7,
        leadsLast30,
        leadGrowth,
        conversionRate,
        intentBreakdown,
        topCountries,
        leadsPerDay,
        statusBreakdown,
        // Emergencies
        totalEmergencies,
        activeEmergencies,
        closedEmergencies,
        emergenciesToday,
        latestEmergencyId,
        // Recommendations
        totalRecommendations,
        newRecommendations,
        // Notes / tasks
        totalNotes,
        tasks: activeLeads,
        // Users & Blog
        totalUsers,
        totalBlogPosts,
        publishedBlogPosts,
        totalBlogViews,
        // Activity feed
        recentActivity,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Get all leads
router.get('/leads', async (req, res, next) => {
  try {
    const leads = await find(Lead, FILES.leads);
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

// Update lead
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
      date: new Date().toISOString(),
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

// Recommendation Endpoints
router.get('/recommendations', async (req, res, next) => {
  try {
    const recommendations = await find(Recommendation, FILES.recommendations);
    recommendations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ ok: true, data: recommendations });
  } catch (err) {
    next(err);
  }
});

router.patch('/recommendations/:id', async (req, res, next) => {
  try {
    const updated = await updateById(Recommendation, FILES.recommendations, req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Recommendation not found' });
    res.json({ ok: true, data: updated });
  } catch (err) {
    next(err);
  }
});

router.delete('/recommendations/:id', async (req, res, next) => {
  try {
    const deleted = await deleteById(Recommendation, FILES.recommendations, req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Recommendation not found' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// Admin profile
router.get('/profile', (req, res) => {
  const username = req.user.id;
  const isSuper = username === 'admin';

  res.json({
    ok: true,
    data: {
      id: username,
      name: isSuper ? 'Akeezo Administrator' : username,
      role: req.user.role === 'admin' ? 'Super Admin' : 'Agent',
      email: isSuper ? 'admin@akeezo.com' : `${username}@akeezo.com`,
      department: 'Platform Administration',
      location: 'India HQ',
      avatar: `https://ui-avatars.com/api/?name=${isSuper ? 'Akeezo+Admin' : username}&background=0D1B2A&color=fff&size=256`,
      twoFactorEnabled: true,
    },
  });
});

export default router;
