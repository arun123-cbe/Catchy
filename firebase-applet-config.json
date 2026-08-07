import mongoose, { Schema } from 'mongoose';

export interface IOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  items: Array<{
    productId: string;
    productName: string;
    productImage?: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  discount?: number;
  shipping?: number;
  tax?: number;
  total: number;
  paymentMethod: string;
  paymentDetails?: any;
  status: string;
  trackingNumber?: string;
}

const OrderSchema = new Schema<IOrder>(
  {
    id: { type: String, required: true, unique: true, index: true },
    orderNumber: { type: String, required: true },
    createdAt: { type: String, required: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      address: { type: String },
      city: { type: String },
      pincode: { type: String },
    },
    items: [
      {
        productId: { type: String, required: true },
        productName: { type: String, required: true },
        productImage: { type: String },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentDetails: { type: Schema.Types.Mixed },
    status: { type: String, default: 'Processing' },
    trackingNumber: { type: String },
  },
  { timestamps: true }
);

export const OrderModel =
  (mongoose.models.Order as mongoose.Model<IOrder>) || mongoose.model<IOrder>('Order', OrderSchema);
