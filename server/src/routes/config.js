import { Router } from 'express';
import { SiteConfig } from '../models/SiteConfig.js';

const router = Router();

router.get('/', async (req, res, next) => {
  // Prevent browser caching so maintenance toggles reflect immediately
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    const config = await SiteConfig.findOne({ key: 'global_settings' }).lean();
    res.json({ 
      ok: true, 
      data: { 
        maintenancePages: config?.maintenancePages || [],
        cities: config?.cities || [],
        countries: config?.countries || [],
        gtmId: config?.gtmId || '',
        googleSiteVerification: config?.googleSiteVerification || ''
      } 
    });
  } catch (err) {
    // If DB is offline, fail gracefully returning an empty list
    res.json({ ok: true, data: { maintenancePages: [], cities: [], countries: [], gtmId: '', googleSiteVerification: '' } });
  }
});

export default router;
