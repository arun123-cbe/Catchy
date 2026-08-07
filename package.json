import mongoose from 'mongoose';

let isConnected = false;

export async function connectMongoDB(): Promise<boolean> {
  const defaultAtlasUri = 'mongodb+srv://inhausdigitale_db_user:1mMBARW4WsGL7hl8@cluster0.stlnzap.mongodb.net/auraglow_db?retryWrites=true&w=majority';
  let mongoUri = (process.env.MONGODB_URI || defaultAtlasUri).trim();
  // Clean up if user accidentally pasted MONGODB_URI="..." into the value field
  if (mongoUri.startsWith('MONGODB_URI=')) {
    mongoUri = mongoUri.replace(/^MONGODB_URI=\s*/, '');
  }
  mongoUri = mongoUri.replace(/^["']|["']$/g, '').trim();

  if (isConnected && mongoose.connection.readyState === 1) {
    return true;
  }

  try {
    console.log('[MongoDB] Connecting to MongoDB instance...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    isConnected = true;
    console.log('[MongoDB] ✅ Successfully connected to MongoDB database!');
    return true;
  } catch (error: any) {
    console.error('[MongoDB Error] Could not connect to MongoDB:', error?.message || error);
    isConnected = false;
    return false;
  }
}

export function isMongoDBConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
