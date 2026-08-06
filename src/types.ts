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
  isMostlyBought?: boolean;
  isCustomersFavorite?: boolean;
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

export interface HeroSlide {
  id: string;
  image: string;
  linkUrl: string; // Category name or URL
  title?: string;
  active: boolean;
}

export interface HeroBannerConfig {
  headline: string;
  subheadline: string;
  badgeText: string;
  buttonText: string;
  secondaryButtonText?: string;
  eyebrowText?: string;
  pillTagline?: string;
  bgImage: string;
  leftImage?: string;
  rightImage?: string;
  ctaLinkCategory: string; // 'All' or category name
  overlayOpacity?: number; // e.g. 0.75
}

export interface DisplayBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge?: string;
  buttonText: string;
  categoryLink: string;
  theme: 'rose' | 'amber' | 'emerald' | 'stone' | 'indigo' | 'dark';
  position: 'top' | 'middle' | 'bottom';
  active: boolean;
}

