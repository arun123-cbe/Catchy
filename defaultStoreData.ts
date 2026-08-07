import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, Minus, Search, Check, RefreshCw, Filter } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

export const AdminInventory: React.FC = () => {
  const { products, updateStock, formatPrice } = useStore();

  const [search, setSearch] = useState('');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const isLow = p.stock <= p.reorderPoint;
    return matchesSearch && (!filterLowStockOnly || isLow);
  });

  const lowStockCount = products.filter(p => p.stock <= p.reorderPoint).length;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 font-serif">Inventory & Stock Tracker</h2>
          <p className="text-xs text-stone-500">Real-time SKU quantities, automated low-stock warnings, and reorder dispatch</p>
        </div>

        {lowStockCount > 0 && (
          <div className="bg-amber-50 border border-amber-300 text-amber-900 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 animate-bounce" />
            <span>{lowStockCount} SKUs below reorder threshold!</span>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-stone-200">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Filter by SKU or product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
          />
        </div>

        <button
          onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
            filterLowStockOnly
              ? 'bg-amber-500 text-stone-900 border-amber-600 font-bold'
              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          {filterLowStockOnly ? 'Showing Low Stock Only' : 'Show Low Stock Only'}
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 border-b border-stone-200 uppercase tracking-wider text-[10px] text-stone-500 font-bold">
              <tr>
                <th className="p-4">Product Details</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Unit Price</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Quick Adjust</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 font-medium">
              {filtered.map((prod) => {
                const isLow = prod.stock <= prod.reorderPoint;
                const isOut = prod.stock === 0;

                return (
                  <tr key={prod.id} className="hover:bg-stone-50/80 transition-colors">
                    
                    {/* Image & Title */}
                    <td className="p-4 flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover bg-stone-100 border border-stone-200" />
                      <div>
                        <span className="font-bold text-stone-900 font-serif block line-clamp-1">{prod.name}</span>
                        <span className="text-[10px] text-stone-400">Reorder threshold: {prod.reorderPoint} units</span>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="p-4 font-mono text-stone-500 font-bold">
                      {prod.sku}
                    </td>

                    {/* Category */}
                    <td className="p-4 text-stone-600">
                      {prod.category}
                    </td>

                    {/* Price */}
                    <td className="p-4 font-bold text-stone-900">
                      {formatPrice(prod.price)}
                    </td>

                    {/* Stock Level */}
                    <td className="p-4">
                      <span className={`font-extrabold text-sm ${isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-emerald-800'}`}>
                        {prod.stock} units
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      {isOut ? (
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Out of Stock</span>
                      ) : isLow ? (
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Low Stock
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1 w-fit">
                          <Check className="w-3 h-3" />
                          Healthy
                        </span>
                      )}
                    </td>

                    {/* Quick Adjust Buttons */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => updateStock(prod.id, prod.stock - 1)}
                          className="p-1.5 bg-stone-100 rounded-lg text-stone-700 hover:bg-stone-200 transition-colors"
                          title="Reduce 1"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-bold text-stone-800">{prod.stock}</span>
                        <button
                          onClick={() => updateStock(prod.id, prod.stock + 10)}
                          className="px-2 py-1 bg-stone-900 text-white rounded-lg text-[11px] font-bold hover:bg-stone-800 transition-colors flex items-center gap-1"
                          title="Add 10 Batch"
                        >
                          <Plus className="w-3 h-3" />
                          +10 Batch
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
