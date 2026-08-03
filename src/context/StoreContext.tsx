import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '../data/initialData';

interface StoreContextType {
  products: Product[];
  categories: string[];
  categoryThumbnails: Record<string, string>;
  addCategory: (catName: string, thumbnailUrl?: string) => void;
  deleteCategory: (catName: string) => void;
  updateCategoryThumbnail: (catName: string, url: string) => void;
  getCategoryThumbnail: (catName: string) => string;
  cart: CartItem[];
  orders: Order[];
  selectedCategory: string | 'All';
  setSelectedCategory: (cat: string | 'All') => void;
  selectedTagFilter: 'All' | 'Best Seller' | 'New Arrival' | 'Organic' | 'Super Saver';
  setSelectedTagFilter: (tag: 'All' | 'Best Seller' | 'New Arrival' | 'Organic' | 'Super Saver') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeView: 'store' | 'quiz' | 'admin';
  setActiveView: (view: 'store' | 'quiz' | 'admin') => void;
  adminSubTab: 'analytics' | 'inventory' | 'products' | 'categories' | 'orders';
  setAdminSubTab: (tab: 'analytics' | 'inventory' | 'products' | 'categories' | 'orders') => void;
  formatPrice: (amountInINR: number) => string;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Order Actions
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
  
  // Product & Inventory Actions (Admin)
  addProduct: (newProd: Omit<Product, 'id'>) => Product;
  bulkAddProducts: (newProds: Omit<Product, 'id'>[]) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateStock: (productId: string, newStock: number) => void;
  
  // Quick Concern Filter
  selectedConcern: string;
  setSelectedConcern: (concern: string) => void;

  // Custom Logo Upload
  customLogoUrl: string | null;
  setCustomLogoUrl: (url: string | null) => void;

