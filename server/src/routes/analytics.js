import { Router } from 'express';
import { Visitor } from '../models/Visitor.js';

const router = Router();

// Public endpoint to track user events
router.post('/track', async (req, res, next) => {
  try {
    const { visitorId, type, path, section, details } = req.body;
    
    if (!visitorId) {
      return res.status(400).json({ ok: false, error: 'visitorId is required' });
    }

    // Attempt to get client IP and Country (Vercel specific headers)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const country = req.headers['x-vercel-ip-country'] || 'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Find or create visitor profile
    let visitor = await Visitor.findOne({ visitorId });
    
    const now = new Date();
    
    if (!visitor) {
      visitor = new Visitor({
        visitorId,
        ip,
        userAgent,
        country,
        events: [],
        sessionCount: 1,
        lastActive: now,
      });
    } else {
      // Check if it's a new session (e.g., more than 30 minutes since last active)
      const timeSinceLastActive = now.getTime() - new Date(visitor.lastActive).getTime();
      if (timeSinceLastActive > 30 * 60 * 1000) {
        visitor.sessionCount += 1;
      }
      visitor.lastActive = now;
      // Optionally update IP/Location if it changed
      if (country !== 'Unknown') visitor.country = country;
    }

    // Add the event
    visitor.events.push({
      type: type || 'page_view',
      path: path || '/',
      section: section || '',
      details: details || {},
      timestamp: now,
    });

    // To prevent documents from growing infinitely (MongoDB 16MB limit), cap events at 1000 per visitor
    if (visitor.events.length > 1000) {
      // Remove oldest 100 events
      visitor.events = visitor.events.slice(-900);
    }

    await visitor.save();

    res.json({ ok: true });
  } catch (err) {
    // Fail silently for analytics so we don't break the frontend
    console.error('[Analytics] Error tracking event:', err.message);
    res.status(200).json({ ok: false, error: 'Analytics error' });
  }
});

export default router;
