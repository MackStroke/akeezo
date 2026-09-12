import { createApp } from '../server/src/app.js';
import { connectDatabase } from '../server/src/config/db.js';

const app = createApp();
let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    await connectDatabase();
    isConnected = true;
  }
  return app(req, res);
}
