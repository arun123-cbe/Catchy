import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { CatchyStoreLogo } from './components/CatchyStoreLogo';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { PersonalizedQuizModal } from './components/PersonalizedQuizModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { CategoryPage } from './components/CategoryPage';
import { SubscriptionsManager } from './components/SubscriptionsManager';
import { AdminPortal } from './components/AdminPortal';
import { ProductCarousel } from './components/ProductCarousel';
import { Product, Order } from './types';
import { Sparkles, RefreshCw, ShieldCheck, Heart, ArrowRight, Star, Leaf, CheckCircle2, QrCode, Lock, Zap, Grid, ChevronDown, ChevronUp } from 'lucide-react';

const CATEGORY_THUMBNAILS: Record<string, string> = {
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

function StorefrontContent() {
  const {
    products,
    categories,
    getCategoryThumbnail,
    selectedCategory,
    setSelectedCategory,
    setSelectedTagFilter,
    searchQuery,
    selectedConcern,
    setSelectedConcern,
    activeView,
    setActiveView,
    selectedProductForModal,
    setSelectedProductForModal
  } = useStore();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Filter products by category, search query, and concern
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.ingredients && p.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesConcern = !selectedConcern || p.concernsHandled.includes(selectedConcern);

    return matchesCategory && matchesSearch && matchesConcern;
  });

  const concernsList = ['All', 'Dullness', 'Anti-Aging', 'Sleep & Stress', 'Hair Growth', 'Gut Health', 'Dry Skin'];

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      
      {/* Header */}
      <Header
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenTracking={() => {
          setTrackingOrderNumber('');
          setIsTrackingOpen(true);
        }}
      />

      <main className="flex-1 pb-16">
        
        {/* VIEW 1: STOREFRONT CATALOG OR DEDICATED CATEGORY PAGE */}
        {activeView === 'store' && (
          selectedCategory !== 'All' ? (
            <CategoryPage />
          ) : (
          <div className="space-y-10">
            
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-stone-900 via-stone-850 to-rose-950 text-white py-12 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-300 backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                    <span>Pure Bio-Active Health & Beauty Formulas</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif leading-tight tracking-tight text-white">
                    Radiance, Reimagined <br />
                    <span className="bg-gradient-to-r from-amber-200 via-rose-300 to-emerald-200 bg-clip-text text-transparent">
                      For Mind, Body & Glow
                    </span>
                  </h1>

                  <p className="text-xs sm:text-sm text-stone-300 max-w-lg leading-relaxed font-sans">
                    Clinical-grade adaptogens, clean organic skincare, and luxury wellness essentials. Fast doorstep delivery across India with secure UPI payment gateway.
                  </p>

                  {/* Hero Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => setIsQuizOpen(true)}
                      className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-bold hover:opacity-95 transition-all shadow-lg flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-amber-200" />
                      Take AI Skin & Wellness Quiz
                    </button>

                    <a
                      href="#catalog"
                      className="px-6 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white text-xs font-bold hover:bg-white/20 transition-all flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4 text-amber-400" />
                      Explore Best Sellers
                    </a>
                  </div>

                  {/* Trust Highlights */}
                  <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-stone-300 font-medium border-t border-stone-800">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Dermatologist Approved</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-amber-300" />
                      <span>UPI FastPay & Cards</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Leaf className="w-4 h-4 text-emerald-300" />
                      <span>100% Organic & Clean</span>
                    </div>
                  </div>
                </div>

                {/* Hero Visual Card */}
                <div className="relative flex justify-center">
                  <div className="relative w-full max-w-md aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border border-white/20 group">
                    <img
                      src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1000"
                      alt="AuraGlow Botanical Rituals"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent flex flex-col justify-end p-6">
                      <span className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-1">
                        Featured Ritual Set
                      </span>
                      <h3 className="text-lg font-bold text-white font-serif">
                        Lumifi Radiant Botanical Duo
                      </h3>
                      <p className="text-xs text-stone-300 line-clamp-1 mt-0.5">
                        Vitamin C Serum + Multi-Collagen Peptides
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* Featured Category Thumbnails Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif flex items-center gap-2">
                    <Grid className="w-5 h-5 text-amber-500" />
                    <span>Shop By Category</span>
                  </h2>
                  <p className="text-xs text-stone-500">Explore clean botanical & adaptogenic collections</p>
                </div>

                {selectedCategory !== 'All' && (
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      if (setSelectedTagFilter) setSelectedTagFilter('All');
                    }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 underline flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>View All Collections ({products.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Thumbnails Grid (Shows 6 categories initially, expandable to show all) */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(showAllCategories ? categories : categories.slice(0, 6)).map((catName) => {
                  const count = products.filter(p => p.category === catName).length;
                  const isSelected = selectedCategory === catName;
                  const thumbUrl = getCategoryThumbnail(catName);

                  return (
                    <div
                      key={catName}
                      onClick={() => {
                        setSelectedCategory(isSelected ? 'All' : catName);
                        if (setSelectedTagFilter) setSelectedTagFilter('All');
                        const catElem = document.getElementById('catalog');
                        if (catElem) catElem.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`group relative h-40 sm:h-48 rounded-3xl overflow-hidden cursor-pointer border transition-all duration-300 ${
                        isSelected
                          ? 'ring-4 ring-rose-500 border-rose-500 shadow-xl scale-[1.02]'
                          : 'border-stone-200/80 shadow-xs hover:shadow-lg hover:border-stone-300 hover:scale-[1.01]'
                      }`}
                    >
                      {/* Thumbnail Image */}
                      <img
                        src={thumbUrl}
                        alt={catName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* Dark Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t transition-opacity ${
                        isSelected
                          ? 'from-stone-950/95 via-rose-950/50 to-stone-900/30'
                          : 'from-stone-950/85 via-stone-950/35 to-transparent group-hover:from-stone-950/95'
                      }`} />

                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 animate-fade-in">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                        </div>
                      )}

                      {/* Bottom Label Box */}
                      <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end text-white space-y-1">
                        <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                          {count} {count === 1 ? 'Formula' : 'Formulas'}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold font-serif leading-snug group-hover:text-amber-200 transition-colors">
                          {catName}
                        </h3>
                        <div className="flex items-center text-[10px] font-bold text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity gap-1 pt-0.5">
                          <span>Browse Collection</span>
                          <ArrowRight className="w-3 h-3 text-amber-300" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Expand / Collapse Button (Shown when categories > 6) */}
              {categories.length > 6 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowAllCategories(!showAllCategories)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-md hover:shadow-xl border border-stone-800 group"
                  >
                    {showAllCategories ? (
                      <>
                        <span>Show Less Categories</span>
                        <ChevronUp className="w-4 h-4 text-amber-400 group-hover:-translate-y-0.5 transition-transform" />
                      </>
                    ) : (
                      <>
                        <span>More Categories (+{categories.length - 6} More)</span>
                        <ChevronDown className="w-4 h-4 text-amber-400 group-hover:translate-y-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </section>

            {/* DEFAULT HOMEPAGE SECTIONS (Shown when no specific filter is active) */}
            {selectedCategory === 'All' && !searchQuery && !selectedConcern && (
              <>
                {/* 1. NEW ARRIVALS SECTION */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                  <div className="bg-gradient-to-r from-purple-900/90 via-stone-900 to-rose-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-purple-800/40">
                    <div className="relative z-10 space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[11px] font-extrabold uppercase tracking-widest">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        Fresh Releases
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                        New Arrivals Collection
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
                        Discover our newest clinical-grade organic formulations and wellness rituals, freshly crafted for optimal efficacy.
                      </p>
                    </div>

                    <div className="relative z-10 shrink-0">
                      <span className="text-xs font-bold text-amber-300 bg-white/10 px-4 py-2 rounded-2xl border border-white/20 backdrop-blur-md inline-block">
                        ✨ 100% Authentic & Fresh Batches
                      </span>
                    </div>

                    {/* Subtle Background Glow Accent */}
                    <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
                  </div>

                  {/* New Arrivals Products Carousel (Max 9 items) */}
                  <div className="pt-2">
                    <ProductCarousel
                      products={
                        products.filter(p => p.isNewArrival).length > 0
                          ? products.filter(p => p.isNewArrival)
                          : products
                      }
                      onQuickView={(p) => setSelectedProductForModal(p)}
                      maxProducts={9}
                      title="New Arrivals Carousel"
                      subtitle="Swipe or scroll through our latest 9 botanical releases"
                    />
                  </div>
                </section>

                {/* 2. CATEGORY-BASED PRODUCT DISPLAY SECTIONS */}
                {categories.map((catName) => {
                  const catProducts = products.filter(p => p.category === catName);
                  if (catProducts.length === 0) return null;
                  const catThumb = getCategoryThumbnail(catName);

                  return (
                    <section key={`section-cat-${catName}`} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 pt-2">
                      {/* Category Showcase Header Bar */}
                      <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={catThumb}
                            alt={catName}
                            className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-stone-200 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h2 className="text-xl font-bold text-stone-900 font-serif">{catName}</h2>
                              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                {catProducts.length} {catProducts.length === 1 ? 'Item' : 'Items'}
                              </span>
                            </div>
                            <p className="text-xs text-stone-500 mt-0.5">
                              Top 9 formulas in {catName.toLowerCase()}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedCategory(catName);
                            if (setSelectedTagFilter) setSelectedTagFilter('All');
                            const catElem = document.getElementById('catalog');
                            if (catElem) catElem.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                        >
                          <span>Explore Full {catName}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                        </button>
                      </div>

                      {/* Products Carousel for this category (Max 9) */}
                      <ProductCarousel
                        products={catProducts}
                        onQuickView={(p) => setSelectedProductForModal(p)}
                        maxProducts={9}
                      />
                    </section>
                  );
                })}
              </>
            )}

            {/* Concern Filter Bar */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Filter by Targeted Benefit:
                  </span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar">
                  {concernsList.map(c => {
                    const active = (c === 'All' && !selectedConcern) || selectedConcern === c;
                    return (
                      <button
                        key={c}
                        onClick={() => setSelectedConcern(c === 'All' ? '' : c)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                          active
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Catalog Section Carousel */}
            <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
                  <Sparkles className="w-10 h-10 text-stone-300 mx-auto" />
                  <h3 className="text-base font-bold text-stone-800 font-serif">No matching formulas found</h3>
                  <p className="text-xs text-stone-500">Try adjusting your search terms or filters.</p>
                </div>
              ) : (
                <ProductCarousel
                  products={filteredProducts}
                  onQuickView={(p) => setSelectedProductForModal(p)}
                  maxProducts={9}
                  title={selectedCategory === 'All' ? 'Botanical Essentials Carousel' : `${selectedCategory} Carousel`}
                  subtitle={`Showing top 9 items out of ${filteredProducts.length} matching products`}
                />
              )}
            </section>

          </div>
          )
        )}

        {/* VIEW 2: MY SUBSCRIPTIONS */}
        {activeView === 'subscriptions' && <SubscriptionsManager />}

        {/* VIEW 3: ADMIN PORTAL */}
        {activeView === 'admin' && <AdminPortal />}

      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 text-xs border-t border-stone-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 bg-white/10 p-2 rounded-2xl w-fit">
              <CatchyStoreLogo size="sm" />
            </div>
            <p className="text-stone-400 leading-relaxed">
              CatchyStore - The Beauty Store. Pioneering clean organic health, beauty, and adaptogenic lifestyle products with fast doorstep delivery across India and instant UPI checkout.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-3">Guaranteed Security</h4>
            <ul className="space-y-2 text-stone-400">
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit SSL Encrypted</li>
              <li className="flex items-center gap-1.5"><QrCode className="w-3.5 h-3.5 text-amber-300" /> Instant UPI Gateways</li>
              <li className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-indigo-400" /> PCI-DSS Compliant</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-3">Shop Categories</h4>
            <ul className="space-y-1.5 text-stone-400">
              {categories.map((cat) => (
                <li key={`footer-cat-${cat}`}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat);
                      setActiveView('store');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-300 transition-colors text-xs font-medium"
                  >
                    • {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-3">Customer Support</h4>
            <p className="text-stone-400">
              Email: <span className="text-amber-300">gouthamarun123@gmail.com</span><br />
              Hours: Mon - Sat, 9:00 AM - 8:00 PM IST
            </p>
            <div className="mt-3">
              <button
                onClick={() => {
                  setTrackingOrderNumber('');
                  setIsTrackingOpen(true);
                }}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 underline flex items-center gap-1"
              >
                Track Your Order Live →
              </button>
            </div>
            <div className="mt-3 pt-3 border-t border-stone-800 text-[10px] text-stone-500">
              © {new Date().getFullYear()} CatchyStore - The Beauty Store. All rights reserved.
            </div>
          </div>

        </div>
      </footer>

      {/* MODALS */}

      {/* Product Detail Quick View Modal */}
      {selectedProductForModal && (
        <ProductDetailModal
          product={selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />

      {/* Checkout Gateway Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          onClose={() => setIsCheckoutOpen(false)}
          onOrderSuccess={(ord) => {
            setIsCheckoutOpen(false);
            setCompletedOrder(ord);
          }}
        />
      )}

      {/* Order Success Celebration Modal */}
      {completedOrder && (
        <OrderSuccessModal
          order={completedOrder}
          onClose={() => setCompletedOrder(null)}
          onNavigateToSubscriptions={() => setActiveView('subscriptions')}
          onTrackOrder={(ordNumber) => {
            setCompletedOrder(null);
            setTrackingOrderNumber(ordNumber);
            setIsTrackingOpen(true);
          }}
        />
      )}

      {/* AI Quiz Consultation Modal */}
      {isQuizOpen && (
        <PersonalizedQuizModal onClose={() => setIsQuizOpen(false)} />
      )}

      {/* Order Tracking Modal */}
      {isTrackingOpen && (
        <OrderTrackingModal
          isOpen={isTrackingOpen}
          initialOrderNumber={trackingOrderNumber}
          onClose={() => setIsTrackingOpen(false)}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <StorefrontContent />
    </StoreProvider>
  );
}
