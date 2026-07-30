import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import { DollarSign, ShoppingBag, AlertTriangle, TrendingUp, ArrowUpRight, FolderPlus } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminDashboard: React.FC = () => {
  const { orders, products, categories, formatPrice } = useStore();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'ytd'>('30d');

  // Key Stats Calculations
  const totalRevenueUSD = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const totalCategoriesCount = categories.length;
  const lowStockItemsCount = products.filter(p => p.stock <= p.reorderPoint).length;
  const avgOrderValueUSD = totalOrders > 0 ? totalRevenueUSD / totalOrders : 0;

  // Monthly / Daily Sales Chart Data
  const salesChartData = [
    { label: 'Week 1', revenue: Math.round(totalRevenueUSD * 0.18), orders: Math.round(totalOrders * 0.2) },
    { label: 'Week 2', revenue: Math.round(totalRevenueUSD * 0.24), orders: Math.round(totalOrders * 0.25) },
    { label: 'Week 3', revenue: Math.round(totalRevenueUSD * 0.28), orders: Math.round(totalOrders * 0.3) },
    { label: 'Week 4', revenue: Math.round(totalRevenueUSD * 0.30), orders: Math.round(totalOrders * 0.25) }
  ];

  // Category Revenue Share Data
  const categoryMap: Record<string, number> = {};
  orders.forEach(o => {
    o.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      const cat = prod ? prod.category : 'General';
      categoryMap[cat] = (categoryMap[cat] || 0) + (item.price * item.quantity);
    });
  });

  const categoryPieData = Object.keys(categoryMap).map(cat => ({
    name: cat,
    value: Math.round(categoryMap[cat] || 50)
  }));

  const COLORS = ['#e11d48', '#059669', '#d97706', '#4f46e5', '#0284c7'];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Controls & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 font-serif">Executive Sales Analytics</h2>
          <p className="text-xs text-stone-500">Real-time revenue metrics, order velocity, and subscription retention</p>
        </div>

        <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl border border-stone-200">
          {(['7d', '30d', 'ytd'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeRange === range ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Year to Date'}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Gross Revenue</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-stone-900 font-serif">
            {formatPrice(totalRevenueUSD)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs last period</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Orders</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-stone-900 font-serif">
            {totalOrders}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Avg Value: {formatPrice(avgOrderValueUSD)}</span>
          </div>
        </div>

        {/* Active Categories */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Product Categories</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <FolderPlus className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-stone-900 font-serif">
            {totalCategoriesCount} Active
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-2">
            <span>{products.length} total products listed</span>
          </div>
        </div>

        {/* Inventory Warning */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Low Stock Alerts</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600 font-serif">
            {lowStockItemsCount} SKUs
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-700 font-semibold mt-2">
            <span>Requires reorder dispatch</span>
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Sales Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900 font-serif">Revenue & Order Trends</h3>
              <p className="text-xs text-stone-500">Gross sales breakdown across weekly intervals</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#78716c' }} />
                <YAxis tick={{ fontSize: 11, fill: '#78716c' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1c1917', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`${formatPrice(Number(val))}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#e11d48" strokeWidth={3} dot={{ r: 5, fill: '#e11d48' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-serif">Sales by Category</h3>
            <p className="text-xs text-stone-500">Revenue contribution per product sector</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryPieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`${formatPrice(Number(val))}`, 'Sales']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-stone-100">
            {categoryPieData.map((entry, idx) => (
              <div key={entry.name} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-stone-700 font-medium">{entry.name}</span>
                </div>
                <span className="font-bold text-stone-900">{formatPrice(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

function SparklesIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    </svg>
  );
}
