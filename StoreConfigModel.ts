import React, { useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Sparkles,
  Link as LinkIcon,
  Eye,
  EyeOff,
  RefreshCw,
  Layout,
  Tag,
  ArrowRight,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { DisplayBanner, HeroSlide } from '../../types';

// Helper to compress image files using HTML Canvas before base64 conversion
const compressImageFile = (
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.82
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file.'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image element'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Convert to optimized JPEG Data URL
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const AdminHomepageBanners: React.FC = () => {
  const {
    heroSlides,
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    toggleHeroSlide,
    heroBannerConfig,
    updateHeroBannerConfig,
    homepageBanners,
    addHomepageBanner,
    updateHomepageBanner,
    deleteHomepageBanner,
    toggleHomepageBanner,
    categories
  } = useStore();

  const safeCategories = categories || [];
  const safeHeroSlides = heroSlides || [];
  const safeHomepageBanners = homepageBanners || [];

  // Main Hero Banner Config State
  const [isEditingMainConfig, setIsEditingMainConfig] = useState(false);
  const [mainConfigForm, setMainConfigForm] = useState(heroBannerConfig || {
    headline: 'DISCOVER Healthy, Glowing Skin',
    subheadline: 'Premium Skincare for Every You',
    bgImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1600',
    ctaText: 'SHOP NOW',
    ctaLinkCategory: 'All',
    featurePill: '100% Pure Organic & Bio-Active'
  });
  const [isCompressingMain, setIsCompressingMain] = useState(false);

  // Hero Slide Modal State
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [editingHeroId, setEditingHeroId] = useState<string | null>(null);
  const [heroSuccess, setHeroSuccess] = useState('');
  const [heroError, setHeroError] = useState('');
  const [isCompressingHero, setIsCompressingHero] = useState(false);

  const [heroSlideForm, setHeroSlideForm] = useState<Omit<HeroSlide, 'id'>>({
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1600',
    linkUrl: safeCategories[0] || 'All',
    title: 'New Hero Banner',
    active: true
  });

  // Display Banners Modal State
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerSuccess, setBannerSuccess] = useState('');
  const [isCompressingBanner, setIsCompressingBanner] = useState(false);

  const [bannerForm, setBannerForm] = useState<Omit<DisplayBanner, 'id'>>({
    title: '',
    subtitle: '',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200',
    badge: 'Special Offer',
    buttonText: 'Shop Now',
    categoryLink: safeCategories[0] || 'All',
    theme: 'rose',
    position: 'top',
    active: true
  });

  // Handle Main Banner Config File Upload
  const handleMainBannerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressingMain(true);
    setHeroError('');
    try {
      const compressed = await compressImageFile(file);
      setMainConfigForm(prev => ({ ...prev, bgImage: compressed }));
    } catch (err: any) {
      setHeroError(err?.message || 'Failed to process image file.');
    } finally {
      setIsCompressingMain(false);
    }
  };

  // Submit Main Hero Config
  const handleSaveMainConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroBannerConfig(mainConfigForm);

    // If heroSlides exist, update the first slide as well to ensure total consistency across components
    if (safeHeroSlides.length > 0) {
      updateHeroSlide(safeHeroSlides[0].id, {
        image: mainConfigForm.bgImage,
        linkUrl: mainConfigForm.ctaLinkCategory,
        title: mainConfigForm.headline
      });
    } else {
      addHeroSlide({
        image: mainConfigForm.bgImage,
        linkUrl: mainConfigForm.ctaLinkCategory,
        title: mainConfigForm.headline,
        active: true
      });
    }

    setHeroSuccess('Main homepage hero banner image and details updated successfully!');
    setIsEditingMainConfig(false);
    setTimeout(() => setHeroSuccess(''), 3500);
  };

  // Handle Hero Banner Image Upload
  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressingHero(true);
    setHeroError('');
    try {
      const compressed = await compressImageFile(file);
      setHeroSlideForm(prev => ({ ...prev, image: compressed }));
    } catch (err: any) {
      setHeroError(err?.message || 'Failed to process image file.');
    } finally {
      setIsCompressingHero(false);
    }
  };

  // Open Hero Add Modal
  const handleOpenAddHero = () => {
    setEditingHeroId(null);
    setHeroSlideForm({
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1600',
      linkUrl: categories[0] || 'All',
      title: 'Hero Banner Image',
      active: true
    });
    setHeroError('');
    setIsHeroModalOpen(true);
  };

  // Open Hero Edit Modal
  const handleOpenEditHero = (slide: HeroSlide) => {
    setEditingHeroId(slide.id);
    setHeroSlideForm({
      image: slide.image,
      linkUrl: slide.linkUrl,
      title: slide.title || '',
      active: slide.active
    });
    setHeroError('');
    setIsHeroModalOpen(true);
  };

  // Submit Hero Slide Form
  const handleSubmitHeroSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroSlideForm.image) {
      setHeroError('Please select an image or enter an image URL.');
      return;
    }

    if (editingHeroId) {
      updateHeroSlide(editingHeroId, heroSlideForm);
      setHeroSuccess('Hero banner slide updated!');
    } else {
      addHeroSlide(heroSlideForm);
      setHeroSuccess('New hero banner slide added!');
    }

    // Also update main config background if it's the first slide
    updateHeroBannerConfig({
      bgImage: heroSlideForm.image,
      ctaLinkCategory: heroSlideForm.linkUrl
    });

    setIsHeroModalOpen(false);
    setTimeout(() => setHeroSuccess(''), 3500);
  };

  // Handle Display Banner Image Upload
  const handleBannerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressingBanner(true);
    try {
      const compressed = await compressImageFile(file, 1200, 1200);
      setBannerForm(prev => ({ ...prev, image: compressed }));
    } catch (err: any) {
      console.warn('Failed to compress banner image:', err);
    } finally {
      setIsCompressingBanner(false);
    }
  };

  // Open Add Display Banner Modal
  const handleOpenAddBanner = () => {
    setEditingBannerId(null);
    setBannerForm({
      title: 'Monsoon Special Botanical Offer',
      subtitle: 'Get 25% extra discount on clean herbal formulas this week.',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200',
      badge: 'Limited Time Deal',
      buttonText: 'Explore Offer',
      categoryLink: categories[0] || 'All',
      theme: 'rose',
      position: 'top',
      active: true
    });
    setIsBannerModalOpen(true);
  };

  // Open Edit Display Banner Modal
  const handleOpenEditBanner = (banner: DisplayBanner) => {
    setEditingBannerId(banner.id);
    setBannerForm({
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      badge: banner.badge || '',
      buttonText: banner.buttonText,
      categoryLink: banner.categoryLink,
      theme: banner.theme,
      position: banner.position,
      active: banner.active
    });
    setIsBannerModalOpen(true);
  };

  // Submit Display Banner Form
  const handleSubmitBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBannerId) {
      updateHomepageBanner(editingBannerId, bannerForm);
      setBannerSuccess('Banner updated!');
    } else {
      addHomepageBanner(bannerForm);
      setBannerSuccess('New Promo Banner added!');
    }
    setIsBannerModalOpen(false);
    setTimeout(() => setBannerSuccess(''), 3000);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 font-serif">Hero Banners & Storefront Banners</h2>
          <p className="text-xs text-stone-500">
            Upload custom hero banner images with direct store links and manage promotional display banners
          </p>
        </div>

        <button
          onClick={handleOpenAddHero}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Hero Banner</span>
        </button>
      </div>

      {/* Global Success Banner */}
      {heroSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{heroSuccess}</span>
        </div>
      )}

      {/* SECTION 0: MAIN HERO BANNER QUICK EDITOR */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-serif flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Main Homepage Hero Banner Image & Content
            </h3>
            <p className="text-xs text-stone-500">
              Directly edit and upload the primary featured hero banner image displayed at the very top of your storefront homepage
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setMainConfigForm(heroBannerConfig);
              setIsEditingMainConfig(!isEditingMainConfig);
            }}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5 text-stone-600" />
            <span>{isEditingMainConfig ? 'Close Quick Editor' : 'Edit Main Hero Content'}</span>
          </button>
        </div>

        {/* Live Main Banner Preview */}
        <div className="relative h-60 sm:h-72 w-full rounded-2xl overflow-hidden bg-stone-900 shadow-inner group">
          <img
            src={heroBannerConfig?.bgImage || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1600'}
            alt="Main Hero Banner"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/50 to-transparent flex flex-col justify-center p-6 sm:p-10 space-y-2 text-white">
            {heroBannerConfig?.featurePill && (
              <span className="inline-block px-3 py-1 bg-amber-400/90 text-stone-950 font-extrabold text-[10px] tracking-wider uppercase rounded-full self-start backdrop-blur-md shadow-xs">
                {heroBannerConfig.featurePill}
              </span>
            )}
            <h2 className="text-xl sm:text-2xl font-serif font-bold leading-tight max-w-md drop-shadow-sm">
              {heroBannerConfig?.headline || 'DISCOVER Healthy, Glowing Skin'}
            </h2>
            <p className="text-xs text-stone-200 max-w-md drop-shadow-xs">
              {heroBannerConfig?.subheadline || 'Premium Skincare for Every You'}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md">
                <span>{heroBannerConfig?.ctaText || 'SHOP NOW'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
          <div className="absolute top-3 right-3 bg-stone-900/80 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
            Active Storefront Hero
          </div>
        </div>

        {/* Inline Quick Editor Form */}
        {isEditingMainConfig && (
          <form onSubmit={handleSaveMainConfig} className="p-5 bg-stone-50 border border-stone-200 rounded-2xl space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Banner Image Upload & URL */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs font-bold text-stone-800">
                  Upload Main Banner Image File or Enter URL *
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="url"
                    required
                    value={mainConfigForm.bgImage}
                    onChange={e => setMainConfigForm(prev => ({ ...prev, bgImage: e.target.value }))}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/30"
                  />
                  <label className="cursor-pointer px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 shadow-xs">
                    {isCompressingMain ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                        <span>Optimizing Image...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-amber-300" />
                        <span>Upload Image File</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainBannerFileUpload}
                      disabled={isCompressingMain}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[10px] text-stone-500">
                  Select any high-res image file from your device. It will automatically be compressed and saved safely!
                </p>
              </div>

              {/* Headline */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">Headline Text</label>
                <input
                  type="text"
                  required
                  value={mainConfigForm.headline}
                  onChange={e => setMainConfigForm(prev => ({ ...prev, headline: e.target.value }))}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/30"
                />
              </div>

              {/* Subheadline */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">Subheadline Text</label>
                <input
                  type="text"
                  value={mainConfigForm.subheadline}
                  onChange={e => setMainConfigForm(prev => ({ ...prev, subheadline: e.target.value }))}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/30"
                />
              </div>

              {/* Feature Badge / Pill */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">Feature Pill Badge Text</label>
                <input
                  type="text"
                  value={mainConfigForm.featurePill}
                  onChange={e => setMainConfigForm(prev => ({ ...prev, featurePill: e.target.value }))}
                  placeholder="e.g. 100% Pure Botanical Formulations"
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/30"
                />
              </div>

              {/* CTA Button Text */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">CTA Button Text</label>
                <input
                  type="text"
                  value={mainConfigForm.ctaText}
                  onChange={e => setMainConfigForm(prev => ({ ...prev, ctaText: e.target.value }))}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/30"
                />
              </div>

              {/* CTA Link Destination */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-bold text-stone-800">CTA Destination Category Link</label>
                <select
                  value={mainConfigForm.ctaLinkCategory}
                  onChange={e => setMainConfigForm(prev => ({ ...prev, ctaLinkCategory: e.target.value }))}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/30"
                >
                  <option value="All">All Categories</option>
                  {safeCategories.map(cat => (
                    <option key={cat} value={cat}>
                      Category: {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsEditingMainConfig(false)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCompressingMain}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Main Hero Banner</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* SECTION 1: HERO BANNER IMAGE SLIDES MANAGER */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-serif flex items-center gap-2">
              <Layout className="w-5 h-5 text-rose-500" />
              Homepage Hero Banner Images ({safeHeroSlides.length})
            </h3>
            <p className="text-xs text-stone-500">
              Upload custom banner images. Visitors clicking on these hero banners will be taken directly to the specified destination link.
            </p>
          </div>

          <button
            onClick={handleOpenAddHero}
            className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Upload Banner Image
          </button>
        </div>

        {/* Hero Slides Grid */}
        {safeHeroSlides.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-stone-200 rounded-3xl space-y-3">
            <ImageIcon className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="text-sm font-bold text-stone-700">No Hero Banner Images Uploaded</p>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Upload your custom designed hero banner poster image to display at the top of the homepage.
            </p>
            <button
              onClick={handleOpenAddHero}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2 mt-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload First Banner</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeHeroSlides.map((slide, idx) => (
              <div
                key={slide.id}
                className={`bg-stone-50 rounded-2xl border overflow-hidden transition-all flex flex-col justify-between ${
                  slide.active ? 'border-stone-200 shadow-xs' : 'border-stone-200/60 opacity-60'
                }`}
              >
                {/* Banner Image Preview */}
                <div className="relative h-44 w-full bg-stone-900 overflow-hidden group">
                  <img
                    src={slide.image}
                    alt={slide.title || `Hero Slide ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-stone-900/80 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md">
                    Slide #{idx + 1}
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleHeroSlide(slide.id)}
                      className={`p-1.5 rounded-full text-xs font-bold transition-all shadow-md ${
                        slide.active ? 'bg-emerald-500 text-white' : 'bg-stone-700 text-stone-300'
                      }`}
                      title={slide.active ? 'Active on Storefront' : 'Inactive'}
                    >
                      {slide.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Info & Link */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-stone-900 truncate">
                      {slide.title || `Hero Slide ${idx + 1}`}
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      slide.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                    }`}>
                      {slide.active ? 'Active' : 'Hidden'}
                    </span>
                  </div>

                  <div className="text-[11px] text-stone-600 flex items-center gap-1.5 bg-white p-2 rounded-xl border border-stone-200 truncate">
                    <LinkIcon className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="font-semibold text-stone-700 truncate">
                      Link: {slide.linkUrl || 'All Catalog'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-200/80">
                    <button
                      type="button"
                      onClick={() => handleOpenEditHero(slide)}
                      className="px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-stone-500" />
                      <span>Edit Link / Picture</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteHeroSlide(slide.id)}
                      className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all"
                      title="Delete Hero Slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: PROMO DISPLAY BANNERS */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-serif flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-500" />
              Secondary Storefront Promo Cards ({safeHomepageBanners.length})
            </h3>
            <p className="text-xs text-stone-500">
              Manage feature discount strips and seasonal promo campaign banners shown across the store
            </p>
          </div>

          <button
            onClick={handleOpenAddBanner}
            className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Promo Card
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {safeHomepageBanners.map(banner => (
            <div
              key={banner.id}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                banner.active ? 'bg-stone-50 border-stone-200' : 'bg-stone-100/60 border-stone-200/60 opacity-60'
              }`}
            >
              <div className="relative h-32 rounded-xl overflow-hidden bg-stone-900">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                {banner.badge && (
                  <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {banner.badge}
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{banner.title}</h4>
                <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">{banner.subtitle}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-xs">
                <button
                  type="button"
                  onClick={() => toggleHomepageBanner(banner.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                    banner.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {banner.active ? 'Active' : 'Disabled'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditBanner(banner)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-lg"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteHomepageBanner(banner.id)}
                    className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HERO BANNER UPLOAD MODAL */}
      {isHeroModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="text-lg font-bold text-stone-900 font-serif flex items-center gap-2">
                <Upload className="w-5 h-5 text-rose-500" />
                {editingHeroId ? 'Edit Hero Banner Image & Link' : 'Upload Hero Banner Image'}
              </h3>
              <button
                onClick={() => setIsHeroModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {heroError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl">
                {heroError}
              </div>
            )}

            <form onSubmit={handleSubmitHeroSlide} className="space-y-4">
              {/* Banner Image Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-800 block">
                  Select Banner Image File or Enter URL:
                </label>

                {/* Image Preview */}
                {heroSlideForm.image && (
                  <div className="relative h-40 rounded-2xl overflow-hidden border border-stone-200 bg-stone-900 shadow-inner">
                    <img
                      src={heroSlideForm.image}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 bg-stone-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md">
                      Preview
                    </div>
                  </div>
                )}

                {/* Upload File Button */}
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs shrink-0">
                    {isCompressingHero ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                        <span>Optimizing Image...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-amber-300" />
                        <span>Choose Banner Image File</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroFileUpload}
                      disabled={isCompressingHero}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-stone-400">or paste URL below</span>
                </div>

                <input
                  type="text"
                  value={heroSlideForm.image}
                  onChange={e => setHeroSlideForm(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>

              {/* Banner Title / Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-800 block">
                  Banner Label / Title:
                </label>
                <input
                  type="text"
                  value={heroSlideForm.title || ''}
                  onChange={e => setHeroSlideForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Festive Glow Special Offer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>

              {/* Destination Link Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-800 block">
                  Click Destination Link (Category or External URL):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={safeCategories.includes(heroSlideForm.linkUrl) ? heroSlideForm.linkUrl : 'custom'}
                    onChange={e => {
                      if (e.target.value !== 'custom') {
                        setHeroSlideForm(prev => ({ ...prev, linkUrl: e.target.value }));
                      }
                    }}
                    className="px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  >
                    <option value="All">All Catalog</option>
                    {safeCategories.map(cat => (
                      <option key={cat} value={cat}>
                        Category: {cat}
                      </option>
                    ))}
                    <option value="custom">Custom URL...</option>
                  </select>

                  <input
                    type="text"
                    value={heroSlideForm.linkUrl}
                    onChange={e => setHeroSlideForm(prev => ({ ...prev, linkUrl: e.target.value }))}
                    placeholder="or https://..."
                    className="px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  />
                </div>
                <p className="text-[10px] text-stone-500 pt-0.5">
                  When visitors click this hero banner image, it will filter to this category or navigate to this URL.
                </p>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="heroActive"
                  checked={heroSlideForm.active}
                  onChange={e => setHeroSlideForm(prev => ({ ...prev, active: e.target.checked }))}
                  className="w-4 h-4 text-rose-600 rounded-sm border-stone-300 focus:ring-rose-500"
                />
                <label htmlFor="heroActive" className="text-xs font-bold text-stone-800">
                  Active (Display on Storefront Hero Slider)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsHeroModalOpen(false)}
                  className="px-4 py-2.5 text-stone-600 text-xs font-bold hover:bg-stone-100 rounded-xl transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-md"
                >
                  {editingHeroId ? 'Save Changes' : 'Upload & Add Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROMO DISPLAY BANNER MODAL */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900 font-serif">
                {editingBannerId ? 'Edit Promo Card' : 'Add Promo Card'}
              </h3>
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitBanner} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-800 block">Title:</label>
                <input
                  type="text"
                  required
                  value={bannerForm.title}
                  onChange={e => setBannerForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-800 block">Subtitle:</label>
                <input
                  type="text"
                  required
                  value={bannerForm.subtitle}
                  onChange={e => setBannerForm(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-800 block">Image URL / Upload:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={bannerForm.image}
                    onChange={e => setBannerForm(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                  <label className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl cursor-pointer shrink-0">
                    Upload
                    <input type="file" accept="image/*" onChange={handleBannerFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-800 block">Category Link:</label>
                <select
                  value={bannerForm.categoryLink}
                  onChange={e => setBannerForm(prev => ({ ...prev, categoryLink: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                >
                  <option value="All">All Categories</option>
                  {safeCategories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-3 py-2 text-xs text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
