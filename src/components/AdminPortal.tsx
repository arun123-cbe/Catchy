import React, { useState } from 'react';
import { LayoutDashboard, Package, ShoppingBag, FolderPlus, BarChart2, ShieldCheck, ArrowLeft, Lock, Unlock, Eye, EyeOff, KeyRound, AlertCircle, LogOut, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminInventory } from './admin/AdminInventory';
import { AdminProducts } from './admin/AdminProducts';
import { AdminOrders } from './admin/AdminOrders';
import { AdminCategoriesManager } from './admin/AdminCategoriesManager';

export const AdminPortal: React.FC = () => {
  const { adminSubTab, setAdminSubTab, setActiveView, products } = useStore();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('catchy_admin_authenticated') === 'true';
  });

  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Password Management State
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changeSuccess, setChangeSuccess] = useState('');

  const getSavedPassword = () => {
    return localStorage.getItem('catchy_admin_password') || 'admin123';
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = getSavedPassword();
    if (passwordInput === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('catchy_admin_authenticated', 'true');
      setAuthError('');
      setPasswordInput('');
    } else {
      setAuthError('Incorrect Password! Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('catchy_admin_authenticated');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      setAuthError('Password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setAuthError('New passwords do not match!');
      return;
    }

    localStorage.setItem('catchy_admin_password', newPassword);
    setChangeSuccess('Admin password updated successfully!');
    setAuthError('');
    setTimeout(() => {
      setIsChangingPassword(false);
      setChangeSuccess('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1800);
  };

  const lowStockCount = products.filter(p => p.stock <= p.reorderPoint).length;

  // 1. LOGIN GATE VIEW (If not authenticated)
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 animate-fade-in">
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-stone-200 space-y-6 text-center relative overflow-hidden">
          
          {/* Top Decorative Header Accent */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-stone-900 via-rose-500 to-amber-500" />

          <div className="w-16 h-16 bg-stone-900 text-amber-400 rounded-3xl flex items-center justify-center mx-auto shadow-md border border-stone-800">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold font-serif text-stone-900">Admin Portal Access</h2>
            <p className="text-xs text-stone-500">Enter the security password to unlock Backoffice Operations</p>
          </div>

          {authError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Admin Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter admin password..."
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  className="w-full bg-stone-50 border border-stone-300 rounded-2xl pl-10 pr-10 py-3 text-xs text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Default Password Helper Box */}
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-amber-900 text-[11px] flex items-center justify-between">
              <span>Default Password: <code className="font-mono font-bold bg-amber-200/70 px-1.5 py-0.5 rounded text-amber-950">admin123</code></span>
              <button
                type="button"
                onClick={() => setPasswordInput('admin123')}
                className="text-[10px] font-bold text-amber-800 underline hover:text-amber-950"
              >
                Auto-fill
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4 text-amber-400" />
              <span>Unlock Admin Panel</span>
            </button>
          </form>

          <div className="pt-2 border-t border-stone-100">
            <button
              onClick={() => setActiveView('store')}
              className="text-xs font-bold text-stone-500 hover:text-stone-800 underline flex items-center justify-center gap-1.5 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Storefront
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED ADMIN PANEL VIEW
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-stone-800 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Authenticated Admin Session</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-white">
            CatchyStore Backoffice Admin
          </h1>
          <p className="text-xs text-stone-400">
            Real-time sales analytics, stock tracking, UPI payment verification, categories & product management
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsChangingPassword(!isChangingPassword)}
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5"
            title="Change Security Password"
          >
            <KeyRound className="w-4 h-4 text-amber-300" />
            <span>Change Password</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
            title="Lock Admin Session"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Lock Admin</span>
          </button>

          <button
            onClick={() => setActiveView('store')}
            className="px-4 py-2.5 rounded-xl bg-white text-stone-900 hover:bg-stone-100 text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Storefront
          </button>
        </div>
      </div>

      {/* Change Password Modal / Card Overlay */}
      {isChangingPassword && (
        <div className="bg-stone-900 text-white p-6 rounded-3xl border border-stone-800 shadow-xl max-w-md space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h3 className="text-sm font-bold font-serif text-amber-300 flex items-center gap-2">
              <KeyRound className="w-4 h-4" /> Change Admin Password
            </h3>
            <button
              onClick={() => setIsChangingPassword(false)}
              className="text-stone-400 hover:text-white text-xs font-bold"
            >
              Cancel
            </button>
          </div>

          {changeSuccess && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {changeSuccess}
            </div>
          )}

          {authError && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {authError}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-400 uppercase">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 4 characters..."
                className="w-full mt-1 bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-400 uppercase">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password..."
                className="w-full mt-1 bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-md"
            >
              Update Password
            </button>
          </form>
        </div>
      )}

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

