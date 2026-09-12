import { Router } from 'express';
import { isDatabaseConnected } from '../config/db.js';
import { env } from '../config/env.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    ok: true,
    data: {
      service: 'akeezo-api',
      env: env.nodeEnv,
      store: isDatabaseConnected() ? 'mongodb' : 'file-fallback',
      uptimeSeconds: Math.round(process.uptime()),
    },
  });
});

export default router;
