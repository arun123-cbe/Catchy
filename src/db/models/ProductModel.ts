import mongoose, { Schema } from 'mongoose';

export interface IProduct {
  id: string;
  name: string;
  tagline?: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  image?: string;
  description?: string;
  benefits?: string[];
  specialities?: string[];
  ingredients?: string[];
  howToUse?: string;
  stock: number;
  reorderPoint?: number;
  sku?: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isOrganic?: boolean;
  isSuperSaver?: boolean;
  isMostlyBought?: boolean;
  isCustomersFavorite?: boolean;
  concernsHandled?: string[];
}

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    tagline: { type: String },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 0 },
    image: { type: String },
    description: { type: String },
    benefits: [{ type: String }],
    specialities: [{ type: String }],
    ingredients: [{ type: String }],
    howToUse: { type: String },
    stock: { type: Number, required: true, default: 0 },
    reorderPoint: { type: Number, default: 10 },
    sku: { type: String },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isOrganic: { type: Boolean, default: false },
    isSuperSaver: { type: Boolean, default: false },
    isMostlyBought: { type: Boolean, default: false },
    isCustomersFavorite: { type: Boolean, default: false },
    concernsHandled: [{ type: String }],
  },
  { timestamps: true }
);

export const ProductModel =
  (mongoose.models.Product as mongoose.Model<IProduct>) || mongoose.model<IProduct>('Product', ProductSchema);
