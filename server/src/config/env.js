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

  // In production a real database is mandatory; in dev we allow the file fallback.
  mongoUri: (() => {
    let uri = isProd
      ? required('MONGODB_URI', process.env.MONGODB_URI)
      : (process.env.MONGODB_URI ?? '');
    if (uri && !uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
      uri = `mongodb://${uri}`;
    }
    return uri;
  })(),

  corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
};
