import mongoose from 'mongoose';
import { env } from './env.js';

let connected = false;

/**
 * Connects to MongoDB when MONGODB_URI is configured.
 *
 * When it is not configured (local dev without a Mongo instance) we skip the
 * connection and the repository layer transparently falls back to a JSON file
 * store. Production refuses to start without a URI — see config/env.js.
 */
export async function connectDatabase() {
  if (!env.mongoUri) {
    console.warn(
      '[db] MONGODB_URI is not set — using the JSON file fallback store (server/.data).\n' +
        '     This is for local development only. Set MONGODB_URI for real persistence.',
    );
    return false;
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 8000 });
  connected = true;
  console.log('[db] connected to MongoDB');

  mongoose.connection.on('disconnected', () => {
    connected = false;
    console.warn('[db] MongoDB disconnected');
  });
  mongoose.connection.on('reconnected', () => {
    connected = true;
    console.log('[db] MongoDB reconnected');
  });

  return true;
}

export const isDatabaseConnected = () => connected;

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  connected = false;
}
