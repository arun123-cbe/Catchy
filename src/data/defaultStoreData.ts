import { Product, Order, HeroSlide, HeroBannerConfig, DisplayBanner } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Lumifi Botanical Radiant Serum',
    tagline: 'Hydrating Vitamin C & Hyaluronic Acid Nectar',
    category: 'Beauty & Skincare',
    price: 1299,
    originalPrice: 1699,
    rating: 4.9,
    reviewCount: 324,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
    description: 'A transformative daily serum infused with 15% stabilized Vitamin C, botanical squalane, and triple-weight hyaluronic acid to illuminate dark spots and restore bouncy hydration.',
    benefits: ['Fades dark spots & hyperpigmentation', 'Provides 24-hour moisture lock', 'Shields skin against environmental stressors'],
    specialities: ['100% Organic', 'Dermatologist Tested', 'Cruelty Free', 'Paraben Free'],
    ingredients: ['Vitamin C (THD Ascorbate)', 'Sodium Hyaluronate', 'Rosehip Seed Oil', 'Ferulic Acid', 'Green Tea Extract'],
    howToUse: 'Apply 3-4 drops to cleansed face and neck every morning. Follow with moisturizer and sun protection.',
    stock: 42,
    reorderPoint: 15,
    sku: 'BEAUTY-RAD-001',
    isBestSeller: true,
    isOrganic: true,
    isSuperSaver: true,
    isMostlyBought: true,
    isCustomersFavorite: true,
    concernsHandled: ['Dullness', 'Dry Skin', 'Anti-Aging', 'Dark Spots']
  },
  {
    id: 'prod-2',
    name: 'ZenMind Ashwagandha & Mag Complex',
    tagline: 'Deep Rest, Stress Relief & Mood Balance',
    category: 'Health & Supplements',
    price: 899,
    originalPrice: 1199,
    rating: 4.8,
    reviewCount: 189,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
    description: 'Synergistic adaptogenic blend combining KSM-66 Organic Ashwagandha with Magnesium Glycinate and L-Theanine to calm an overactive mind and promote deep, restorative sleep.',
    benefits: ['Supports healthy cortisol levels', 'Promotes restful REM sleep without grogginess', 'Reduces muscle tension & daily stress'],
    specialities: ['100% Organic', 'KSM-66 Certified', 'Vegan Capsules', 'Ayurvedic Formula'],
    ingredients: ['KSM-66 Ashwagandha (600mg)', 'Magnesium Glycinate (300mg)', 'L-Theanine (200mg)', 'Chamomile Extract'],
    howToUse: 'Take 2 capsules daily 30-45 minutes before bedtime with warm water.',
    stock: 8,
    reorderPoint: 12,
    sku: 'HEALTH-ZEN-002',
    isBestSeller: true,
    isOrganic: true,
    isSuperSaver: false,
    isCustomersFavorite: true,
    concernsHandled: ['Sleep & Stress', 'Fatigue', 'Anxiety', 'Muscle Relaxation']
  },
  {
    id: 'prod-3',
    name: 'PureGlow Multi-Collagen Peptides',
    tagline: 'Grass-Fed Hydrolyzed Collagen Types I, II, III & V',
    category: 'Health & Supplements',
    price: 1899,
    originalPrice: 2499,
    rating: 4.9,
    reviewCount: 512,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
    description: 'Unflavored, unrefined hydrolyzed collagen powder enriched with biotin, silica, and vitamin C for radiant skin elasticity, stronger hair growth, and flexible joints.',
    benefits: ['Smooths fine lines and boosts skin elasticity', 'Strengthens brittle nails and thickens hair', 'Supports joint mobility and gut lining'],
    specialities: ['Grass-Fed Bio-Active', 'Non-GMO', 'Keto Friendly', 'Unflavored'],
    ingredients: ['Grass-Fed Bovine Collagen', 'Marine Collagen Peptides', 'Biotin (5000mcg)', 'Bamboo Silica'],
    howToUse: 'Mix 1 scoop daily into your morning coffee, smoothie, matcha, or oats.',
    stock: 65,
    reorderPoint: 20,
    sku: 'HEALTH-COL-003',
    isBestSeller: true,
    isNewArrival: false,
    isOrganic: false,
    isSuperSaver: true,
    isMostlyBought: true,
    concernsHandled: ['Anti-Aging', 'Hair Growth', 'Joint Health', 'Skin Elasticity']
  },
  {
    id: 'prod-4',
    name: 'AuraAroma Organic Essential Oil Diffuser',
    tagline: 'Ultrasonic Ceramic Aromatherapy Sanctum',
    category: 'Lifestyle & Wellness',
    price: 2499,
    originalPrice: 3299,
    rating: 4.7,
    reviewCount: 96,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
    description: 'Handcrafted matte ceramic mist diffuser featuring whisper-quiet ultrasonic technology, ambient ambient ambient light, and automatic shut-off to elevate your home atmosphere.',
    benefits: ['Purifies indoor air and maintains gentle humidity', 'Distributes pure essential oils up to 500 sq ft', 'Features warm LED illumination with timer settings'],
    specialities: ['Handcrafted Ceramic', 'BPA-Free', 'Whisper Quiet', 'Auto Shutoff'],
    ingredients: ['BPA-Free Ceramic Body', 'Ultrasonic Transducer', 'Solid Beechwood Base'],
    howToUse: 'Fill reservoir with 180ml water, add 5-8 drops of essential oil blend, select mist timer mode.',
    stock: 19,
    reorderPoint: 10,
    sku: 'LIFE-DIFF-004',
    isNewArrival: true,
    isOrganic: true,
    isSuperSaver: false,
    concernsHandled: ['Home Wellness', 'Sleep & Stress', 'Relaxation']
  },
  {
    id: 'prod-5',
    name: 'VelvetSilk Peptide Firming Eye Cream',
    tagline: 'Cooling Ceramic Tip Anti-Puffiness Treatment',
    category: 'Beauty & Skincare',
    price: 1199,
    originalPrice: 1499,
    rating: 4.8,
    reviewCount: 215,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800',
    description: 'Concentrated eye treatment packed with matrixyl peptides, caffeine, and niacinamide to instantly depuff morning eyes and diminish dark circles.',
    benefits: ['Instantly cools and visibly depuffs eye area', 'Reduces dark circles and crow’s feet', 'Intensifies eye contour firmness'],
    specialities: ['Cooling Ceramic Tip', 'Clinical Grade', 'Fragrance Free', 'Ophthalmologist Tested'],
    ingredients: ['Palmitoyl Tripeptide-5', 'Green Coffee Caffeine', 'Niacinamide (3%)', 'Ceramide NP'],
    howToUse: 'Gently glide cooling applicator around the orbital bone morning and evening.',
    stock: 28,
    reorderPoint: 10,
    sku: 'BEAUTY-EYE-005',
    isNewArrival: true,
    isSuperSaver: true,
    concernsHandled: ['Dark Spots', 'Anti-Aging', 'Dullness', 'Eye Puffiness']
  },
  {
    id: 'prod-6',
    name: 'FloraNourish Rosemary Hair Growth Elixir',
    tagline: 'Scalp Detox & Root Strengthening Oil',
    category: 'Hair & Body',
    price: 799,
    originalPrice: 999,
    rating: 4.9,
    reviewCount: 412,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
    description: 'Lightweight scalp treatment crafted with pure steam-distilled Rosemary leaf oil, Biotin, and Castor oil to nourish hair follicles and encourage dense growth.',
    benefits: ['Stimulates microcirculation at the roots', 'Reduces scalp flaking and dryness', 'Shields hair strands from breakage'],
    specialities: ['Cold Pressed Oils', '100% Organic', 'Sulphate Free', 'Silicon Free'],
    ingredients: ['Rosemary Essential Oil', 'Cold-Pressed Castor Oil', 'Peppermint Extract', 'Biotin', 'Jojoba Oil'],
    howToUse: 'Part hair into sections, apply 4-6 drops directly to scalp, massage gently for 5 minutes before washing.',
    stock: 5,
    reorderPoint: 15,
    sku: 'HAIR-ROSE-006',
    isBestSeller: true,
    isOrganic: true,
    isSuperSaver: true,
    concernsHandled: ['Hair Growth', 'Scalp Health', 'Dullness']
  },
  {
    id: 'prod-7',
    name: 'GutBiome Probiotic & Prebiotic Defense',
    tagline: '50 Billion CFU Multi-Strain Digestive Balance',
    category: 'Health & Supplements',
    price: 1099,
    originalPrice: 1399,
    rating: 4.8,
    reviewCount: 260,
    image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&q=80&w=800',
    description: 'Targeted shelf-stable probiotic formula featuring 12 clinically validated strains plus prebiotic chicory fiber to restore gut microbiome harmony and immunity.',
    benefits: ['Relieves bloating and digestive discomfort', 'Enhances nutrient absorption', 'Supports gut-brain axis & skin clarity'],
    specialities: ['Shelf Stable', 'Delayed Release Capsules', '12 Clinical Strains', 'Non-GMO'],
    ingredients: ['Lactobacillus acidophilus', 'Bifidobacterium lactis', 'Organic Inulin Prebiotic Fiber'],
    howToUse: 'Take 1 capsule daily with morning breakfast or smoothie.',
    stock: 33,
    reorderPoint: 12,
    sku: 'HEALTH-GUT-007',
    isSuperSaver: false,
    concernsHandled: ['Gut Health', 'Dullness', 'Immunity']
  },
  {
    id: 'prod-8',
    name: 'SatinGlow Whipped Shea & Matcha Body Butter',
    tagline: 'Velvety Deep Moisture & Antioxidant Nourishment',
    category: 'Hair & Body',
    price: 899,
    originalPrice: 1099,
    rating: 4.7,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1608248597309-170460f3815e?auto=format&fit=crop&q=80&w=800',
    description: 'Sumptuous cloud-like whipped body butter scented with organic green tea and jasmine blossom, melting instantly to soften rough skin and restore natural luminosity.',
    benefits: ['Provides 48-hour deep skin barrier repair', 'Non-greasy rapid absorption formula', 'Leaves delicate soothing matcha jasmine aroma'],
    specialities: ['100% Organic Shea', 'Uji Grade Matcha', 'Zero Synthetic Fragrance', 'Cruelty Free'],
    ingredients: ['Raw Ghanaian Shea Butter', 'Organic Uji Matcha Extract', 'Sweet Almond Oil', 'Vitamin E'],
    howToUse: 'Massage generously over damp skin after bath or shower.',
    stock: 50,
    reorderPoint: 15,
    sku: 'BODY-BUTTER-008',
    isOrganic: true,
    isSuperSaver: true,
    concernsHandled: ['Dry Skin', 'Relaxation']
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'AG-88291',
    createdAt: new Date().toISOString(),
    customer: {
      name: 'Ananya Sharma',
      email: 'ananya.sharma@example.com',
      phone: '+91 98765 43210',
      address: '42 Lotus Promenade, Indiranagar',
      city: 'Bengaluru',
      pincode: '560038'
    },
    items: [
      {
        productId: 'prod-1',
        productName: 'Lumifi Botanical Radiant Serum',
        productImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
        price: 1299,
        quantity: 1
      },
      {
        productId: 'prod-6',
        productName: 'FloraNourish Rosemary Hair Growth Elixir',
        productImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
        price: 799,
        quantity: 1
      }
    ],
    subtotal: 2098,
    discount: 200,
    shipping: 0,
    tax: 95,
    total: 1993,
    paymentMethod: 'UPI',
    paymentDetails: {
      upiId: 'ananya@okicici',
      upiRefNo: 'UPI908123772183',
      status: 'PAID'
    },
    status: 'Processing',
    trackingNumber: 'DEL-IND-90812'
  }
];

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-1',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1600',
    linkUrl: 'Beauty & Skincare',
    title: 'Radiant Skin Rituals',
    active: true
  },
  {
    id: 'hero-2',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1600',
    linkUrl: 'Hair & Body',
    title: 'Pure Bio-Active Formulations',
    active: true
  },
  {
    id: 'hero-3',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1600',
    linkUrl: 'Health & Supplements',
    title: 'Sun Protection & Daily Glow',
    active: true
  }
];

