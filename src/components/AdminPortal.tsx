import React from 'react';
import { LayoutDashboard, Package, ShoppingBag, FolderPlus, BarChart2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminInventory } from './admin/AdminInventory';
import { AdminProducts } from './admin/AdminProducts';
import { AdminOrders } from './admin/AdminOrders';
import { AdminCategoriesManager } from './admin/AdminCategoriesManager';

export const AdminPortal: React.FC = () => {
  const { adminSubTab, setAdminSubTab, setActiveView, products } = useStore();

  const lowStockCount = products.filter(p => p.stock <= p.reorderPoint).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-stone-800 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Store Operations Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-white">
            CatchyStore Backoffice Admin
          </h1>
          <p className="text-xs text-stone-400">
            Real-time sales analytics, stock tracking, UPI payment verification, categories & product management
          </p>
        </div>

        <button
          onClick={() => setActiveView('store')}
          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Switch to Customer Storefront
        </button>
      </div>

      {/* Admin Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto">
        
        <button
          onClick={() => setAdminSubTab('analytics')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            adminSubTab === 'analytics'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <BarChart2 className="w-4 h-4 text-rose-500" />
          Sales Analytics
        </button>

        <button
          onClick={() => setAdminSubTab('products')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            adminSubTab === 'products'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-indigo-500" />
          Manage Products
        </button>

        <button
          onClick={() => setAdminSubTab('categories' as any)}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            adminSubTab === ('categories' as any)
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <FolderPlus className="w-4 h-4 text-cyan-500" />
          Logo Upload & Categories
        </button>

        <button
          onClick={() => setAdminSubTab('inventory')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap relative ${
            adminSubTab === 'inventory'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Package className="w-4 h-4 text-amber-500" />
          Inventory Tracking
          {lowStockCount > 0 && (
            <span className="bg-amber-500 text-stone-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {lowStockCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminSubTab('orders')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            adminSubTab === 'orders'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-emerald-500" />
          Customer Orders
        </button>

      </div>

      {/* Render Active Sub-Tab View */}
      {adminSubTab === 'analytics' && <AdminDashboard />}
      {adminSubTab === 'inventory' && <AdminInventory />}
      {adminSubTab === 'products' && <AdminProducts />}
      {adminSubTab === 'orders' && <AdminOrders />}
      {adminSubTab === ('categories' as any) && <AdminCategoriesManager />}

    </div>
  );
};
