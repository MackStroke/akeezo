import mongoose from 'mongoose';
import { env } from './env.js';
import { syncTempDataToMongo } from '../utils/store.js';

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
  mongoose.set('bufferCommands', false); // fail fast in serverless — never queue ops when disconnected

  console.log('[db] Connecting to MongoDB...');
  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 30000,
  });
  connected = true;
  console.log('[db] connected to MongoDB');

  // Trigger background sync of any temporary offline JSON data into MongoDB
  syncTempDataToMongo().catch((err) =>
    console.error('[db] Error running background temp data sync:', err.message),
  );

  mongoose.connection.on('disconnected', () => {
    connected = false;
    console.warn('[db] MongoDB disconnected');
  });
  mongoose.connection.on('reconnected', () => {
    connected = true;
    console.log('[db] MongoDB reconnected');
    syncTempDataToMongo().catch((err) =>
      console.error('[db] Error running background temp data sync on reconnect:', err.message),
    );
  });

  return true;
}

export const isDatabaseConnected = () => connected;

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  connected = false;
}
