import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'please define MONGODB_URI environment variable in .env.local',
  );
}

interface IMongooseCache {
  conn: string | null;
  promise: Promise<string> | null;
}

const cache: IMongooseCache = { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI).then(() => 'ok');
  }

  cache.conn = await cache.promise;

  return cache.conn;
};
