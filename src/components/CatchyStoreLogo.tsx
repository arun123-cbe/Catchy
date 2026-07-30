import React from 'react';
import { useStore } from '../context/StoreContext';

interface CatchyStoreLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const CatchyStoreLogo: React.FC<CatchyStoreLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true
}) => {
  const { customLogoUrl } = useStore();

  const heights = {
    sm: 'h-9',
    md: 'h-12 sm:h-14',
    lg: 'h-16 sm:h-20'
  };

  const imgHeights = {
    sm: 'max-h-9',
    md: 'max-h-12 sm:max-h-14',
    lg: 'max-h-16 sm:max-h-20'
  };

  if (customLogoUrl) {
    return (
      <div className={`flex items-center gap-2 select-none ${className}`}>
        <img
          src={customLogoUrl}
          alt="CatchyStore Logo"
          className={`${imgHeights[size]} w-auto object-contain transition-transform hover:scale-[1.02]`}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <svg
        viewBox="0 0 540 180"
        className={`${heights[size]} w-auto object-contain transition-transform hover:scale-[1.02]`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="pinkRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="50%" stopColor="#db2777" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>

          <linearGradient id="bagGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>

          <linearGradient id="textPinkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>

        {/* --- LEFT ICON: Circular Ring & Shopping Bag Woman Silhouette --- */}
        <g transform="translate(10, 10)">
          {/* Outer Ring */}
          <circle
            cx="75"
            cy="75"
            r="68"
            stroke="url(#pinkRingGrad)"
            strokeWidth="7"
            strokeDasharray="400 15"
            fill="none"
          />

          {/* Sparkles on Ring */}
          <path
            d="M 132 40 L 135 48 L 143 51 L 135 54 L 132 62 L 129 54 L 121 51 L 129 48 Z"
            fill="#fbbf24"
          />
          <path
            d="M 125 75 A 5 5 0 1 1 125 74.9"
            fill="#e11d48"
          />

          {/* Shopping Bag Base */}
          <rect
            x="40"
            y="42"
            width="70"
            height="80"
            rx="12"
            fill="url(#bagGrad)"
          />

          {/* Shopping Bag Handles */}
          <path
            d="M 58 42 C 58 24, 92 24, 92 42"
            stroke="#1c1917"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Woman Silhouette on Bag */}
          <path
            d="M 52 110 C 50 90, 62 82, 68 76 C 72 72, 70 65, 68 62 C 66 59, 70 54, 76 56 C 80 57, 83 62, 80 68 C 77 74, 82 82, 86 86 C 88 88, 86 100, 78 108"
            stroke="#ffffff"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          {/* Flowing Hair Waves */}
          <path
            d="M 60 70 C 52 80, 50 95, 58 112"
            stroke="#ffffff"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 64 72 C 58 84, 56 98, 64 112"
            stroke="#ffffff"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* --- RIGHT TYPOGRAPHY: CatchyStore --- */}
        {/* "Catchy" Text */}
        <text
          x="165"
          y="102"
          fontFamily="Playfair Display, Georgia, serif"
          fontWeight="800"
          fontSize="76"
          fill="url(#textPinkGrad)"
          letterSpacing="-1"
        >
          Catchy
        </text>

        {/* Leaf Accent on 'y' */}
        <g transform="translate(322, 38)">
          <path
            d="M 12 18 C 22 2, 38 4, 38 4 C 38 4, 38 22, 22 28 C 16 30, 12 26, 12 18 Z"
            fill="#e11d48"
          />
          <path
            d="M 6 34 C 18 20, 30 22, 30 22 C 30 22, 28 36, 16 40 C 10 42, 6 38, 6 34 Z"
            fill="#f43f5e"
          />
        </g>

        {/* "Store" Text */}
        <text
          x="355"
          y="102"
          fontFamily="Playfair Display, Georgia, serif"
          fontWeight="700"
          fontSize="76"
          fill="#18181b"
          letterSpacing="-1"
        >
          Store
        </text>

        {/* Sparkle Stars over "Store" */}
        <g transform="translate(438, 42)" fill="#e11d48">
          <path d="M 12 0 L 14 7 L 21 9 L 14 11 L 12 18 L 10 11 L 3 9 L 10 7 Z" />
          <path d="M 24 10 L 25 14 L 29 15 L 25 16 L 24 20 L 23 16 L 19 15 L 23 14 Z" />
          <path d="M 5 18 L 6 21 L 9 22 L 6 23 L 5 26 L 4 23 L 1 22 L 4 21 Z" />
        </g>

        {/* --- BOTTOM TAGLINE: THE BEAUTY STORE --- */}
        {showTagline && (
          <g transform="translate(165, 125)">
            {/* Left Accent Bar */}
            <line x1="0" y1="18" x2="42" y2="18" stroke="#e11d48" strokeWidth="2.5" />
            <circle cx="48" cy="18" r="3.5" fill="#e11d48" />

            {/* Subtext */}
            <text
              x="62"
              y="22"
              fontFamily="System-UI, -apple-system, sans-serif"
              fontWeight="900"
              fontSize="16"
              fill="#18181b"
              letterSpacing="6"
            >
              THE BEAUTY STORE
            </text>

            {/* Right Accent Bar */}
            <circle cx="304" cy="18" r="3.5" fill="#e11d48" />
            <line x1="310" y1="18" x2="352" y2="18" stroke="#e11d48" strokeWidth="2.5" />
          </g>
        )}
      </svg>
    </div>
  );
};
