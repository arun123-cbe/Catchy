export type Category = string;

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: Category;
  price: number; // In INR (₹)
  originalPrice?: number; // In INR (₹)
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  benefits: string[];
  specialities?: string[]; // e.g. ["100% Organic", "Cold Pressed", "Dermatologist Tested", "Cruelty Free"]
  ingredients?: string[];
  howToUse?: string;
  stock: number;
  reorderPoint: number;
  sku: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isOrganic?: boolean;
  isSuperSaver?: boolean;
  concernsHandled: string[]; // e.g. ["Dry Skin", "Anti-Aging", "Sleep"]
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'UPI' | 'CARD' | 'COD';

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
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
  items: {
    productId: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentDetails: {
    upiId?: string;
    upiRefNo?: string;
    cardLast4?: string;
    cardBrand?: string;
    status: 'PAID' | 'PENDING' | 'FAILED';
  };
  status: OrderStatus;
  trackingNumber?: string;
}

export interface QuizAnswers {
  primaryGoal: string;
  skinTypeOrConcern: string;
  lifestyleFactor: string;
  preferredForm: string;
}

export interface AIRecommendationResult {
  headline: string;
  summary: string;
  recommendedProductIds: string[];
  routineAdvice: string[];
}
