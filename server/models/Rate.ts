import mongoose from 'mongoose';
import { Rate } from '@shared/mongoSchema';

const rateSchema = new mongoose.Schema<Rate>({
  material: { type: String, enum: ['gold', 'silver'], required: true, unique: true },
  rate: { type: String, required: true },
  change: { type: String, required: true },
  updatedAt: { type: String, required: true },
});

export default mongoose.model<Rate>('Rate', rateSchema);