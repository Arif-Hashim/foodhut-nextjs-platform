import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || '';

let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (!MONGO_URI || MONGO_URI.includes('<username>')) {
    console.warn('MongoDB URI not configured yet. Using fallback mock data mode.');
    return null;
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, { bufferCommands: false }).then((m) => m);
  }
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    console.error('MongoDB connection error:', err);
    return null;
  }
}
