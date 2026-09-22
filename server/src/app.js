import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import healthRoutes from './routes/health.js';
import leadRoutes from './routes/leads.js';
import emergencyRoutes from './routes/emergency.js';
import adminRoutes from './routes/admin.js';
import blogRoutes from './routes/blog.js';
import hospitalRoutes from './routes/hospitals.js';
import recommendationRoutes from './routes/recommendations.js';
import doctorRoutes from './routes/doctors.js';

import configRoutes from './routes/config.js';
import analyticsRoutes from './routes/analytics.js';

export function createApp() {
  const app = express();

  // Behind a reverse proxy in production, so rate limiting and req.ip need the
  // forwarded headers. One hop only — do not trust an arbitrary chain.
  app.set('trust proxy', env.isProd ? 1 : false);
  app.disable('x-powered-by');

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(
    cors({
      origin(origin, callback) {
        // Same-origin, serverless internal, configured origins, Vercel deployments, or non-prod
        if (
          !origin ||
          env.corsOrigins.includes(origin) ||
          origin.endsWith('.vercel.app') ||
          !env.isProd
        ) {
          return callback(null, true);
        }
        callback(new Error(`Origin ${origin} is not allowed`));
      },
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
    }),
  );

  // Disable HTTP caching on all API responses so clients always receive fresh real-time data
  app.use('/api', (req, res, next) => {
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'Surrogate-Control': 'no-store',
    });
    next();
  });

  // Normalize body if Vercel serverless runtime already parsed or passed string body
  app.use((req, res, next) => {
    if (req.body && typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body);
      } catch (_) {}
    }
    next();
  });

  // Medical record uploads arrive in Phase 2 via multipart; JSON stays small.
  app.use(express.json({ limit: '5mb' }));

  app.use('/api/health', healthRoutes);
  app.use('/api/leads', leadRoutes);
  app.use('/api/emergency', emergencyRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/blog', blogRoutes);
  app.use('/api/hospitals', hospitalRoutes);
  app.use('/api/recommendations', recommendationRoutes);
  app.use('/api/doctors', doctorRoutes);
  app.use('/api/config', configRoutes);
  app.use('/api/analytics', analyticsRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
