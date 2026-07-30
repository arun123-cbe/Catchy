import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Search, LayoutDashboard, Leaf, Tag, Flame, Compass, Menu as MenuIcon, X, ChevronDown, Grid, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CatchyStoreLogo } from './CatchyStoreLogo';

export const Header: React.FC<{ onOpenQuiz: () => void; onOpenTracking?: () => void }> = ({ onOpenQuiz, onOpenTracking }) => {
  const {
    categories,
    cart,
    setIsCartOpen,
    selectedCategory,
    setSelectedCategory,
    selectedTagFilter,
    setSelectedTagFilter,
    searchQuery,
    setSearchQuery,
    activeView,
    setActiveView,
    products
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Calculate low stock alert count
  const lowStockCount = products.filter(p => p.stock <= p.reorderPoint).length;

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedTagFilter('All');
    setIsCategoryDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setActiveView('store');
  };

  const handleSelectTag = (tag: 'All' | 'Best Seller' | 'New Arrival' | 'Organic' | 'Super Saver') => {
    setSelectedTagFilter(tag);
    setIsCategoryDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setActiveView('store');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs transition-all">
      {/* Top Banner Notice */}
      <div className="bg-stone-900 text-stone-100 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>CatchyStore • Pure Bio-Active Health, Beauty & Lifestyle Formulas • Free Express Shipping!</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-stone-100 text-stone-800 hover:bg-stone-200 transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>

          {/* Logo & Identity */}
          <div className="flex items-center cursor-pointer" onClick={() => setActiveView('store')}>
            <CatchyStoreLogo size="md" />
          </div>

          {/* Desktop Search Bar */}
          <div className="flex-1 max-w-sm hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search beauty formulas, skincare, ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-100/80 border border-stone-200 rounded-full pl-9 pr-4 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Actions: Cart, Track Order, Quiz & Admin Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Track Order Button */}
            {onOpenTracking && (
              <button
                onClick={onOpenTracking}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full bg-stone-100 text-stone-800 hover:bg-stone-200 transition-all text-xs font-bold border border-stone-200"
                title="Track Live Order"
              >
                <Truck className="w-3.5 h-3.5 text-rose-500" />
                <span>Track Order</span>
              </button>
            )}

            {/* AI Quiz Button (Desktop) */}
            <button
              onClick={onOpenQuiz}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-bold shadow-xs hover:opacity-90 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Quiz</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-stone-100 text-stone-800 hover:bg-stone-200 transition-colors flex items-center justify-center"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Admin Portal Toggle Switch Button */}
            <button
              onClick={() => setActiveView(activeView === 'admin' ? 'store' : 'admin')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border shadow-xs ${
                activeView === 'admin'
                  ? 'bg-stone-900 text-amber-300 border-stone-800 ring-2 ring-amber-400/30'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">
                {activeView === 'admin' ? 'Back to Store' : 'Admin Portal'}
              </span>
              {lowStockCount > 0 && activeView !== 'admin' && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" title={`${lowStockCount} low stock alerts`} />
              )}
            </button>

          </div>
        </div>

        {/* Clean Homepage Category Menu Bar (Desktop) */}
        {activeView === 'store' && (
          <nav className="hidden lg:flex items-center justify-between py-2 border-t border-stone-100 text-xs font-medium text-stone-700">
            <div className="flex items-center gap-1">
              
              {/* All Categories Dropdown Button */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="px-3.5 py-1.5 rounded-lg bg-stone-900 text-white font-bold flex items-center gap-1.5 hover:bg-stone-800 transition-colors"
                >
                  <Grid className="w-3.5 h-3.5 text-amber-300" />
                  <span>All Categories</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-300" />
                </button>

                {/* Dropdown Menu */}
                {isCategoryDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-fade-in space-y-1">
                    <button
                      onClick={() => handleSelectCategory('All')}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                        selectedCategory === 'All' ? 'bg-stone-100 text-stone-900' : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      Shop All Collections
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleSelectCategory(cat)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors ${
                          selectedCategory === cat ? 'bg-rose-50 text-rose-900 font-bold' : 'text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Direct Category Links */}
              {categories.slice(0, 4).map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleSelectCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedCategory === cat && selectedTagFilter === 'All'
                      ? 'bg-rose-50 text-rose-900 font-bold border border-rose-200'
                      : 'hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Quick Special Collections / Badges Menu Links */}
            <div className="flex items-center gap-1 text-[11px]">
              <button
                onClick={() => handleSelectTag('Best Seller')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                  selectedTagFilter === 'Best Seller'
                    ? 'bg-amber-100 text-amber-900 font-bold'
                    : 'text-stone-600 hover:bg-amber-50 hover:text-amber-800'
                }`}
              >
                <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                Best Sellers
              </button>

              <button
                onClick={() => handleSelectTag('New Arrival')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                  selectedTagFilter === 'New Arrival'
                    ? 'bg-purple-100 text-purple-900 font-bold'
                    : 'text-stone-600 hover:bg-purple-50 hover:text-purple-800'
                }`}
              >
                <Sparkles className="w-3 h-3 text-purple-500" />
                New Arrivals
              </button>

              <button
                onClick={() => handleSelectTag('Organic')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                  selectedTagFilter === 'Organic'
                    ? 'bg-emerald-100 text-emerald-900 font-bold'
                    : 'text-stone-600 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                <Leaf className="w-3 h-3 text-emerald-600" />
                100% Organic
              </button>

              <button
                onClick={() => handleSelectTag('Super Saver')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                  selectedTagFilter === 'Super Saver'
                    ? 'bg-rose-100 text-rose-900 font-bold'
                    : 'text-stone-600 hover:bg-rose-50 hover:text-rose-800'
                }`}
              >
                <Tag className="w-3 h-3 text-rose-500" />
                Super Savers
              </button>
            </div>
          </nav>
        )}

      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 p-4 space-y-4 animate-fade-in shadow-lg">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-100 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-800"
            />
          </div>

          {/* Mobile Menu Categories */}
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Shop Categories</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSelectCategory('All')}
                className={`p-2.5 rounded-xl text-xs font-bold text-left border ${
                  selectedCategory === 'All' ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 border-stone-200 text-stone-800'
                }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleSelectCategory(cat)}
                  className={`p-2.5 rounded-xl text-xs font-medium text-left border ${
                    selectedCategory === cat ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold' : 'bg-stone-50 border-stone-200 text-stone-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Menu Special Tags */}
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Special Collections</span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => handleSelectTag('Best Seller')}
                className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 font-bold border border-amber-200 flex items-center gap-1"
              >
                <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" /> Best Sellers
              </button>
              <button
                onClick={() => handleSelectTag('New Arrival')}
                className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-900 font-bold border border-purple-200 flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" /> New Arrivals
              </button>
              <button
                onClick={() => handleSelectTag('Organic')}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 flex items-center gap-1"
              >
                <Leaf className="w-3.5 h-3.5 text-emerald-600" /> 100% Organic
              </button>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
            {onOpenTracking && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenTracking();
                }}
                className="w-full py-3 rounded-xl bg-stone-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
              >
                <Truck className="w-4 h-4 text-rose-400" />
                Track Order
              </button>
            )}

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenQuiz();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              AI Skin Quiz
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

