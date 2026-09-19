const required = (name, value) => {
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

const isProd = process.env.NODE_ENV === 'production';

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isProd,

  // API_PORT first, deliberately. A bare PORT is set by all sorts of things we
  // do not control — dev harnesses, PaaS runtimes, IDE task runners — and Node's
  // --env-file will not override a variable that is already in the environment,
  // so an ambient PORT silently wins over .env and the API ends up on the
  // frontend's port. API_PORT is ours alone; PORT stays as the fallback because
  // most hosting platforms only offer that one.
  port: Number(process.env.API_PORT ?? process.env.PORT ?? 5000),

  // In production, use MONGODB_URI if provided; fallback transparently to JSON store if not yet set
  mongoUri: (() => {
    let uri = process.env.MONGODB_URI ?? '';
    if (uri && !uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
      uri = `mongodb://${uri}`;
    }
    return uri;
  })(),

  corsOrigins: (() => {
    const defaultOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];
    if (process.env.VERCEL_URL) {
      defaultOrigins.push(`https://${process.env.VERCEL_URL}`);
    }
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      defaultOrigins.push(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
    }
    const envOrigins = (process.env.CORS_ORIGIN ?? '')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean);
    return [...defaultOrigins, ...envOrigins];
  })(),
};
