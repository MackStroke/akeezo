import mongoose from 'mongoose';
import { env } from './env.js';
import { syncTempDataToMongo } from '../utils/store.js';

let listenersAttached = false;
let connectPromise = null;

export function getMongoUri() {
  let uri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL || env.mongoUri || '';
  uri = uri.trim();
  if (uri && !uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    uri = `mongodb://${uri}`;
  }
  return uri;
}

/**
 * Connects to MongoDB when MONGODB_URI is configured.
 *
 * In serverless environments, multiple parallel requests arrive simultaneously
 * during a page refresh. By caching the active promise, all concurrent requests
 * cleanly await the same connection instead of racing or bypassing it.
 */
export async function connectDatabase() {
  const uri = getMongoUri();
  if (!uri) {
    console.warn('[db] MONGODB_URI is not set — running in local file fallback mode.');
    return false;
  }

  // ReadyState: 1 = connected
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  // If a connection attempt is already in flight, return the existing promise
  if (connectPromise) {
    return connectPromise;
  }

  connectPromise = (async () => {
    mongoose.set('strictQuery', true);
    mongoose.set('bufferCommands', false);

    console.log('[db] Connecting to MongoDB...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
    });
    console.log('[db] Connected to MongoDB');

    // Sync any temporary offline data into MongoDB in the background
    syncTempDataToMongo().catch((err) =>
      console.error('[db] Error syncing temp data:', err.message),
    );

    if (!listenersAttached) {
      listenersAttached = true;
      mongoose.connection.on('disconnected', () => {
        console.warn('[db] MongoDB disconnected');
      });
      mongoose.connection.on('reconnected', () => {
        console.log('[db] MongoDB reconnected');
        syncTempDataToMongo().catch((err) =>
          console.error('[db] Error syncing temp data on reconnect:', err.message),
        );
      });
    }

    return true;
  })()
    .catch((err) => {
      console.error('[db] Connection attempt failed:', err.message);
      throw err;
    })
    .finally(() => {
      connectPromise = null;
    });

  return connectPromise;
}

/**
 * Live check of Mongoose connection state.
 * 1 means connected.
 */
export const isDatabaseConnected = () => mongoose.connection.readyState === 1;

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
}
