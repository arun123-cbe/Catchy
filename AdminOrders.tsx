import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface WideSkincareHeroBannerProps {
  onOpenQuiz?: () => void;
}

export const WideSkincareHeroBanner: React.FC<WideSkincareHeroBannerProps> = () => {
  const { heroSlides, heroBannerConfig, setSelectedCategory } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Active slides list
  const activeSlides = (heroSlides && heroSlides.length > 0)
    ? heroSlides.filter(s => s && s.active !== false)
    : [
        {
          id: 'default-hero',
          image: heroBannerConfig?.bgImage || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1600',
          linkUrl: heroBannerConfig?.ctaLinkCategory || 'All',
          title: 'Main Hero Banner',
          active: true
        }
      ];

  const slidesToRender = activeSlides.length > 0 ? activeSlides : [
    {
      id: 'fallback-hero',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1600',
      linkUrl: 'All',
      title: 'Fallback Banner',
      active: true
    }
  ];

  // Auto-slide effect
  useEffect(() => {
    if (isPaused || slidesToRender.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slidesToRender.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, slidesToRender.length]);

  const activeSlide = slidesToRender[currentSlide] || slidesToRender[0];

  const handleBannerClick = (linkUrl?: string) => {
    const targetLink = linkUrl || 'All';
    if (targetLink.startsWith('http://') || targetLink.startsWith('https://')) {
      window.open(targetLink, '_blank', 'noopener,noreferrer');
      return;
    }

    // Category or Store catalog scroll
    if (targetLink && targetLink !== 'All' && targetLink !== 'catalog') {
      setSelectedCategory(targetLink);
    } else {
      setSelectedCategory('All');
    }

    const catElem = document.getElementById('catalog');
    if (catElem) {
      catElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 my-2 sm:my-4 animate-fade-in">
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/80 shadow-lg bg-stone-900 group"
      >
        {/* CLICKABLE HERO BANNER IMAGE */}
        <div
          onClick={() => handleBannerClick(activeSlide.linkUrl)}
          className="relative w-full h-48 sm:h-72 md:h-96 lg:h-[420px] cursor-pointer overflow-hidden bg-stone-100"
        >
          <img
            key={activeSlide.id || `slide-${currentSlide}`}
            src={activeSlide.image}
            alt={activeSlide.title || 'Hero Banner'}
            className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
          />

          {/* Subtle click indicator pill if a link exists */}
          {activeSlide.linkUrl && (
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-stone-900/80 hover:bg-stone-900 text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20 shadow-md flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
              <span>Explore Collection</span>
              <ExternalLink className="w-3 h-3 text-amber-300" />
            </div>
          )}
        </div>

        {/* SLIDER PREV / NEXT ARROWS (Visible if > 1 slide) */}
        {slidesToRender.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(prev => (prev === 0 ? slidesToRender.length - 1 : prev - 1));
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-stone-900 shadow-md border border-stone-200 flex items-center justify-center transition-all hover:scale-110"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(prev => (prev + 1) % slidesToRender.length);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-stone-900 shadow-md border border-stone-200 flex items-center justify-center transition-all hover:scale-110"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* DOTS PAGINATION */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
              {slidesToRender.map((_, idx) => (
                <button
                  key={`dot-${idx}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === idx ? 'w-6 bg-amber-400' : 'w-2 bg-white/60 hover:bg-white'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