export const DEFAULT_HERO_BANNER: HeroBannerConfig = {
  headline: 'DISCOVER Healthy, Glowing Skin',
  subheadline: 'Premium Skincare for Every You',
  eyebrowText: 'RADIANT SKIN. EVERY DAY.',
  pillTagline: 'CLEAN INGREDIENTS • VISIBLE RESULTS • MADE FOR YOU',
  badgeText: 'Pure Bio-Active Health & Beauty Formulas',
  buttonText: 'SHOP NOW',
  secondaryButtonText: 'Take AI Skin Consultation',
  bgImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1600',
  leftImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1200',
  rightImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200',
  ctaLinkCategory: 'All',
  overlayOpacity: 0.75
};

export const DEFAULT_DISPLAY_BANNERS: DisplayBanner[] = [
  {
    id: 'banner-1',
    title: 'Monsoon Radiance & Scalp Elixir Trio',
    subtitle: 'Save 30% on our award-winning cold-pressed rosemary & bio-active tea tree serum.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200',
    badge: 'Seasonal Super Saver',
    buttonText: 'Shop Hair & Body',
    categoryLink: 'Hair & Body',
    theme: 'rose',
    position: 'top',
    active: true
  },
  {
    id: 'banner-2',
    title: 'Ancient Ayurvedic Immunity & Adaptogen Blends',
    subtitle: 'KSM-66 Ashwagandha & Bio-Enriched Holy Basil for deep mental balance and energy.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1200',
    badge: '100% Organic Certified',
    buttonText: 'Explore Health & Supplements',
    categoryLink: 'Health & Supplements',
    theme: 'emerald',
    position: 'middle',
    active: true
  },
  {
    id: 'banner-3',
    title: 'Luxury Pure Botanical Skincare Rituals',
    subtitle: 'Dermatologist tested Vitamin C serum and multi-peptide glow concentrates.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1200',
    badge: 'Bestseller Formula',
    buttonText: 'Shop Beauty & Skincare',
    categoryLink: 'Beauty & Skincare',
    theme: 'amber',
    position: 'bottom',
    active: true
  }
];

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

export const DEFAULT_CATEGORIES = [
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

export const DEFAULT_STORE_DATA = {
  products: INITIAL_PRODUCTS,
  categories: DEFAULT_CATEGORIES,
  categoryThumbnails: DEFAULT_CATEGORY_THUMBNAILS,
  heroSlides: DEFAULT_HERO_SLIDES,
  heroBannerConfig: DEFAULT_HERO_BANNER,
  homepageBanners: DEFAULT_DISPLAY_BANNERS,
  customLogoUrl: null,
  orders: INITIAL_ORDERS
};
