import React, { useState } from 'react';
import { Plus, Trash2, FolderPlus, Tag, Upload, Image, RefreshCw, Check, Sparkles, Link } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CatchyStoreLogo } from '../CatchyStoreLogo';

export const AdminCategoriesManager: React.FC = () => {
  const { categories, addCategory, deleteCategory, products, customLogoUrl, setCustomLogoUrl } = useStore();
  const [newCatName, setNewCatName] = useState('');
  const [logoUrlInput, setLogoUrlInput] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim());
    setNewCatName('');
  };

  // Handle Image File Upload (PNG, JPG, SVG, WEBP)
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (.png, .jpg, .svg, .webp).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image file size must be less than 5MB.');
      return;
    }

    setUploadError('');
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCustomLogoUrl(result);
      setSuccessMsg('Logo updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyLogoUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoUrlInput.trim()) return;
    setCustomLogoUrl(logoUrlInput.trim());
    setLogoUrlInput('');
    setUploadError('');
    setSuccessMsg('Logo updated successfully from URL!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleResetLogo = () => {
    setCustomLogoUrl(null);
    setUploadError('');
    setSuccessMsg('Restored default CatchyStore logo.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 font-serif">Branding & Store Categories</h2>
          <p className="text-xs text-stone-500">Upload custom logo, manage brand identity, and configure storefront categories</p>
        </div>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* SECTION 1: STORE LOGO UPLOAD & BRANDING */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-serif flex items-center gap-2">
              <Image className="w-5 h-5 text-rose-500" />
              Storefront Brand Logo
            </h3>
            <p className="text-xs text-stone-500">
              Upload your official business logo image to replace the header & footer logo across the entire storefront
            </p>
          </div>

          {customLogoUrl && (
            <button
              onClick={handleResetLogo}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
              Restore Default SVG Logo
            </button>
          )}
        </div>

        {/* Current Active Logo Preview */}
        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Active Logo Preview:</span>
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-stone-200 justify-around">
            <div className="text-center">
              <span className="text-[10px] text-stone-400 block mb-1">On Light Canvas (Header):</span>
              <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-center min-w-[200px] h-16">
                <CatchyStoreLogo size="md" />
              </div>
            </div>

            <div className="text-center">
              <span className="text-[10px] text-stone-400 block mb-1">On Dark Canvas (Footer):</span>
              <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 flex items-center justify-center min-w-[200px] h-16">
                <CatchyStoreLogo size="md" />
              </div>
            </div>
          </div>
        </div>

        {/* Upload Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option A: Upload Image File */}
          <div className="border-2 border-dashed border-stone-300 rounded-2xl p-5 text-center bg-stone-50/50 hover:bg-stone-100/50 transition-colors flex flex-col justify-between">
            <div>
              <Upload className="w-8 h-8 text-rose-500 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-stone-900">Option 1: Upload Image File</h4>
              <p className="text-[11px] text-stone-500 mt-1">
                Select PNG, JPG, WEBP, or SVG file from your phone or computer
              </p>
            </div>

            <div className="mt-4">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm">
                <Upload className="w-4 h-4 text-amber-300" />
                <span>Choose Image File</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                  onChange={handleLogoFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Option B: Enter Image URL */}
          <div className="border border-stone-200 rounded-2xl p-5 bg-stone-50/50 flex flex-col justify-between">
            <div>
              <Link className="w-7 h-7 text-amber-500 mb-2" />
              <h4 className="text-xs font-bold text-stone-900">Option 2: Paste Image Direct URL</h4>
              <p className="text-[11px] text-stone-500 mt-1">
                Enter a direct web image link (e.g. https://yourdomain.com/logo.png)
              </p>
            </div>

            <form onSubmit={handleApplyLogoUrl} className="mt-4 flex gap-2">
              <input
                type="url"
                required
                placeholder="https://..."
                value={logoUrlInput}
                onChange={(e) => setLogoUrlInput(e.target.value)}
                className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-all shrink-0 shadow-sm"
              >
                Apply URL
              </button>
            </form>
          </div>
        </div>

        {uploadError && (
          <p className="text-xs text-rose-600 font-bold bg-rose-50 p-3 rounded-xl border border-rose-200">{uploadError}</p>
        )}
      </div>

      {/* SECTION 2: ADD CATEGORY FORM */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs max-w-xl">
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-2">
          <FolderPlus className="w-4 h-4 text-emerald-600" />
          Add New Storefront Category
        </h3>
        
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            required
            placeholder="e.g. Hair Care, Superfoods, Sexual Wellness..."
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </form>
      </div>

      {/* SECTION 3: CATEGORIES LIST */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Active Store Categories ({categories.length})
          </span>
        </div>

        <div className="divide-y divide-stone-100 text-xs">
          {categories.map((cat) => {
            const count = products.filter(p => p.category === cat).length;

            return (
              <div key={cat} className="p-4 flex items-center justify-between hover:bg-stone-50/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 text-sm font-serif block">{cat}</span>
                    <span className="text-[11px] text-stone-400">{count} products assigned</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-stone-100 text-stone-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {count} SKUs
                  </span>
                  
                  {categories.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`Remove category "${cat}"? Products in this category will keep their current category tag.`)) {
                          deleteCategory(cat);
                        }
                      }}
                      className="p-2 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
