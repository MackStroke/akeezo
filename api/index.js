import { createApp } from '../server/src/app.js';
import { connectDatabase, isDatabaseConnected } from '../server/src/config/db.js';

const app = createApp();

export default async function handler(req, res) {
  // Ensure database connection is ready before handling the request.
  // connectDatabase() caches in-flight promises so concurrent requests on page
  // refresh will properly wait for the connection rather than bypassing it.
  if (!isDatabaseConnected()) {
    try {
      await connectDatabase();
    } catch (err) {
      console.error('[db] MongoDB connection FAILED:', err.message);
      console.error('[db] MONGODB_URI set?', !!process.env.MONGODB_URI);
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

  // Keep Lambda container awake until Express finishes writing the response
  return new Promise((resolve) => {
    res.on('finish', resolve);
    res.on('close', resolve);
    app(req, res);
  });
}
