import React from 'react';
import { MenuItem } from '../types';

interface HeroBannerProps {
  item: MenuItem;
  onQuickAdd: (item: MenuItem) => void;
  onCustomize: (item: MenuItem) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ item, onQuickAdd, onCustomize }) => {
  return (
    <div className="relative w-full rounded-2xl bg-[#1b1b1e] border border-white/5 shadow-2xl overflow-hidden mb-6">
      {/* Ambient background glow */}
      <div className="absolute -top-16 -right-16 w-60 h-60 bg-[#ffb68c]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-[#c97f50]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row relative">
        {/* Banner image with overlay */}
        <div className="relative w-full md:w-5/12 h-56 md:h-auto overflow-hidden bg-[#0e0e11] shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b1e] via-[#1b1b1e]/30 to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#1b1b1e]" />
          
          {/* Subtle status tag */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#0e0e11]/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffb68c] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffb68c]"></span>
            </span>
            <span className="font-space text-[10px] text-[#ffdbc9] uppercase tracking-wider font-semibold">
              Johar Roastery Special
            </span>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#0e0e11]/80 backdrop-blur-md px-2 py-1 rounded-full border border-white/10 shadow-sm text-xs font-space font-semibold text-[#f5bc7e]">
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            <span>{item.rating}</span>
            <span className="text-[#a08d83] text-[10px]">({item.reviewsCount})</span>
          </div>
        </div>

        {/* Banner Details */}
        <div className="p-5 md:p-6 flex flex-col justify-between flex-grow gap-4 relative z-10">
          <div className="flex flex-col gap-2">
            {/* Clean metadata line without pills */}
            <div className="flex items-center gap-2 text-xs text-[#d8c2b7] font-space">
              <span className="text-[#ffb68c] font-bold">Chef's Signature Blend</span>
              <span aria-hidden="true" className="text-[#53443b]">·</span>
              <span>20% OFF Limited Time</span>
              <span aria-hidden="true" className="text-[#53443b]">·</span>
              <span>Single Origin Arabica</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1">
              <h2 className="font-headline text-2xl md:text-3xl text-white font-bold tracking-tight">
                {item.name}
              </h2>
              <div className="flex items-baseline gap-2">
                {item.originalPrice && (
                  <span className="font-space text-xs text-[#a08d83] line-through">
                    Rs. {item.originalPrice}
                  </span>
                )}
                <span className="font-space text-xl md:text-2xl text-[#ffb68c] font-bold">
                  Rs. {item.price}
                </span>
              </div>
            </div>

            <p className="text-sm text-[#d8c2b7] leading-relaxed line-clamp-2 md:line-clamp-3">
              {item.description}
            </p>
          </div>

          {/* Interactive CTA buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onQuickAdd(item)}
              className="flex-1 py-3 px-5 bg-[#c97f50] hover:bg-[#ffb68c] text-[#321200] rounded-xl font-space font-bold text-sm shadow-lg hover:shadow-[#c97f50]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
              <span>Claim Offer & Add (Rs. {item.price})</span>
            </button>
            <button
              onClick={() => onCustomize(item)}
              className="py-3 px-4 bg-[#2a2a2d] hover:bg-[#353438] text-[#e4e1e6] rounded-xl font-space text-sm font-semibold border border-white/5 active:scale-[0.98] transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>Customize</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
