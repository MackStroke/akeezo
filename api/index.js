import { createApp } from '../server/src/app.js';
import { connectDatabase } from '../server/src/config/db.js';

const app = createApp();
let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    try {
      await connectDatabase();
      isConnected = true;
    } catch (err) {
      console.error('[db] MongoDB connection FAILED:', err.message);
      console.error('[db] MONGODB_URI set?', !!process.env.MONGODB_URI);
      // falls through to JSON file fallback (stored in /tmp on Lambda)
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
