import { createApp } from '../server/src/app.js';
import { connectDatabase, isDatabaseConnected } from '../server/src/config/db.js';

const app = createApp();
let connecting = false;

export default async function handler(req, res) {
  // Re-check on every request — if the connection dropped (Lambda reuse after
  // a MongoDB Atlas idle disconnect), reconnect before handling the request.
  if (!isDatabaseConnected() && !connecting) {
    connecting = true;
    try {
      await connectDatabase();
    } catch (err) {
      console.error('[db] MongoDB connection FAILED:', err.message);
      console.error('[db] MONGODB_URI set?', !!process.env.MONGODB_URI);
    } finally {
      connecting = false;
    }
  }

  // Tell Express body-parser that Vercel has already consumed & parsed the request body
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
    req._body = true;
  } else if (req.body && typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);
      req._body = true;
    } catch (_) {}
  }

  return app(req, res);
}
