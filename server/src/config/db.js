import mongoose from 'mongoose';
import { env } from './env.js';
import { syncTempDataToMongo } from '../utils/store.js';

let connected = false;
let listenersAttached = false;

/**
 * Connects to MongoDB when MONGODB_URI is configured.
 *
 * Safe to call on every serverless request — skips if already connected.
 * When not configured falls back to the JSON file store (local dev only).
 */
export async function connectDatabase() {
  if (!env.mongoUri) {
    console.warn(
      '[db] MONGODB_URI is not set — using the JSON file fallback store.\n' +
        '     This is for local development only. Set MONGODB_URI for real persistence.',
    );
    return false;
  }

  // Already connected — nothing to do
  if (connected && mongoose.connection.readyState === 1) {
    return true;
  }

  mongoose.set('strictQuery', true);
  mongoose.set('bufferCommands', false); // fail fast in serverless

  console.log('[db] Connecting to MongoDB...');
  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 30000,
  });
  connected = true;
  console.log('[db] Connected to MongoDB');

  // Sync any /tmp fallback data that was written while offline
  syncTempDataToMongo().catch((err) =>
    console.error('[db] Error syncing temp data:', err.message),
  );

  // Attach event listeners only once per process to avoid duplicate handlers
  if (!listenersAttached) {
    listenersAttached = true;
    mongoose.connection.on('disconnected', () => {
      connected = false;
      console.warn('[db] MongoDB disconnected');
    });
    mongoose.connection.on('reconnected', () => {
      connected = true;
      console.log('[db] MongoDB reconnected');
      syncTempDataToMongo().catch((err) =>
        console.error('[db] Error syncing temp data on reconnect:', err.message),
      );
    });
  }

  return true;
}

export const isDatabaseConnected = () => connected;

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  connected = false;
}
