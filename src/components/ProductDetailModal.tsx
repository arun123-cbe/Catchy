import React, { useState } from 'react';
import { X, Star, ShoppingCart, Check, ShieldCheck, Leaf, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, formatPrice } = useStore();
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const isLowStock = product.stock > 0 && product.stock <= product.reorderPoint;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-stone-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Image & Highlights */}
          <div className="bg-stone-50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden mb-4 shadow-sm bg-stone-200 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.isOrganic && (
                  <span className="absolute top-3 left-3 bg-emerald-900/90 text-white text-xs font-semibold px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                    100% Organic Formula
                  </span>
                )}
              </div>

              {/* SKU & Inventory Badge */}
              <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
                <span>SKU: {product.sku}</span>
                {isOutOfStock ? (
                  <span className="text-rose-600 font-bold">Out of Stock</span>
                ) : isLowStock ? (
                  <span className="text-amber-600 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Only {product.stock} Left!
                  </span>
                ) : (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    In Stock ({product.stock} units)
                  </span>
                )}
              </div>
            </div>

            {/* Quality Guarantees */}
            <div className="mt-6 pt-4 border-t border-stone-200 text-xs text-stone-600 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dermatologist Tested & Clinically Proven</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Fast Express Courier Delivery Across India</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Purchase Options */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-widest font-bold text-rose-600">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-stone-400">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-stone-900 font-serif mb-1">
                {product.name}
              </h2>
              <p className="text-xs text-stone-500 font-medium mb-4">
                {product.tagline}
              </p>

              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-2xl font-extrabold text-stone-900 font-serif">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-400 line-through font-mono">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Product Specialities / Features */}
              {product.specialities && product.specialities.length > 0 && (
                <div className="mb-5 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/70">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Formula Speciality & Features
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium text-emerald-900">
                    {product.specialities.map((spec, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-white/80 p-2 rounded-xl border border-emerald-100 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-stone-700 leading-relaxed mb-5">
                {product.description}
              </p>

              {/* Benefits */}
              <div className="mb-5">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                  Key Benefits
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-600">
                  {product.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ingredients preview */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                    Active Ingredients
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {product.ingredients.map((ing, i) => (
                      <span key={i} className="text-[11px] bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-200 mb-6">
                <span className="text-xs font-bold text-stone-800">Select Quantity:</span>
                <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-stone-500 hover:text-stone-900 font-bold px-1 text-sm"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-stone-900 w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-stone-500 hover:text-stone-900 font-bold px-1 text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* Add to Cart Submit */}
            <button
              disabled={isOutOfStock || addedAnimation}
              onClick={handleAddToCart}
              className={`w-full py-3.5 px-6 rounded-2xl text-xs font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                addedAnimation ? 'bg-emerald-600' : 'bg-stone-900 hover:bg-stone-800'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart ({formatPrice(product.price * quantity)})
                </>
              )}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};
