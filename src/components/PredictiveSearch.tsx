import React, { useState, useEffect, useRef } from 'react';
import { Search, Flame, Sparkles, X, ChevronRight, ShoppingBag, Star, Tag, ArrowRight, CornerDownLeft, Eye, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

const TRENDING_SEARCHES = [
  { label: 'Vitamin C Serum', query: 'Serum' },
  { label: 'Rosemary Hair Growth', query: 'Rosemary' },
  { label: 'Ashwagandha & Mag', query: 'Ashwagandha' },
  { label: 'Collagen Peptides', query: 'Collagen' },
  { label: 'Peptide Eye Cream', query: 'Eye Cream' },
  { label: 'Essential Oil Diffuser', query: 'Diffuser' },
  { label: 'Matcha Body Butter', query: 'Body Butter' },
  { label: 'Probiotics & Gut Health', query: 'Probiotic' },
];

export const PredictiveSearch: React.FC<{ isMobile?: boolean; onCloseMobileMenu?: () => void }> = ({
  isMobile = false,
  onCloseMobileMenu
}) => {
  const {
    products,
    categories,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    setSelectedConcern,
    setSelectedProductForModal,
    addToCart,
    setActiveView
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener ('/' or 'Cmd/Ctrl + K') to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to dismiss dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products based on search query
  const trimmedQuery = searchQuery.trim().toLowerCase();

  const matchedProducts = React.useMemo(() => {
    if (!trimmedQuery) return [];

    return products.filter((p) => {
      const inName = p.name.toLowerCase().includes(trimmedQuery);
      const inTagline = p.tagline?.toLowerCase().includes(trimmedQuery);
      const inCategory = p.category.toLowerCase().includes(trimmedQuery);
      const inDesc = p.description.toLowerCase().includes(trimmedQuery);
      const inIngredients = p.ingredients?.some((i) => i.toLowerCase().includes(trimmedQuery));
      const inConcerns = p.concernsHandled?.some((c) => c.toLowerCase().includes(trimmedQuery));

      return inName || inTagline || inCategory || inDesc || inIngredients || inConcerns;
    });
  }, [products, trimmedQuery]);

  // Filter matching categories
  const matchedCategories = React.useMemo(() => {
    if (!trimmedQuery) return [];
    return categories.filter((cat) => cat.toLowerCase().includes(trimmedQuery));
  }, [categories, trimmedQuery]);

  // Extract matching concerns across products
  const matchedConcerns = React.useMemo(() => {
    if (!trimmedQuery) return [];
    const allConcerns = new Set<string>();
    products.forEach((p) => {
      p.concernsHandled?.forEach((c) => {
        if (c.toLowerCase().includes(trimmedQuery)) {
          allConcerns.add(c);
        }
      });
    });
    return Array.from(allConcerns);
  }, [products, trimmedQuery]);

  // Top bestsellers for empty search showcase
  const topBestsellers = React.useMemo(() => {
    return products.filter((p) => p.isBestSeller).slice(0, 3);
  }, [products]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProductForModal(product);
    setIsOpen(false);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedItemMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleTrendingClick = (query: string) => {
    setSearchQuery(query);
    setActiveView('store');
    setIsOpen(true);
    if (onCloseMobileMenu) onCloseMobileMenu();
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setActiveView('store');
    setIsOpen(false);
    if (onCloseMobileMenu) onCloseMobileMenu();
  };

  const handleConcernClick = (concernName: string) => {
    setSelectedConcern(concernName);
    setActiveView('store');
    setIsOpen(false);
    if (onCloseMobileMenu) onCloseMobileMenu();
  };

  const handleViewAllResults = () => {
    setActiveView('store');
    setIsOpen(false);
    if (onCloseMobileMenu) onCloseMobileMenu();
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${isMobile ? '' : ''}`}>
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search formulas, skincare, ingredients..."
          value={searchQuery}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          className={`w-full bg-stone-100/90 border border-stone-200/90 rounded-full pl-10 pr-20 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:bg-white focus:border-rose-300 transition-all shadow-inner ${
            isOpen ? 'bg-white ring-2 ring-rose-500/40 border-rose-300 shadow-md' : ''
          }`}
        />

        {/* Action icons inside input */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
              title="Clear Search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : !isMobile ? (
            <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-stone-200/80 text-[10px] font-mono font-medium text-stone-500">
              /
            </span>
          ) : null}
        </div>
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className={`bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-50 animate-fade-in ${
            isMobile
              ? 'mt-2 w-full max-h-[70vh] overflow-y-auto'
              : 'absolute top-full left-0 right-0 mt-2 min-w-[420px] max-w-[540px] max-h-[520px] overflow-y-auto'
          }`}
        >
          {/* STATE A: NO QUERY ENTERED OR VERY SHORT (< 2 CHARS) -> TRENDING & BESTSELLERS */}
          {!trimmedQuery ? (
            <div className="p-4 space-y-5">
              {/* Trending Searches Header */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 mb-2.5">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
                  <span>Trending Searches</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {TRENDING_SEARCHES.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleTrendingClick(item.query)}
                      className="px-3 py-1.5 rounded-full bg-amber-50/80 hover:bg-amber-100/80 text-amber-900 border border-amber-200/60 text-[11px] font-semibold transition-all flex items-center gap-1 group shadow-2xs hover:scale-102"
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="w-3 h-3 text-amber-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Categories */}
              <div className="border-t border-stone-100 pt-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>Popular Collections</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {categories.slice(0, 4).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/80 text-left text-xs font-medium text-stone-800 transition-colors flex items-center justify-between"
                    >
                      <span className="truncate">{cat}</span>
                      <ArrowRight className="w-3 h-3 text-stone-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Top Rated Bestseller Recommendations */}
              <div className="border-t border-stone-100 pt-3">
                <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-2.5">
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    Top Rated Formulas
                  </span>
                  <span className="text-[10px] text-stone-400 font-normal">Highly Recommended</span>
                </div>

                <div className="space-y-2">
                  {topBestsellers.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="p-2 rounded-2xl hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200 shadow-2xs group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-stone-900 truncate group-hover:text-rose-600 transition-colors">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-stone-500 mt-0.5">
                            <span className="text-amber-600 font-bold flex items-center gap-0.5">
                              ★ {product.rating}
                            </span>
                            <span>•</span>
                            <span className="text-stone-700 font-bold">₹{product.price}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                          addedItemMap[product.id]
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-900 hover:bg-rose-600 text-white shadow-xs'
                        }`}
                        title="Add to Cart"
                      >
                        {addedItemMap[product.id] ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <ShoppingBag className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* STATE B: LIVE PREDICTIVE SEARCH RESULTS FOR TYPED QUERY */
            <div className="p-3 space-y-3">
              {/* Query Header */}
              <div className="px-2 py-1 flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="text-xs text-stone-500">
                  Search results for <strong className="text-stone-900">"{searchQuery}"</strong>
                </span>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                  {matchedProducts.length} {matchedProducts.length === 1 ? 'Product' : 'Products'} Found
                </span>
              </div>

              {/* Matching Categories & Concerns Pills */}
              {(matchedCategories.length > 0 || matchedConcerns.length > 0) && (
                <div className="px-2 space-y-1.5 pb-2 border-b border-stone-100">
                  {matchedCategories.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                        Categories:
                      </span>
                      {matchedCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => handleCategoryClick(cat)}
                          className="px-2.5 py-0.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold transition-colors"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}

                  {matchedConcerns.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                        Concerns:
                      </span>
                      {matchedConcerns.map((concern) => (
                        <button
                          key={concern}
                          onClick={() => handleConcernClick(concern)}
                          className="px-2.5 py-0.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 text-[11px] font-semibold transition-colors"
                        >
                          {concern}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Predictive Product Results List */}
              {matchedProducts.length > 0 ? (
                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                  {matchedProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="p-2.5 rounded-2xl bg-stone-50/60 hover:bg-rose-50/40 border border-stone-200/80 hover:border-rose-200 transition-all flex items-center justify-between gap-3 cursor-pointer group shadow-2xs"
                    >
                      {/* Product Thumbnail & Details */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-14 h-14 rounded-xl object-cover border border-stone-200 shadow-xs group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-stone-200 text-stone-700">
                              {product.category}
                            </span>
                            {product.isBestSeller && (
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 flex items-center gap-0.5">
                                <Flame className="w-2.5 h-2.5 text-amber-600 fill-amber-600" /> Bestseller
                              </span>
                            )}
                          </div>

                          <h4 className="text-xs font-bold text-stone-900 truncate group-hover:text-rose-600 transition-colors">
                            {product.name}
                          </h4>

                          <p className="text-[10px] text-stone-500 truncate">
                            {product.tagline || product.description}
                          </p>

                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-black text-stone-900">
                              ₹{product.price}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-[10px] text-stone-400 line-through">
                                ₹{product.originalPrice}
                              </span>
                            )}
                            <span className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5 ml-auto">
                              ★ {product.rating} ({product.reviewCount})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs ${
                            addedItemMap[product.id]
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-900 hover:bg-rose-600 text-white'
                          }`}
                        >
                          {addedItemMap[product.id] ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* No Results State */
                <div className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-800">No matching formulas found</h4>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Try searching for "serum", "hair oil", "rose", "collagen" or "organic"
                    </p>
                  </div>

                  {/* Fallback Trending Suggestion Buttons */}
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap justify-center gap-1.5">
                    {TRENDING_SEARCHES.slice(0, 4).map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleTrendingClick(item.query)}
                        className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* View All Results Footer Button */}
              {matchedProducts.length > 0 && (
                <div className="pt-2 border-t border-stone-100">
                  <button
                    onClick={handleViewAllResults}
                    className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs group"
                  >
                    <span>View All {matchedProducts.length} Results in Store</span>
                    <CornerDownLeft className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
