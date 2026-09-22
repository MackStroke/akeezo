import { Router } from 'express';
import { Visitor } from '../models/Visitor.js';

const router = Router();

// Get summary for the dashboard widget
router.get('/summary', async (req, res, next) => {
  try {
    const totalVisitors = await Visitor.countDocuments();
    
    // Get unique visitors today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayVisitors = await Visitor.countDocuments({ lastActive: { $gte: startOfToday } });
    
    // Get page views (roughly estimate by counting events, or fetch top 5 recent)
    // To be efficient, we can aggregate the top paths across recent events
    const recentVisitors = await Visitor.find().sort({ lastActive: -1 }).limit(10).lean();
    
    // Calculate total events/pageviews
    const agg = await Visitor.aggregate([
      { $unwind: '$events' },
      { $match: { 'events.type': 'page_view' } },
      { $group: { _id: '$events.path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    res.json({
      ok: true,
      data: {
        totalVisitors,
        todayVisitors,
        recentActivity: recentVisitors.map(v => ({
          id: v._id,
          visitorId: v.visitorId,
          country: v.country,
          lastActive: v.lastActive,
          eventCount: v.events.length,
          lastPage: v.events[v.events.length - 1]?.path || 'Unknown'
        })),
        topPages: agg.map(p => ({ path: p._id, views: p.count }))
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get full visitor profiles
router.get('/visitors', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;
    
    const visitors = await Visitor.find()
      .sort({ lastActive: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
      
    const total = await Visitor.countDocuments();
    
    res.json({
      ok: true,
      data: visitors,
      meta: { total, skip, limit }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
