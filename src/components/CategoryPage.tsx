import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ProductCarousel } from './ProductCarousel';
import { Product } from '../types';
import {
  ArrowLeft,
  Filter,
  CheckCircle2,
  Leaf,
  Flame,
  Tag,
  Star,
  ShieldCheck,
  Grid,
  Search,
  X,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  Zap,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';

const CATEGORY_META: Record<
  string,
  {
    heroImage: string;
    tagline: string;
    description: string;
    highlights: string[];
    accentColor: string;
  }
> = {
  'Beauty & Skincare': {
    heroImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1200',
    tagline: 'Clinical Grade Organic Radiance',
    description: 'Nourishing cold-pressed botanical facial oils, vitamin C elixirs, multi-peptide serums, and barrier renewal creams for clean, glowing skin.',
    highlights: ['Dermatologist Approved', '100% Cold-Pressed', 'Zero Paraben or Sulfate', 'Cruelty Free & Vegan'],
    accentColor: 'from-rose-500 to-amber-500',
  },
  'Health & Supplements': {
    heroImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1200',
    tagline: 'Bio-Active Adaptogens & Nootropics',
    description: 'High-potency Ayurvedic adaptogens, KSM-66 Ashwagandha, plant-based collagen builders, and sleep-enhancing herbal elixirs.',
    highlights: ['GMP Certified Facility', 'Clinical Grade Extract', 'Zero Synthetic Fillers', 'Non-GMO Verified'],
    accentColor: 'from-amber-500 to-emerald-600',
  },
  'Lifestyle & Wellness': {
    heroImage: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=1200',
    tagline: 'Mindful Daily Rituals & Aromatherapy',
    description: 'Pure essential oil blends, magnesium sleep mists, natural soy wax candles, and mindfulness wellness accessories.',
    highlights: ['100% Pure Essential Oils', 'Sustainably Sourced', 'Hand-poured Small Batches', 'Mindful Eco Packaging'],
    accentColor: 'from-purple-600 to-rose-500',
  },
  'Hair & Body': {
    heroImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200',
    tagline: 'Root Renewal & Botanical Scalp Care',
    description: 'Bio-active scalp therapy serums, rosemary tea tree tonics, deep nourishing body oils, and sulfate-free hair cleansers.',
    highlights: ['Strengthens Hair Roots', 'Reduces Scalp Stress', 'Silicone-Free Formula', 'Rich in Biotin & Botanicals'],
    accentColor: 'from-emerald-600 to-teal-500',
  },
};

export const CategoryPage: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedTagFilter,
    setSelectedTagFilter,
    setSelectedProductForModal,
    getCategoryThumbnail,
    formatPrice
  } = useStore();

  const [categorySearch, setCategorySearch] = useState('');
  const [selectedConcern, setSelectedConcern] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'stock'>('featured');

  // Metadata for current category
  const metaBase = CATEGORY_META[selectedCategory];
  const meta = {
    heroImage: metaBase?.heroImage || getCategoryThumbnail(selectedCategory),
    tagline: metaBase?.tagline || 'Pure & Authentic Botanical Formulas',
    description: metaBase?.description || `Browse our curated catalog of premium products in the ${selectedCategory} collection.`,
    highlights: metaBase?.highlights || ['100% Authentic Quality', 'Quality Tested', 'Free Express Shipping', 'Clean Ingredients'],
    accentColor: metaBase?.accentColor || 'from-rose-500 to-amber-500',
  };

  // All products belonging to this category
  const categoryProducts = useMemo(() => {
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  // Extract all unique concerns present in this category
  const categoryConcerns = useMemo(() => {
    const concerns = new Set<string>();
    categoryProducts.forEach((p) => {
      p.concernsHandled?.forEach((c) => concerns.add(c));
    });
    return ['All', ...Array.from(concerns)];
  }, [categoryProducts]);

  // Filtered and Sorted Products
  const processedProducts = useMemo(() => {
    return categoryProducts
      .filter((p) => {
        // Search
        const matchesSearch =
          !categorySearch.trim() ||
          p.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
          p.description.toLowerCase().includes(categorySearch.toLowerCase()) ||
          p.tagline.toLowerCase().includes(categorySearch.toLowerCase()) ||
          (p.ingredients && p.ingredients.some((i) => i.toLowerCase().includes(categorySearch.toLowerCase())));

        // Tag filter
        let matchesTag = true;
        if (selectedTagFilter === 'Best Seller') matchesTag = p.isBestSeller;
        else if (selectedTagFilter === 'New Arrival') matchesTag = p.isNewArrival;
        else if (selectedTagFilter === 'Organic') matchesTag = p.isOrganic;
        else if (selectedTagFilter === 'Super Saver') matchesTag = p.isSuperSaver;

        // Concern
        const matchesConcern = selectedConcern === 'All' || p.concernsHandled?.includes(selectedConcern);

        return matchesSearch && matchesTag && matchesConcern;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return (b.specialities?.length || 0) - (a.specialities?.length || 0);
        if (sortBy === 'stock') return b.stock - a.stock;
        return 0; // featured
      });
  }, [categoryProducts, categorySearch, selectedTagFilter, selectedConcern, sortBy]);

  const handleResetFilters = () => {
    setCategorySearch('');
    setSelectedConcern('All');
    setSelectedTagFilter('All');
    setSortBy('featured');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* 1. BREADCRUMB & SWITCH CATEGORY PILLS BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          
          {/* Breadcrumb & Back button */}
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium flex-wrap">
            <button
              onClick={() => setSelectedCategory('All')}
              className="hover:text-stone-900 transition-colors flex items-center gap-1 font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-xl border border-stone-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-400">Categories</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
              {selectedCategory}
            </span>
          </div>

          {/* Quick Switch Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            <span className="text-[10px] uppercase font-bold text-stone-400 shrink-0 mr-1">Switch View:</span>
            <button
              onClick={() => setSelectedCategory('All')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 shrink-0"
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={`pill-${cat}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  handleResetFilters();
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                  selectedCategory === cat
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 2. DEDICATED CATEGORY HERO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white shadow-xl border border-stone-800">
          
          {/* Background Image with Dark Gradient Mask */}
          <img
            src={meta.heroImage}
            alt={selectedCategory}
            className="absolute inset-0 w-full h-full object-cover opacity-35 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-transparent" />

          {/* Content Box */}
          <div className="relative z-10 p-6 sm:p-10 md:p-12 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{meta.tagline}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif leading-tight text-white">
              {selectedCategory}
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
              {meta.description}
            </p>

            {/* Category Highlights Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {meta.highlights.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 bg-stone-900/80 border border-stone-700/80 text-stone-200 text-[11px] font-semibold px-3 py-1 rounded-xl"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {item}
                </span>
              ))}
            </div>

            {/* Quick Stats Summary */}
            <div className="pt-4 border-t border-white/10 flex items-center gap-6 text-xs text-stone-300 font-medium">
              <div>
                <span className="text-[10px] text-stone-400 block uppercase font-bold">Total Formulas</span>
                <span className="text-base font-bold text-white font-mono">{categoryProducts.length} Products</span>
              </div>
              <div className="border-l border-white/10 pl-6">
                <span className="text-[10px] text-stone-400 block uppercase font-bold">Express Delivery</span>
                <span className="text-xs font-bold text-emerald-400">Doorstep Pan India</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. CATEGORY FILTERS & CONTROLS TOOLBAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Category Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder={`Search inside ${selectedCategory}...`}
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:bg-white transition-all"
              />
              {categorySearch && (
                <button
                  onClick={() => setCategorySearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Tag Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setSelectedTagFilter('All')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                  selectedTagFilter === 'All'
                    ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                    : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                }`}
              >
                All Items ({categoryProducts.length})
              </button>

              <button
                onClick={() => setSelectedTagFilter('Best Seller')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 border ${
                  selectedTagFilter === 'Best Seller'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'bg-stone-50 text-stone-700 hover:bg-amber-50 border-stone-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Best Sellers
              </button>

              <button
                onClick={() => setSelectedTagFilter('New Arrival')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 border ${
                  selectedTagFilter === 'New Arrival'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-stone-50 text-stone-700 hover:bg-purple-50 border-stone-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                New Arrivals
              </button>

              <button
                onClick={() => setSelectedTagFilter('Organic')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 border ${
                  selectedTagFilter === 'Organic'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-stone-50 text-stone-700 hover:bg-emerald-50 border-stone-200'
                }`}
              >
                <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                100% Organic
              </button>

              <button
                onClick={() => setSelectedTagFilter('Super Saver')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 border ${
                  selectedTagFilter === 'Super Saver'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-stone-50 text-stone-700 hover:bg-rose-50 border-stone-200'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-rose-500" />
                Super Savers
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              >
                <option value="featured">Featured Order</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Specialty Score</option>
                <option value="stock">In Stock Quantity</option>
              </select>
            </div>

          </div>

          {/* Target Concern Filter Pills (if concerns are present) */}
          {categoryConcerns.length > 1 && (
            <div className="pt-2 border-t border-stone-100 flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0">Filter By Concern:</span>
              {categoryConcerns.map((concern) => (
                <button
                  key={concern}
                  onClick={() => setSelectedConcern(concern)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
                    selectedConcern === concern
                      ? 'bg-stone-900 text-white font-bold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {concern}
                </button>
              ))}
            </div>
          )}

        </div>

      </section>

      {/* 4. PRODUCTS GRID FOR THIS CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Results Header Count */}
        <div className="flex items-center justify-between text-xs text-stone-500 px-1">
          <span className="font-bold text-stone-800">
            Showing <span className="text-rose-600 font-mono font-black">{processedProducts.length}</span> of {categoryProducts.length} products in {selectedCategory}
          </span>

          {(categorySearch || selectedTagFilter !== 'All' || selectedConcern !== 'All' || sortBy !== 'featured') && (
            <button
              onClick={handleResetFilters}
              className="text-stone-500 hover:text-rose-600 font-bold underline flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Product Carousel (Max 9 products) */}
        {processedProducts.length > 0 ? (
          <ProductCarousel
            products={processedProducts}
            onQuickView={(p) => setSelectedProductForModal(p)}
            maxProducts={9}
            title={`${selectedCategory} Carousel`}
            subtitle={`Displaying top 9 products in ${selectedCategory}`}
          />
        ) : (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3 max-w-md mx-auto shadow-xs">
            <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-900 font-serif">No products match your filter</h3>
            <p className="text-xs text-stone-500">
              Try adjusting your search terms or clearing selected tags for the {selectedCategory} category.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-2xl hover:bg-stone-800 transition-all shadow-sm inline-block"
            >
              Clear Category Filters
            </button>
          </div>
        )}

      </section>

      {/* 5. CATEGORY BENEFIT GUARANTEE FOOTER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-md grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          
          <div className="flex items-center sm:items-start gap-3">
            <div className="p-3 bg-white/10 rounded-2xl text-amber-300 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-100 uppercase tracking-wider">100% Fresh Batches</h4>
              <p className="text-[11px] text-stone-400 mt-0.5">Formulated with highest purity bio-active compounds.</p>
            </div>
          </div>

          <div className="flex items-center sm:items-start gap-3">
            <div className="p-3 bg-white/10 rounded-2xl text-emerald-400 shrink-0">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-100 uppercase tracking-wider">Sustainable & Ethical</h4>
              <p className="text-[11px] text-stone-400 mt-0.5">Cruelty-free, eco-friendly recyclable packaging.</p>
            </div>
          </div>

          <div className="flex items-center sm:items-start gap-3">
            <div className="p-3 bg-white/10 rounded-2xl text-rose-400 shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-100 uppercase tracking-wider">Fast Pan-India Delivery</h4>
              <p className="text-[11px] text-stone-400 mt-0.5">Free shipping on orders with live SMS tracking.</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
