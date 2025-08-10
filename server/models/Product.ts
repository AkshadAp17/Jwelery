import mongoose from 'mongoose';
import { Product } from '@shared/mongoSchema';

const productSchema = new mongoose.Schema<Product>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String },
  material: { type: String, enum: ['gold', 'silver'], required: true },
  weight: { type: String, required: true },
  purity: { type: String, required: true },
  region: { type: String },
  images: [{ type: String }],
  featured: { type: Number, default: 0 },
}, {
  timestamps: true,
});

productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ material: 1 });
productSchema.index({ featured: -1 });

export default mongoose.model<Product>('Product', productSchema);