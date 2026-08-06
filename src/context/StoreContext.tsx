import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderStatus, HeroBannerConfig, DisplayBanner, HeroSlide } from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  DEFAULT_HERO_SLIDES,
  DEFAULT_HERO_BANNER,
  DEFAULT_DISPLAY_BANNERS,
  DEFAULT_CATEGORY_THUMBNAILS,
  DEFAULT_CATEGORIES
} from '../data/defaultStoreData';
import { db } from '../lib/firebase';
import { doc, collection, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';

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
  adminSubTab: 'analytics' | 'inventory' | 'products' | 'categories' | 'orders' | 'banners';
  setAdminSubTab: (tab: 'analytics' | 'inventory' | 'products' | 'categories' | 'orders' | 'banners') => void;
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
  
  // Bulk Product Operations
  bulkUpdateProducts: (ids: string[], updates: Partial<Product>) => void;
  bulkDeleteProducts: (ids: string[]) => void;
  bulkUpdateCategoryForProducts: (ids: string[], categoryName: string) => void;

  // Hero Banner Slides (Uploaded Images & Links)
  heroSlides: HeroSlide[];
  addHeroSlide: (slide: Omit<HeroSlide, 'id'>) => HeroSlide;
  updateHeroSlide: (id: string, slideData: Partial<HeroSlide>) => void;
  deleteHeroSlide: (id: string) => void;
  toggleHeroSlide: (id: string) => void;

  // Homepage Hero Banner & Display Banners Config
  heroBannerConfig: HeroBannerConfig;
  updateHeroBannerConfig: (partialConfig: Partial<HeroBannerConfig>) => void;
  homepageBanners: DisplayBanner[];
  addHomepageBanner: (banner: Omit<DisplayBanner, 'id'>) => DisplayBanner;
  updateHomepageBanner: (id: string, bannerData: Partial<DisplayBanner>) => void;
  deleteHomepageBanner: (id: string) => void;
  toggleHomepageBanner: (id: string) => void;

  // Quick Concern Filter
  selectedConcern: string;
  setSelectedConcern: (concern: string) => void;

  // Custom Logo Upload
  customLogoUrl: string | null;
  setCustomLogoUrl: (url: string | null) => void;

  // Selected product for modal view
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (p: Product | null) => void;

  // Reset store data to preloaded initial state
  resetStoreData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage or defaults
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('auraglow_products_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PRODUCTS;
      } catch (e) {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
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
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('auraglow_orders_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : INITIAL_ORDERS;
      } catch (e) {
        return INITIAL_ORDERS;
      }
    }
    return INITIAL_ORDERS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string | 'All'>('All');
  const [selectedTagFilter, setSelectedTagFilter] = useState<'All' | 'Best Seller' | 'New Arrival' | 'Organic' | 'Super Saver'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConcern, setSelectedConcern] = useState('');
  const [activeView, setActiveView] = useState<'store' | 'quiz' | 'admin'>('store');
  const [adminSubTab, setAdminSubTab] = useState<'analytics' | 'inventory' | 'products' | 'categories' | 'orders' | 'banners'>('analytics');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  // Hero Banner Slides State
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    const saved = localStorage.getItem('auraglow_hero_slides');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_HERO_SLIDES;
      }
    }
    return DEFAULT_HERO_SLIDES;
  });

  // Sync Hero Slides to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('auraglow_hero_slides', JSON.stringify(heroSlides));
    } catch (e) {
      console.warn('Could not save hero slides to localStorage:', e);
    }
  }, [heroSlides]);

  const addHeroSlide = (slide: Omit<HeroSlide, 'id'>): HeroSlide => {
    const created: HeroSlide = {
      ...slide,
      id: `hero-${Date.now()}`
    };
    setHeroSlides(prev => [created, ...prev]);
    return created;
  };

  const updateHeroSlide = (id: string, slideData: Partial<HeroSlide>) => {
    setHeroSlides(prev => prev.map(s => (s.id === id ? { ...s, ...slideData } : s)));
  };

  const deleteHeroSlide = (id: string) => {
    setHeroSlides(prev => prev.filter(s => s.id !== id));
  };

  const toggleHeroSlide = (id: string) => {
    setHeroSlides(prev => prev.map(s => (s.id === id ? { ...s, active: !s.active } : s)));
  };

  // Hero Banner Config State
  const [heroBannerConfig, setHeroBannerConfig] = useState<HeroBannerConfig>(() => {
    const saved = localStorage.getItem('auraglow_hero_banner');
    if (saved) {
      try {
        return { ...DEFAULT_HERO_BANNER, ...JSON.parse(saved) };
      } catch (e) {
        return DEFAULT_HERO_BANNER;
      }
    }
    return DEFAULT_HERO_BANNER;
  });

  // Display Banners List State
  const [homepageBanners, setHomepageBanners] = useState<DisplayBanner[]>(() => {
    const saved = localStorage.getItem('auraglow_homepage_banners');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_DISPLAY_BANNERS;
      }
    }
    return DEFAULT_DISPLAY_BANNERS;
  });

  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(() => {
    return localStorage.getItem('catchystore_custom_logo') || null;
  });

  // Reference cache to track state signatures and prevent write loops or redundant syncs
  const lastSyncedRef = React.useRef<{
    heroSlides?: string;
    heroBannerConfig?: string;
    homepageBanners?: string;
    customLogoUrl?: string;
    products?: string;
    categories?: string;
    categoryThumbnails?: string;
    orders?: string;
  }>({});

  const lastLocalMutationTimeRef = React.useRef<number>(0);

  const firestoreQuotaExhaustedRef = React.useRef<boolean>(
    typeof sessionStorage !== 'undefined' && sessionStorage.getItem('fs_quota_exhausted') === 'true'
  );

  // Helper to push updated data to backend Express server & Firebase Firestore safely
  const pushToServer = (dataPayload: Record<string, any>) => {
    lastLocalMutationTimeRef.current = Date.now();

    // Immediately cache local state signatures so polling GET won't treat them as new server updates
    if (dataPayload.products !== undefined && Array.isArray(dataPayload.products)) {
      const serialized = JSON.stringify(dataPayload.products);
      lastSyncedRef.current.products = serialized;
      try { localStorage.setItem('auraglow_products_v2', serialized); } catch (_) {}
    }
    if (dataPayload.categories !== undefined && Array.isArray(dataPayload.categories)) {
      const serialized = JSON.stringify(dataPayload.categories);
      lastSyncedRef.current.categories = serialized;
      try { localStorage.setItem('auraglow_categories', serialized); } catch (_) {}
    }
    if (dataPayload.categoryThumbnails !== undefined && typeof dataPayload.categoryThumbnails === 'object') {
      const serialized = JSON.stringify(dataPayload.categoryThumbnails);
      lastSyncedRef.current.categoryThumbnails = serialized;
      try { localStorage.setItem('auraglow_category_thumbnails', serialized); } catch (_) {}
    }
    if (dataPayload.heroSlides !== undefined && Array.isArray(dataPayload.heroSlides)) {
      const serialized = JSON.stringify(dataPayload.heroSlides);
      lastSyncedRef.current.heroSlides = serialized;
      try { localStorage.setItem('auraglow_hero_slides', serialized); } catch (_) {}
    }
    if (dataPayload.heroBannerConfig !== undefined) {
      const serialized = JSON.stringify(dataPayload.heroBannerConfig);
      lastSyncedRef.current.heroBannerConfig = serialized;
      try { localStorage.setItem('auraglow_hero_banner', serialized); } catch (_) {}
    }
    if (dataPayload.homepageBanners !== undefined && Array.isArray(dataPayload.homepageBanners)) {
      const serialized = JSON.stringify(dataPayload.homepageBanners);
      lastSyncedRef.current.homepageBanners = serialized;
      try { localStorage.setItem('auraglow_homepage_banners', serialized); } catch (_) {}
    }
    if (dataPayload.customLogoUrl !== undefined) {
      lastSyncedRef.current.customLogoUrl = dataPayload.customLogoUrl || '';
      if (dataPayload.customLogoUrl) {
        try { localStorage.setItem('catchystore_custom_logo', dataPayload.customLogoUrl); } catch (_) {}
      } else {
        try { localStorage.removeItem('catchystore_custom_logo'); } catch (_) {}
      }
    }
    if (dataPayload.orders !== undefined && Array.isArray(dataPayload.orders)) {
      const serialized = JSON.stringify(dataPayload.orders);
      lastSyncedRef.current.orders = serialized;
      try { localStorage.setItem('auraglow_orders_v2', serialized); } catch (_) {}
    }

    // 1. Sync with Express backend server (disk storage, zero quota limits)
    fetch('/api/store-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataPayload)
    }).catch(err => console.warn('Server sync error:', err));

    // 2. Sync with Firebase Firestore cloud database if quota is not exhausted
    if (firestoreQuotaExhaustedRef.current) return;

    try {
      const handleFsErr = (err: any) => {
        if (err?.code === 'resource-exhausted' || err?.message?.includes('resource-exhausted') || err?.message?.includes('Quota limit exceeded')) {
          firestoreQuotaExhaustedRef.current = true;
          try { sessionStorage.setItem('fs_quota_exhausted', 'true'); } catch (_) {}
        }
      };

      if (dataPayload.products !== undefined && Array.isArray(dataPayload.products)) {
        const payloadStr = JSON.stringify({ products: dataPayload.products });
        if (payloadStr.length < 800000) {
          setDoc(doc(db, 'store', 'products'), { products: dataPayload.products }, { merge: true }).catch(handleFsErr);
        }
        dataPayload.products.forEach((p: Product) => {
          if (p && p.id) {
            setDoc(doc(db, 'v2_products', p.id), p, { merge: true }).catch(handleFsErr);
          }
        });
      }
      if (dataPayload.homepageBanners !== undefined || dataPayload.heroBannerConfig !== undefined || dataPayload.heroSlides !== undefined) {
        const bannerPayload: Record<string, any> = {};
        if (dataPayload.homepageBanners !== undefined) bannerPayload.homepageBanners = dataPayload.homepageBanners;
        if (dataPayload.heroBannerConfig !== undefined) bannerPayload.heroBannerConfig = dataPayload.heroBannerConfig;
        if (dataPayload.heroSlides !== undefined) bannerPayload.heroSlides = dataPayload.heroSlides;
        setDoc(doc(db, 'store', 'banners'), bannerPayload, { merge: true }).catch(handleFsErr);
      }
      if (dataPayload.categories !== undefined || dataPayload.categoryThumbnails !== undefined || dataPayload.customLogoUrl !== undefined) {
        const catPayload: Record<string, any> = {};
        if (dataPayload.categories !== undefined) catPayload.categories = dataPayload.categories;
        if (dataPayload.categoryThumbnails !== undefined) catPayload.categoryThumbnails = dataPayload.categoryThumbnails;
        if (dataPayload.customLogoUrl !== undefined) catPayload.customLogoUrl = dataPayload.customLogoUrl;
        setDoc(doc(db, 'store', 'categories'), catPayload, { merge: true }).catch(handleFsErr);
      }
      if (dataPayload.orders !== undefined) {
        setDoc(doc(db, 'store', 'orders'), { orders: dataPayload.orders }, { merge: true }).catch(handleFsErr);
      }
    } catch (e) {
      firestoreQuotaExhaustedRef.current = true;
      try { sessionStorage.setItem('fs_quota_exhausted', 'true'); } catch (_) {}
    }
  };

  // Firestore Real-Time Listeners for Cross-Device Instant Synchronization
  useEffect(() => {
    if (firestoreQuotaExhaustedRef.current) return;

    const unsubs: Array<() => void> = [];

    const handleSync = (data: any) => {
      if (!data || typeof data !== 'object') return;
      // Skip listener override if local mutation happened in the last 3.5 seconds
      if (Date.now() - lastLocalMutationTimeRef.current < 3500) return;

      if (Array.isArray(data.products) && data.products.length > 0) {
        const serialized = JSON.stringify(data.products);
        if (lastSyncedRef.current.products !== serialized) {
          lastSyncedRef.current.products = serialized;
          setProducts(data.products);
          try { localStorage.setItem('auraglow_products_v2', serialized); } catch (_) {}
        }
      }
      if (Array.isArray(data.categories) && data.categories.length > 0) {
        const serialized = JSON.stringify(data.categories);
        if (lastSyncedRef.current.categories !== serialized) {
          lastSyncedRef.current.categories = serialized;
          setCategories(data.categories);
          try { localStorage.setItem('auraglow_categories', serialized); } catch (_) {}
        }
      }
      if (data.categoryThumbnails && typeof data.categoryThumbnails === 'object') {
        const serialized = JSON.stringify(data.categoryThumbnails);
        if (lastSyncedRef.current.categoryThumbnails !== serialized) {
          lastSyncedRef.current.categoryThumbnails = serialized;
          setCategoryThumbnails(prev => ({ ...prev, ...data.categoryThumbnails }));
          try { localStorage.setItem('auraglow_category_thumbnails', serialized); } catch (_) {}
        }
      }
      if (Array.isArray(data.heroSlides) && data.heroSlides.length > 0) {
        const serialized = JSON.stringify(data.heroSlides);
        if (lastSyncedRef.current.heroSlides !== serialized) {
          lastSyncedRef.current.heroSlides = serialized;
          setHeroSlides(data.heroSlides);
          try { localStorage.setItem('auraglow_hero_slides', serialized); } catch (_) {}
        }
      }
      if (data.heroBannerConfig) {
        const serialized = JSON.stringify(data.heroBannerConfig);
        if (lastSyncedRef.current.heroBannerConfig !== serialized) {
          lastSyncedRef.current.heroBannerConfig = serialized;
          setHeroBannerConfig(prev => ({ ...prev, ...data.heroBannerConfig }));
          try { localStorage.setItem('auraglow_hero_banner', serialized); } catch (_) {}
        }
      }
      if (Array.isArray(data.homepageBanners) && data.homepageBanners.length > 0) {
        const serialized = JSON.stringify(data.homepageBanners);
        if (lastSyncedRef.current.homepageBanners !== serialized) {
          lastSyncedRef.current.homepageBanners = serialized;
          setHomepageBanners(data.homepageBanners);
          try { localStorage.setItem('auraglow_homepage_banners', serialized); } catch (_) {}
        }
      }
      if (data.customLogoUrl !== undefined && data.customLogoUrl !== lastSyncedRef.current.customLogoUrl) {
        lastSyncedRef.current.customLogoUrl = data.customLogoUrl || '';
        setCustomLogoUrl(data.customLogoUrl);
        if (data.customLogoUrl) {
          try { localStorage.setItem('catchystore_custom_logo', data.customLogoUrl); } catch (_) {}
        } else {
          try { localStorage.removeItem('catchystore_custom_logo'); } catch (_) {}
        }
      }
      if (Array.isArray(data.orders) && data.orders.length > 0) {
        const serialized = JSON.stringify(data.orders);
        if (lastSyncedRef.current.orders !== serialized) {
          lastSyncedRef.current.orders = serialized;
          setOrders(data.orders);
          try { localStorage.setItem('auraglow_orders_v2', serialized); } catch (_) {}
        }
      }
    };

    const handleFsSubErr = (err: any) => {
      if (err?.code === 'resource-exhausted' || err?.message?.includes('resource-exhausted') || err?.message?.includes('Quota limit exceeded')) {
        firestoreQuotaExhaustedRef.current = true;
        try { sessionStorage.setItem('fs_quota_exhausted', 'true'); } catch (_) {}
      }
    };

    try {
      unsubs.push(onSnapshot(doc(db, 'store', 'products'), (snap) => snap.exists() && handleSync(snap.data()), handleFsSubErr));
      unsubs.push(onSnapshot(collection(db, 'v2_products'), (snap) => {
        if (snap && !snap.empty) {
          if (Date.now() - lastLocalMutationTimeRef.current < 3500) return;
          const prodsFromColl = snap.docs.map(d => d.data() as Product);
          if (prodsFromColl.length > 0) {
            const serialized = JSON.stringify(prodsFromColl);
            if (lastSyncedRef.current.products !== serialized) {
              lastSyncedRef.current.products = serialized;
              setProducts(prodsFromColl);
              try { localStorage.setItem('auraglow_products_v2', serialized); } catch (_) {}
            }
          }
        }
      }, handleFsSubErr));
      unsubs.push(onSnapshot(doc(db, 'store', 'banners'), (snap) => snap.exists() && handleSync(snap.data()), handleFsSubErr));
      unsubs.push(onSnapshot(doc(db, 'store', 'categories'), (snap) => snap.exists() && handleSync(snap.data()), handleFsSubErr));
      unsubs.push(onSnapshot(doc(db, 'store', 'orders'), (snap) => snap.exists() && handleSync(snap.data()), handleFsSubErr));
    } catch (err) {
      // Ignore listener setup error if quota reached
    }

    return () => {
      unsubs.forEach(u => u());
    };
  }, []);

  const fetchServerStoreData = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/store-data?_t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      if (!res.ok) return;
      const data = await res.json();
      
      // If a local mutation was performed recently (within 3.5s) and server data is older, skip to prevent race conditions
      const isRecentLocalMutation = Date.now() - lastLocalMutationTimeRef.current < 3500;
      if (isRecentLocalMutation && data._updatedAt && data._updatedAt < lastLocalMutationTimeRef.current) {
        return;
      }

      if (data && typeof data === 'object') {
        if (Array.isArray(data.products) && data.products.length > 0) {
          const serialized = JSON.stringify(data.products);
          if (lastSyncedRef.current.products !== serialized) {
            lastSyncedRef.current.products = serialized;
            setProducts(data.products);
            try { localStorage.setItem('auraglow_products_v2', serialized); } catch (_) {}
          }
        }
        if (Array.isArray(data.categories) && data.categories.length > 0) {
          const serialized = JSON.stringify(data.categories);
          if (lastSyncedRef.current.categories !== serialized) {
            lastSyncedRef.current.categories = serialized;
            setCategories(data.categories);
            try { localStorage.setItem('auraglow_categories', serialized); } catch (_) {}
          }
        }
        if (data.categoryThumbnails && typeof data.categoryThumbnails === 'object') {
          const serialized = JSON.stringify(data.categoryThumbnails);
          if (lastSyncedRef.current.categoryThumbnails !== serialized) {
            lastSyncedRef.current.categoryThumbnails = serialized;
            setCategoryThumbnails(prev => ({ ...prev, ...data.categoryThumbnails }));
            try { localStorage.setItem('auraglow_category_thumbnails', serialized); } catch (_) {}
          }
        }
        if (Array.isArray(data.heroSlides) && data.heroSlides.length > 0) {
          const serialized = JSON.stringify(data.heroSlides);
          if (lastSyncedRef.current.heroSlides !== serialized) {
            lastSyncedRef.current.heroSlides = serialized;
            setHeroSlides(data.heroSlides);
            try { localStorage.setItem('auraglow_hero_slides', serialized); } catch (_) {}
          }
        }
        if (data.heroBannerConfig) {
          const serialized = JSON.stringify(data.heroBannerConfig);
          if (lastSyncedRef.current.heroBannerConfig !== serialized) {
            lastSyncedRef.current.heroBannerConfig = serialized;
            setHeroBannerConfig(prev => ({ ...prev, ...data.heroBannerConfig }));
            try { localStorage.setItem('auraglow_hero_banner', serialized); } catch (_) {}
          }
        }
        if (Array.isArray(data.homepageBanners) && data.homepageBanners.length > 0) {
          const serialized = JSON.stringify(data.homepageBanners);
          if (lastSyncedRef.current.homepageBanners !== serialized) {
            lastSyncedRef.current.homepageBanners = serialized;
            setHomepageBanners(data.homepageBanners);
            try { localStorage.setItem('auraglow_homepage_banners', serialized); } catch (_) {}
          }
        }
        if (data.customLogoUrl !== undefined && data.customLogoUrl !== lastSyncedRef.current.customLogoUrl) {
          lastSyncedRef.current.customLogoUrl = data.customLogoUrl || '';
          setCustomLogoUrl(data.customLogoUrl);
          if (data.customLogoUrl) {
            try { localStorage.setItem('catchystore_custom_logo', data.customLogoUrl); } catch (_) {}
          } else {
            try { localStorage.removeItem('catchystore_custom_logo'); } catch (_) {}
          }
        }
        if (Array.isArray(data.orders) && data.orders.length > 0) {
          const serialized = JSON.stringify(data.orders);
          if (lastSyncedRef.current.orders !== serialized) {
            lastSyncedRef.current.orders = serialized;
            setOrders(data.orders);
            try { localStorage.setItem('auraglow_orders_v2', serialized); } catch (_) {}
          }
        }
      }
    } catch (e) {
      console.warn('Could not fetch store data from backend API:', e);
    }
  }, []);

  useEffect(() => {
    fetchServerStoreData();

    // Re-fetch when switching back to tab or window focus
    const handleSyncTrigger = () => fetchServerStoreData();
    window.addEventListener('focus', handleSyncTrigger);
    window.addEventListener('visibilitychange', handleSyncTrigger);

    // Fast polling interval every 2 seconds for instant cross-device updates
    const pollInterval = setInterval(() => {
      fetchServerStoreData();
    }, 2000);

    return () => {
      window.removeEventListener('focus', handleSyncTrigger);
      window.removeEventListener('visibilitychange', handleSyncTrigger);
      clearInterval(pollInterval);
    };
  }, [fetchServerStoreData]);

  // Sync Hero Slides to LocalStorage & Server on USER mutation only
  useEffect(() => {
    try {
      const serialized = JSON.stringify(heroSlides);
      if (lastSyncedRef.current.heroSlides === undefined) {
        lastSyncedRef.current.heroSlides = serialized;
      } else if (lastSyncedRef.current.heroSlides !== serialized) {
        lastSyncedRef.current.heroSlides = serialized;
        localStorage.setItem('auraglow_hero_slides', serialized);
        pushToServer({ heroSlides });
      }
    } catch (e) {
      console.warn('Could not save hero slides:', e);
    }
  }, [heroSlides]);

  // Sync Hero Banner to LocalStorage & Server on USER mutation only
  useEffect(() => {
    try {
      const serialized = JSON.stringify(heroBannerConfig);
      if (lastSyncedRef.current.heroBannerConfig === undefined) {
        lastSyncedRef.current.heroBannerConfig = serialized;
      } else if (lastSyncedRef.current.heroBannerConfig !== serialized) {
        lastSyncedRef.current.heroBannerConfig = serialized;
        localStorage.setItem('auraglow_hero_banner', serialized);
        pushToServer({ heroBannerConfig });
      }
    } catch (e) {
      console.warn('Could not save hero banner:', e);
    }
  }, [heroBannerConfig]);

  // Sync Display Banners to LocalStorage & Server on USER mutation only
  useEffect(() => {
    try {
      const serialized = JSON.stringify(homepageBanners);
      if (lastSyncedRef.current.homepageBanners === undefined) {
        lastSyncedRef.current.homepageBanners = serialized;
      } else if (lastSyncedRef.current.homepageBanners !== serialized) {
        lastSyncedRef.current.homepageBanners = serialized;
        localStorage.setItem('auraglow_homepage_banners', serialized);
        pushToServer({ homepageBanners });
      }
    } catch (e) {
      console.warn('Could not save homepage banners:', e);
    }
  }, [homepageBanners]);

  // Sync Custom Logo to LocalStorage & Server on USER mutation only
  useEffect(() => {
    try {
      const val = customLogoUrl || '';
      if (lastSyncedRef.current.customLogoUrl === undefined) {
        lastSyncedRef.current.customLogoUrl = val;
      } else if (lastSyncedRef.current.customLogoUrl !== val) {
        lastSyncedRef.current.customLogoUrl = val;
        if (customLogoUrl) {
          localStorage.setItem('catchystore_custom_logo', customLogoUrl);
        } else {
          localStorage.removeItem('catchystore_custom_logo');
        }
        pushToServer({ customLogoUrl });
      }
    } catch (e) {
      console.warn('Could not save custom logo:', e);
    }
  }, [customLogoUrl]);

  // Sync Products to LocalStorage & Server on USER mutation only
  useEffect(() => {
    try {
      const serialized = JSON.stringify(products);
      if (lastSyncedRef.current.products === undefined) {
        lastSyncedRef.current.products = serialized;
      } else if (lastSyncedRef.current.products !== serialized) {
        lastSyncedRef.current.products = serialized;
        try {
          localStorage.setItem('auraglow_products_v2', serialized);
        } catch (lsErr) {
          console.warn('Could not save products to localStorage:', lsErr);
        }
        pushToServer({ products });
      }
    } catch (e) {
      console.warn('Could not save products:', e);
    }
  }, [products]);

  // Sync Categories to LocalStorage & Server on USER mutation only
  useEffect(() => {
    try {
      const serialized = JSON.stringify(categories);
      if (lastSyncedRef.current.categories === undefined) {
        lastSyncedRef.current.categories = serialized;
      } else if (lastSyncedRef.current.categories !== serialized) {
        lastSyncedRef.current.categories = serialized;
        localStorage.setItem('auraglow_categories', serialized);
        pushToServer({ categories });
      }
    } catch (e) {
      console.warn('Could not save categories:', e);
    }
  }, [categories]);

  // Sync Category Thumbnails to LocalStorage & Server on USER mutation only
  useEffect(() => {
    try {
      const serialized = JSON.stringify(categoryThumbnails);
      if (lastSyncedRef.current.categoryThumbnails === undefined) {
        lastSyncedRef.current.categoryThumbnails = serialized;
      } else if (lastSyncedRef.current.categoryThumbnails !== serialized) {
        lastSyncedRef.current.categoryThumbnails = serialized;
        localStorage.setItem('auraglow_category_thumbnails', serialized);
        pushToServer({ categoryThumbnails });
      }
    } catch (e) {
      console.warn('Could not save category thumbnails:', e);
    }
  }, [categoryThumbnails]);

  useEffect(() => {
    try {
      localStorage.setItem('auraglow_cart_v2', JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart:', e);
    }
  }, [cart]);

  // Sync Orders to LocalStorage & Server
  useEffect(() => {
    try {
      const serialized = JSON.stringify(orders);
      if (lastSyncedRef.current.orders === undefined) {
        lastSyncedRef.current.orders = serialized;
      } else if (lastSyncedRef.current.orders !== serialized) {
        lastSyncedRef.current.orders = serialized;
        localStorage.setItem('auraglow_orders_v2', serialized);
        pushToServer({ orders });
      }
    } catch (e) {
      console.warn('Could not save orders:', e);
    }
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
    const nextProducts = [created, ...products];
    setProducts(nextProducts);

    // Auto-add category if not existing
    if (newProd.category && !categories.includes(newProd.category)) {
      setCategories(prev => [...prev, newProd.category]);
    }

    // Direct instant server sync
    pushToServer({ products: nextProducts });

    return created;
  };

  const bulkAddProducts = (newProds: Omit<Product, 'id'>[]) => {
    const createdList: Product[] = newProds.map((np, idx) => ({
      ...np,
      id: `prod-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`
    }));
    const nextProducts = [...createdList, ...products];
    setProducts(nextProducts);

    // Collect and merge any new categories
    const newCats = Array.from(new Set(newProds.map(p => p.category).filter(Boolean)));
    setCategories(prev => Array.from(new Set([...prev, ...newCats])));

    // Direct instant server sync
    pushToServer({ products: nextProducts });
  };

  const updateProduct = (updated: Product) => {
    const nextProducts = products.map(p => p.id === updated.id ? updated : p);
    setProducts(nextProducts);
    pushToServer({ products: nextProducts });
  };

  const deleteProduct = (productId: string) => {
    const nextProducts = products.filter(p => p.id !== productId);
    setProducts(nextProducts);
    deleteDoc(doc(db, 'v2_products', productId)).catch(() => {});
    pushToServer({ products: nextProducts });
  };

  const updateStock = (productId: string, newStock: number) => {
    const nextProducts = products.map(p => p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p);
    setProducts(nextProducts);
    pushToServer({ products: nextProducts });
  };

  // Bulk Product Operations
  const bulkUpdateProducts = (ids: string[], updates: Partial<Product>) => {
    if (!ids || ids.length === 0) return;
    const nextProducts = products.map(p => (ids.includes(p.id) ? { ...p, ...updates } : p));
    setProducts(nextProducts);
    pushToServer({ products: nextProducts });
  };

  const bulkDeleteProducts = (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    const nextProducts = products.filter(p => !ids.includes(p.id));
    setProducts(nextProducts);
    ids.forEach(id => {
      deleteDoc(doc(db, 'v2_products', id)).catch(() => {});
    });
    pushToServer({ products: nextProducts });
  };

  const bulkUpdateCategoryForProducts = (ids: string[], categoryName: string) => {
    if (!ids || ids.length === 0 || !categoryName) return;
    // Ensure category exists
    if (!categories.includes(categoryName)) {
      setCategories(prev => [...prev, categoryName]);
    }
    const nextProducts = products.map(p => (ids.includes(p.id) ? { ...p, category: categoryName } : p));
    setProducts(nextProducts);
    pushToServer({ products: nextProducts });
  };

  // Banner Actions
  const updateHeroBannerConfig = (partialConfig: Partial<HeroBannerConfig>) => {
    setHeroBannerConfig(prev => ({ ...prev, ...partialConfig }));
  };

  const addHomepageBanner = (bannerData: Omit<DisplayBanner, 'id'>): DisplayBanner => {
    const created: DisplayBanner = {
      ...bannerData,
      id: `banner-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
    setHomepageBanners(prev => [...prev, created]);
    return created;
  };

  const updateHomepageBanner = (id: string, bannerData: Partial<DisplayBanner>) => {
    setHomepageBanners(prev =>
      prev.map(b => (b.id === id ? { ...b, ...bannerData } : b))
    );
  };

  const deleteHomepageBanner = (id: string) => {
    setHomepageBanners(prev => prev.filter(b => b.id !== id));
  };

  const toggleHomepageBanner = (id: string) => {
    setHomepageBanners(prev =>
      prev.map(b => (b.id === id ? { ...b, active: !b.active } : b))
    );
  };

  const resetStoreData = React.useCallback(async () => {
    try {
      localStorage.removeItem('auraglow_products_v2');
      localStorage.removeItem('auraglow_categories');
      localStorage.removeItem('auraglow_category_thumbnails');
      localStorage.removeItem('auraglow_hero_slides');
      localStorage.removeItem('auraglow_hero_banner');
      localStorage.removeItem('auraglow_homepage_banners');
      localStorage.removeItem('catchystore_custom_logo');
      localStorage.removeItem('auraglow_orders_v2');
      localStorage.removeItem('auraglow_cart_v2');

      setProducts(INITIAL_PRODUCTS);
      setCategories(DEFAULT_CATEGORIES);
      setCategoryThumbnails(DEFAULT_CATEGORY_THUMBNAILS);
      setHeroSlides(DEFAULT_HERO_SLIDES);
      setHeroBannerConfig(DEFAULT_HERO_BANNER);
      setHomepageBanners(DEFAULT_DISPLAY_BANNERS);
      setCustomLogoUrl(null);
      setOrders(INITIAL_ORDERS);
      setCart([]);

      lastSyncedRef.current = {
        products: JSON.stringify(INITIAL_PRODUCTS),
        categories: JSON.stringify(DEFAULT_CATEGORIES),
        categoryThumbnails: JSON.stringify(DEFAULT_CATEGORY_THUMBNAILS),
        heroSlides: JSON.stringify(DEFAULT_HERO_SLIDES),
        heroBannerConfig: JSON.stringify(DEFAULT_HERO_BANNER),
        homepageBanners: JSON.stringify(DEFAULT_DISPLAY_BANNERS),
        customLogoUrl: '',
        orders: JSON.stringify(INITIAL_ORDERS)
      };

      await fetch('/api/store-data/reset', { method: 'POST' });

      if (db) {
        try {
          const docRef = doc(db, 'store', 'currentData');
          await setDoc(docRef, {
            products: INITIAL_PRODUCTS,
            categories: DEFAULT_CATEGORIES,
            categoryThumbnails: DEFAULT_CATEGORY_THUMBNAILS,
            heroSlides: DEFAULT_HERO_SLIDES,
            heroBannerConfig: DEFAULT_HERO_BANNER,
            homepageBanners: DEFAULT_DISPLAY_BANNERS,
            customLogoUrl: null,
            orders: INITIAL_ORDERS,
            updatedAt: new Date().toISOString()
          });
        } catch (e) {
          console.warn('Firestore reset optional sync error:', e);
        }
      }
    } catch (err) {
      console.error('Error resetting store data:', err);
    }
  }, []);

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
        bulkUpdateProducts,
        bulkDeleteProducts,
        bulkUpdateCategoryForProducts,
        heroSlides,
        addHeroSlide,
        updateHeroSlide,
        deleteHeroSlide,
        toggleHeroSlide,
        heroBannerConfig,
        updateHeroBannerConfig,
        homepageBanners,
        addHomepageBanner,
        updateHomepageBanner,
        deleteHomepageBanner,
        toggleHomepageBanner,
        selectedConcern,
        setSelectedConcern,
        customLogoUrl,
        setCustomLogoUrl,
        selectedProductForModal,
        setSelectedProductForModal,
        resetStoreData
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
