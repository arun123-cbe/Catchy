import React, { useRef, useState, useEffect } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface ProductCarouselProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  maxProducts?: number; // Defaults to 9
  title?: string;
  subtitle?: string;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  onQuickView,
  maxProducts = 9,
  title,
  subtitle,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Take at most 9 products
  const displayProducts = products.slice(0, maxProducts);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

    // Calculate approximate active index
    const totalItems = displayProducts.length;
    if (totalItems > 0) {
      const itemWidth = scrollWidth / totalItems;
      const index = Math.round(scrollLeft / itemWidth);
      setActiveIndex(Math.min(Math.max(index, 0), totalItems - 1));
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [displayProducts]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (displayProducts.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center space-y-2">
        <p className="text-xs font-bold text-stone-500">No products available in this carousel.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header and Nav Controls */}
      <div className="flex items-center justify-between gap-4">
        <div>
          {title ? (
            <>
              <h3 className="text-lg sm:text-xl font-bold font-serif text-stone-900 flex items-center gap-2">
                <span>{title}</span>
                <span className="text-[11px] font-sans font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                  {displayProducts.length} {displayProducts.length === 1 ? 'Product' : 'Products'}
                </span>
              </h3>
              {subtitle && <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>}
            </>
          ) : (
            <span className="text-[11px] font-sans font-bold bg-rose-50 border border-rose-200 text-rose-800 px-2.5 py-1 rounded-full">
              Showing {displayProducts.length} {displayProducts.length === 1 ? 'Item' : 'Items'}
            </span>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous products"
            className={`p-2.5 rounded-2xl border transition-all ${
              canScrollLeft
                ? 'bg-white hover:bg-stone-900 hover:text-white border-stone-300 text-stone-800 shadow-sm'
                : 'bg-stone-100 border-stone-200 text-stone-300 cursor-not-allowed opacity-50'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Next products"
            className={`p-2.5 rounded-2xl border transition-all ${
              canScrollRight
                ? 'bg-white hover:bg-stone-900 hover:text-white border-stone-300 text-stone-800 shadow-sm'
                : 'bg-stone-100 border-stone-200 text-stone-300 cursor-not-allowed opacity-50'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Carousel Scroll Container */}
      <div className="relative group">
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 px-1 -mx-1 no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayProducts.map((product) => (
            <div
              key={`carousel-item-${product.id}`}
              className="w-[82vw] sm:w-[280px] md:w-[300px] lg:w-[310px] shrink-0 snap-start"
            >
              <ProductCard product={product} onQuickView={onQuickView} />
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Progress Indicators / Pagination Dots (up to 9) */}
      <div className="flex items-center justify-between pt-1 text-xs text-stone-400">
        <div className="flex items-center gap-1.5 mx-auto">
          {displayProducts.map((p, idx) => (
            <button
              key={`dot-${p.id}`}
              onClick={() => {
                if (!scrollContainerRef.current) return;
                const container = scrollContainerRef.current;
                const target = container.children[idx] as HTMLElement;
                if (target) {
                  container.scrollTo({
                    left: target.offsetLeft - 16,
                    behavior: 'smooth',
                  });
                }
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? 'w-6 bg-rose-600'
                  : 'w-2 bg-stone-300 hover:bg-stone-400'
              }`}
              title={`Go to item ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
