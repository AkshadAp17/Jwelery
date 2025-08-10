import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB() {
  if (!MONGODB_URI) {
    console.log('No MongoDB URI provided, using in-memory storage');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('MongoDB connection failed, falling back to in-memory storage');
    console.log('Error:', error);
  }
}

export function isMongoConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export { mongoose };