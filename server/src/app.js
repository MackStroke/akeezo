import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import healthRoutes from './routes/health.js';
import leadRoutes from './routes/leads.js';
import emergencyRoutes from './routes/emergency.js';
import adminRoutes from './routes/admin.js';

export function createApp() {
  const app = express();

  // Behind a reverse proxy in production, so rate limiting and req.ip need the
  // forwarded headers. One hop only — do not trust an arbitrary chain.
  app.set('trust proxy', env.isProd ? 1 : false);
  app.disable('x-powered-by');

  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        // Same-origin / server-to-server requests send no Origin header.
        if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`Origin ${origin} is not allowed`));
      },
      methods: ['GET', 'POST'],
    }),
  );

  // Medical record uploads arrive in Phase 2 via multipart; JSON stays small.
  app.use(express.json({ limit: '64kb' }));

  app.use('/api/health', healthRoutes);
  app.use('/api/leads', leadRoutes);
  app.use('/api/emergency', emergencyRoutes);
  app.use('/api/admin', adminRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
