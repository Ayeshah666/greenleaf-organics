import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  featured: boolean;
  badge?: string;
  weight?: string;
  benefits?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['Seeds', 'Soil & Compost', 'Tools', 'Fertilizers', 'Pest Control', 'Planters'],
    },
    image: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    featured: { type: Boolean, default: false },
    badge: { type: String },
    weight: { type: String },
    benefits: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
