import React from 'react';
import { Star, ShoppingCart, Eye, Sparkles, AlertCircle, Leaf, Flame, Tag, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  isAIRecommended?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, isAIRecommended }) => {
  const { addToCart, formatPrice } = useStore();

  const isLowStock = product.stock > 0 && product.stock <= product.reorderPoint;
  const isOutOfStock = product.stock === 0;

  return (
    <div className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between hover:shadow-xl ${
      isAIRecommended ? 'border-amber-400 ring-2 ring-amber-300/40' : 'border-stone-200/80 hover:border-rose-300/70'
    }`}>
      
      {/* AI Recommendation Match Ribbon */}
      {isAIRecommended && (
        <div className="bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[11px] font-bold py-1 px-3 flex items-center justify-center gap-1.5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>98% Match for Your Quiz Profile</span>
        </div>
      )}

      <div>
        {/* Product Image Container */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100 cursor-pointer" onClick={() => onQuickView(product)}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Top Badge Tags */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            {product.isBestSeller && (
              <span className="bg-amber-500/90 backdrop-blur-md text-stone-900 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-950 fill-amber-900" />
                Best Seller
              </span>
            )}
            {product.isNewArrival && (
              <span className="bg-purple-600/90 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                New Arrival
              </span>
            )}
            {product.isOrganic && (
              <span className="bg-emerald-800/90 backdrop-blur-md text-white text-[10px] tracking-wider font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                <Leaf className="w-3 h-3 text-emerald-300" />
                100% Organic
              </span>
            )}
            {product.isSuperSaver && (
              <span className="bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                <Tag className="w-3 h-3" />
                Super Saver
              </span>
            )}
          </div>

          {/* Low Stock Badge */}
          {isLowStock && (
            <div className="absolute bottom-3 left-3 bg-amber-500/90 text-stone-900 text-[11px] font-bold px-2.5 py-1 rounded-md backdrop-blur-md flex items-center gap-1 shadow-xs">
              <AlertCircle className="w-3.5 h-3.5" />
              Only {product.stock} left in stock!
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center text-white font-bold text-sm tracking-wide">
              OUT OF STOCK
            </div>
          )}

          {/* Quick View Floating Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-full text-stone-700 hover:text-rose-600 hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-md"
            title="Quick Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Product Content Details */}
        <div className="p-4 sm:p-5">
          
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="font-medium text-stone-400 uppercase tracking-wider text-[10px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-stone-400 text-[11px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Name & Tagline */}
          <h3
            onClick={() => onQuickView(product)}
            className="text-base font-bold text-stone-900 group-hover:text-rose-600 transition-colors line-clamp-1 cursor-pointer font-serif"
          >
            {product.name}
          </h3>
          <p className="text-xs text-stone-500 line-clamp-1 mt-0.5 mb-2.5 font-sans">
            {product.tagline}
          </p>

          {/* Product Specialities / Features Pills */}
          {product.specialities && product.specialities.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.specialities.slice(0, 3).map((spec, i) => (
                <span key={i} className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                  {spec}
                </span>
              ))}
            </div>
          )}

          {/* Concerns Handled Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {product.concernsHandled.slice(0, 3).map((concern, i) => (
              <span key={i} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
                {concern}
              </span>
            ))}
          </div>

          {/* Pricing Section */}
          <div className="pt-2 border-t border-stone-100">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-stone-900 font-serif">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through font-mono">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 pt-0 gap-2 grid grid-cols-2">
        <button
          onClick={() => onQuickView(product)}
          className="w-full py-2.5 px-3 rounded-xl border border-stone-300 text-stone-800 text-xs font-semibold hover:bg-stone-100 active:scale-95 transition-all flex items-center justify-center gap-1"
        >
          <Eye className="w-3.5 h-3.5" />
          Details
        </button>

        <button
          disabled={isOutOfStock}
          onClick={() => addToCart(product, 1)}
          className="w-full py-2.5 px-3 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 shadow-xs"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Add to Cart
        </button>
      </div>

    </div>
  );
};