  // Selected product for modal view
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (p: Product | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const DEFAULT_CATEGORY_THUMBNAILS: Record<string, string> = {
  'Beauty & Skincare': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800',
  'Health & Supplements': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
  'Lifestyle & Wellness': 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
  'Hair & Body': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
  'Organic Food & Teas': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800',
  'Fragrance & Aromatherapy': 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=800',
  'Baby & Mother Care': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=800',
  "Men's Grooming": 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&q=80&w=800',
  'Bath & Body Rituals': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
  'Immunity & Wellness Drinks': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
  'Ayurveda & Herbals': 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=800',
  'Fitness & Nutrition': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
};

const DEFAULT_CATEGORIES = [
  'Beauty & Skincare',
  'Health & Supplements',
  'Lifestyle & Wellness',
  'Hair & Body',
  'Organic Food & Teas',
  'Fragrance & Aromatherapy',
  'Baby & Mother Care',
  "Men's Grooming",
  'Bath & Body Rituals',
  'Immunity & Wellness Drinks',
  'Ayurveda & Herbals',
  'Fitness & Nutrition'
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage or defaults
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('auraglow_products_v2');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categoryThumbnails, setCategoryThumbnails] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('auraglow_category_thumbnails');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_CATEGORY_THUMBNAILS, ...parsed };
      } catch (e) {
        return DEFAULT_CATEGORY_THUMBNAILS;
      }
    }
    return DEFAULT_CATEGORY_THUMBNAILS;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('auraglow_categories');
    if (!saved) return DEFAULT_CATEGORIES;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Merge to guarantee at least default categories are available
        const merged = Array.from(new Set([...parsed, ...DEFAULT_CATEGORIES]));
        return merged;
      }
    } catch (e) {
      return DEFAULT_CATEGORIES;
    }
    return DEFAULT_CATEGORIES;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('auraglow_cart_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('auraglow_orders_v2');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string | 'All'>('All');
  const [selectedTagFilter, setSelectedTagFilter] = useState<'All' | 'Best Seller' | 'New Arrival' | 'Organic' | 'Super Saver'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConcern, setSelectedConcern] = useState('');
  const [activeView, setActiveView] = useState<'store' | 'quiz' | 'admin'>('store');
  const [adminSubTab, setAdminSubTab] = useState<'analytics' | 'inventory' | 'products' | 'categories' | 'orders'>('analytics');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(() => {
    return localStorage.getItem('catchystore_custom_logo') || null;
  });

  // Sync to LocalStorage
  useEffect(() => {
    if (customLogoUrl) {
      localStorage.setItem('catchystore_custom_logo', customLogoUrl);
    } else {
      localStorage.removeItem('catchystore_custom_logo');
    }
  }, [customLogoUrl]);
  useEffect(() => {
    localStorage.setItem('auraglow_products_v2', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('auraglow_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('auraglow_category_thumbnails', JSON.stringify(categoryThumbnails));
  }, [categoryThumbnails]);

  useEffect(() => {
    localStorage.setItem('auraglow_cart_v2', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('auraglow_orders_v2', JSON.stringify(orders));
  }, [orders]);

  const updateCategoryThumbnail = (catName: string, url: string) => {
    if (!catName) return;
    setCategoryThumbnails(prev => ({
      ...prev,
      [catName]: url
    }));
  };

  const getCategoryThumbnail = (catName: string): string => {
    if (categoryThumbnails[catName]) return categoryThumbnails[catName];
    if (DEFAULT_CATEGORY_THUMBNAILS[catName]) return DEFAULT_CATEGORY_THUMBNAILS[catName];
    const prodMatch = products.find(p => p.category === catName && p.image);
    if (prodMatch) return prodMatch.image;
    return 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800';
  };

  const addCategory = (catName: string, thumbnailUrl?: string) => {
    const trimmed = catName.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    setCategories(prev => [...prev, trimmed]);
    if (thumbnailUrl && thumbnailUrl.trim()) {
      updateCategoryThumbnail(trimmed, thumbnailUrl.trim());
    }
  };

  const deleteCategory = (catName: string) => {
    setCategories(prev => prev.filter(c => c !== catName));
  };

  const formatPrice = (amountInINR: number): string => {
    return `₹${Math.round(amountInINR).toLocaleString('en-IN')}`;
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity: qty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `AG-${randomNum}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString()
    };

    // Update orders list
    setOrders(prev => [newOrder, ...prev]);

    // Reduce inventory for ordered items
    setProducts(prevProds => prevProds.map(prod => {
      const orderedItem = orderData.items.find(i => i.productId === prod.id);
      if (orderedItem) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - orderedItem.quantity)
        };
      }
      return prod;
    }));

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          trackingNumber: trackingNumber || o.trackingNumber
        };
      }
      return o;
    }));
  };

  const addProduct = (newProd: Omit<Product, 'id'>): Product => {
    const created: Product = {
      ...newProd,
      id: `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
    setProducts(prev => [created, ...prev]);

    // Auto-add category if not existing
    if (newProd.category && !categories.includes(newProd.category)) {
      setCategories(prev => [...prev, newProd.category]);
    }

    return created;
  };

  const bulkAddProducts = (newProds: Omit<Product, 'id'>[]) => {
    const createdList: Product[] = newProds.map((np, idx) => ({
      ...np,
      id: `prod-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`
    }));
    setProducts(prev => [...createdList, ...prev]);

    // Collect and merge any new categories
    const newCats = Array.from(new Set(newProds.map(p => p.category).filter(Boolean)));
    setCategories(prev => Array.from(new Set([...prev, ...newCats])));
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const updateStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p));
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        categoryThumbnails,
        addCategory,
        deleteCategory,
        updateCategoryThumbnail,
        getCategoryThumbnail,
        cart,
        orders,
        selectedCategory,
        setSelectedCategory,
        selectedTagFilter,
        setSelectedTagFilter,
        searchQuery,
        setSearchQuery,
        activeView,
        setActiveView,
        adminSubTab,
        setAdminSubTab,
        formatPrice,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        placeOrder,
        updateOrderStatus,
        addProduct,
        bulkAddProducts,
        updateProduct,
        deleteProduct,
        updateStock,
        selectedConcern,
        setSelectedConcern,
        customLogoUrl,
        setCustomLogoUrl,
        selectedProductForModal,
        setSelectedProductForModal
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
