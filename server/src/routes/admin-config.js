import { Router } from 'express';
import { SiteConfig } from '../models/SiteConfig.js';

const router = Router();

// Get config
router.get('/', async (req, res, next) => {
  try {
    let config = await SiteConfig.findOne({ key: 'global_settings' }).lean();
    if (!config) {
      config = await SiteConfig.create({ key: 'global_settings', maintenancePages: [] });
    }
    res.json({ ok: true, data: config });
  } catch (err) {
    next(err);
  }
});

// Update config
router.patch('/', async (req, res, next) => {
  try {
    let config = await SiteConfig.findOne({ key: 'global_settings' });
    if (!config) {
      config = new SiteConfig({ key: 'global_settings' });
    }
    
    if (Array.isArray(req.body.maintenancePages)) {
      config.maintenancePages = req.body.maintenancePages;
    }
    if (req.body.cities) {
      config.cities = req.body.cities;
    }
    if (req.body.countries) {
      config.countries = req.body.countries;
    }
    if (req.body.gtmId !== undefined) {
      config.gtmId = req.body.gtmId;
    }
    if (req.body.googleSiteVerification !== undefined) {
      config.googleSiteVerification = req.body.googleSiteVerification;
    }
    
    await config.save();
    res.json({ ok: true, data: config });
  } catch (err) {
    next(err);
  }
});

export default router;
