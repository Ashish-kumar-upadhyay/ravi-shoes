import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  imageUrlsFixed?: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;

  if (!cached.imageUrlsFixed) {
    cached.imageUrlsFixed = true;
    import("@/lib/fix-images")
      .then(({ fixStoredImageUrls }) => fixStoredImageUrls())
      .catch((err) => console.error("Image URL migration error:", err));
  }

  return cached.conn;
}
