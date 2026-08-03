import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  FolderPlus,
  Tag,
  Upload,
  Image as ImageIcon,
  RefreshCw,
  Check,
  Link as LinkIcon,
  Edit3,
  X,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CatchyStoreLogo } from '../CatchyStoreLogo';

export const AdminCategoriesManager: React.FC = () => {
  const {
    categories,
    addCategory,
    deleteCategory,
    updateCategoryThumbnail,
    getCategoryThumbnail,
    products,
    customLogoUrl,
    setCustomLogoUrl
  } = useStore();

  // New Category State
  const [newCatName, setNewCatName] = useState('');
  const [newCatThumbUrl, setNewCatThumbUrl] = useState('');

  // Editing Thumbnail Modal / Inline State
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editThumbUrl, setEditThumbUrl] = useState('');

  // Logo upload state
  const [logoUrlInput, setLogoUrlInput] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle Add Category
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim(), newCatThumbUrl.trim() || undefined);
    setNewCatName('');
    setNewCatThumbUrl('');
    setSuccessMsg(`Added category "${newCatName.trim()}" with thumbnail!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Handle New Category Image File Upload
  const handleNewCatImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setNewCatThumbUrl(reader.result as string);
      setUploadError('');
    };
    reader.readAsDataURL(file);
  };

  // Handle Edit Category Thumbnail Upload
  const handleEditCatImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setEditThumbUrl(reader.result as string);
      setUploadError('');
    };
    reader.readAsDataURL(file);
  };

  // Save edited thumbnail
  const handleSaveThumbnail = (catName: string) => {
    if (!editThumbUrl.trim()) return;
    updateCategoryThumbnail(catName, editThumbUrl.trim());
    setEditingCategory(null);
    setEditThumbUrl('');
    setSuccessMsg(`Updated thumbnail for "${catName}"!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Handle Store Logo File Upload
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
          <p className="text-xs text-stone-500">Manage brand identity, custom logo, and category thumbnails for storefront navigation</p>
        </div>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* SECTION 1: STORE LOGO UPLOAD & BRANDING */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-serif flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-rose-500" />
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
              Restore Default Logo
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
              <h4 className="text-xs font-bold text-stone-900">Upload Logo Image File</h4>
              <p className="text-[11px] text-stone-500 mt-1">
                PNG, JPG, WEBP, or SVG file from your device
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
              <LinkIcon className="w-7 h-7 text-amber-500 mb-2" />
              <h4 className="text-xs font-bold text-stone-900">Paste Logo Image URL</h4>
              <p className="text-[11px] text-stone-500 mt-1">
                Direct web image URL (e.g. https://yourdomain.com/logo.png)
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

      {/* SECTION 2: ADD CATEGORY WITH THUMBNAIL FORM */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-stone-900 font-serif flex items-center gap-2 border-b border-stone-100 pb-3">
          <FolderPlus className="w-5 h-5 text-emerald-600" />
          Add New Category & Thumbnail
        </h3>
        
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">Category Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Hair Care, Superfoods, Sexual Wellness..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">Category Thumbnail Image URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newCatThumbUrl}
                  onChange={(e) => setNewCatThumbUrl(e.target.value)}
                  className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
                <label className="cursor-pointer px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl border border-stone-300 flex items-center gap-1.5 shrink-0 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-stone-600" />
                  <span>Upload File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleNewCatImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* New Category Thumbnail Live Preview */}
          {newCatThumbUrl && (
            <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <img
                src={newCatThumbUrl}
                alt="New Category Preview"
                className="w-12 h-12 object-cover rounded-xl border border-stone-300 shadow-xs"
              />
              <div className="text-xs">
                <p className="font-bold text-stone-800">Thumbnail Preview Active</p>
                <p className="text-[10px] text-stone-500 truncate max-w-md">{newCatThumbUrl}</p>
              </div>
              <button
                type="button"
                onClick={() => setNewCatThumbUrl('')}
                className="ml-auto p-1.5 hover:bg-stone-200 rounded-lg text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Create Category with Thumbnail</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 3: CATEGORIES LIST WITH THUMBNAIL MANAGEMENT */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs space-y-0">
        <div className="p-4 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
              Active Store Categories ({categories.length})
            </span>
            <span className="text-[11px] text-stone-500">
              Manage category thumbnails shown on homepage grids and headers
            </span>
          </div>
        </div>

        <div className="divide-y divide-stone-100 text-xs">
          {categories.map((cat) => {
            const count = products.filter(p => p.category === cat).length;
            const thumbUrl = getCategoryThumbnail(cat);
            const isEditingThis = editingCategory === cat;

            return (
              <div key={cat} className="p-4 space-y-3 hover:bg-stone-50/60 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Category Thumbnail Card */}
                    <div className="relative group shrink-0">
                      <img
                        src={thumbUrl}
                        alt={cat}
                        className="w-14 h-14 object-cover rounded-2xl border border-stone-200 shadow-xs group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-stone-900/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Edit3 className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-stone-900 text-sm font-serif block">{cat}</span>
                      <span className="text-[11px] text-stone-400 block">{count} products assigned</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        if (isEditingThis) {
                          setEditingCategory(null);
                        } else {
                          setEditingCategory(cat);
                          setEditThumbUrl(thumbUrl);
                        }
                      }}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isEditingThis ? 'Close Editor' : 'Edit Thumbnail'}</span>
                    </button>

                    <span className="bg-stone-100 text-stone-700 text-[10px] font-bold px-2.5 py-1 rounded-full hidden sm:inline-block">
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

                {/* Inline Thumbnail Edit Panel */}
                {isEditingThis && (
                  <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        Update Category Thumbnail for "{cat}"
                      </h4>
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                      <img
                        src={editThumbUrl || thumbUrl}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-xl border border-stone-300 shrink-0 shadow-xs"
                      />

                      <div className="flex-1 w-full space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="url"
                            placeholder="Enter image URL https://..."
                            value={editThumbUrl}
                            onChange={(e) => setEditThumbUrl(e.target.value)}
                            className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                          />
                          <label className="cursor-pointer px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 transition-colors">
                            <Upload className="w-3.5 h-3.5 text-amber-300" />
                            <span>Upload File</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleEditCatImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingCategory(null)}
                        className="px-3.5 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveThumbnail(cat)}
                        className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Save Thumbnail
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
