import { Router } from 'express';
import mongoose from 'mongoose';
import { isDatabaseConnected, getMongoUri } from '../config/db.js';
import { env } from '../config/env.js';
import { Lead } from '../models/Lead.js';
import { EmergencyRequest } from '../models/EmergencyRequest.js';

const router = Router();

router.get('/', async (req, res) => {
  const uri = getMongoUri();
  const uriClean = uri ? uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : 'not-set';

  let leadCount = 0;
  let emgCount = 0;
  if (isDatabaseConnected()) {
    try {
      [leadCount, emgCount] = await Promise.all([
        Lead.countDocuments(),
        EmergencyRequest.countDocuments(),
      ]);
    } catch (_) {}
  }

  res.json({
    ok: true,
    data: {
      service: 'akeezo-api',
      env: env.nodeEnv,
      store: isDatabaseConnected() ? 'mongodb' : 'file-fallback',
      readyState: mongoose.connection.readyState, // 1 = connected
      mongoConfigured: Boolean(uri),
      mongoTarget: uriClean,
      dbCounts: isDatabaseConnected() ? { leads: leadCount, emergencies: emgCount } : null,
      uptimeSeconds: Math.round(process.uptime()),
    },
  });
});

export default router;
