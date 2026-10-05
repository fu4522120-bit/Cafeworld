import React from 'react';
import { OrderMode } from '../types';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentTab: 'menu' | 'cart' | 'admin' | 'receipt';
  orderMode: OrderMode;
  onSelectTab: (tab: 'menu' | 'cart' | 'admin' | 'receipt') => void;
  onSelectOrderMode: (mode: OrderMode) => void;
  cartCount: number;
  tableNumber: string;
  isSoundMuted: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  orderMode,
  onSelectTab,
  onSelectOrderMode,
  cartCount,
  tableNumber,
  isSoundMuted,
  onToggleSound,
}) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'cart':
        return 'Cart & Checkout';
      case 'admin':
        return 'Live KDS Kitchen';
      case 'receipt':
        return 'Order Tracking';
      default:
        return 'Johar Town Menu';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 pt-safe bg-[#131316]/90 backdrop-blur-xl border-b border-white/5 transition-all">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex flex-col gap-2">
        {/* Top Row: Logo, Status & Fast Actions */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {/* Logo SVG */}
            <button 
              onClick={() => onSelectTab('menu')}
              className="text-left focus:outline-none flex items-center gap-1 group"
              aria-label="Coffee Planet Home"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" className="h-8 w-auto" fill="none">
                <rect width="320" height="80" rx="12" fill="#131316"/>
                <circle cx="48" cy="40" r="22" stroke="#C67C4E" strokeWidth="3" fill="#1B1B1E"/>
                <path d="M40 45C40 48.5 43.5 51 48 51C52.5 51 56 48.5 56 45V34H40V45Z" fill="#C67C4E"/>
                <path d="M56 37H59C60.5 37 61.5 38 61.5 39.5C61.5 41 60.5 42 59 42H56" stroke="#C67C4E" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M44 29C44 26 47 25 45 22" stroke="#E0A96D" strokeWidth="2" strokeLinecap="round"/>
                <path d="M51 29C51 26 54 25 52 22" stroke="#E0A96D" strokeWidth="2" strokeLinecap="round"/>
                <text x="82" y="44" fill="#FFFFFF" fontFamily="'Epilogue', 'Montserrat', sans-serif" fontWeight="900" fontSize="24" letterSpacing="1.5">coffee<tspan fill="#C67C4E">planet</tspan></text>
                <text x="84" y="58" fill="#9CA3AF" fontFamily="'Epilogue', sans-serif" fontWeight="600" fontSize="9" letterSpacing="3.5">JOHAR TOWN</text>
              </svg>
            </button>

            {/* Branch status tag */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#1b1b1e] border border-white/5 px-2.5 py-1 rounded-full text-xs text-[#d8c2b7]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-space text-[11px] font-medium">Open till 3 AM · Johar Town</span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={onToggleSound}
              title={isSoundMuted ? 'Unmute sounds' : 'Mute sounds'}
              className="w-9 h-9 rounded-full bg-[#1b1b1e] text-[#d8c2b7] hover:text-[#ffb68c] flex items-center justify-center border border-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isSoundMuted ? 'volume_off' : 'volume_up'}
              </span>
            </button>

            {/* Search shortcut button */}
            <button
              onClick={() => {
                onSelectTab('menu');
                const searchEl = document.getElementById('menu-search-input');
                if (searchEl) searchEl.focus();
              }}
              aria-label="Search Menu"
              className="w-9 h-9 rounded-full bg-[#1b1b1e] text-[#d8c2b7] hover:text-[#ffb68c] flex items-center justify-center border border-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
            </button>

            {/* Cart quick button */}
            <button
              onClick={() => onSelectTab('cart')}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2a2a2d] hover:bg-[#c97f50] text-[#e4e1e6] hover:text-white transition-all border border-white/5 font-space text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-[17px]">shopping_bag</span>
              <span>{cartCount}</span>
            </button>

            {/* Barista KDS jump */}
            <button
              onClick={() => onSelectTab('admin')}
              className={`px-2.5 py-1.5 rounded-full text-[11px] font-space font-medium border transition-colors flex items-center gap-1 ${
                currentTab === 'admin'
                  ? 'bg-[#c97f50] text-[#481d00] font-bold border-[#ffb68c]'
                  : 'bg-[#1b1b1e] text-[#d8c2b7] border-white/5 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
              <span>KDS</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Tab Title & Dining Mode Selector */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="font-headline font-bold text-base sm:text-lg text-[#ffb68c] tracking-tight">
              {getTabTitle()}
            </span>
            {orderMode === 'dine-in' && (
              <span className="text-xs text-[#a08d83] font-space">
                · Table {tableNumber}
              </span>
            )}
          </div>

          {/* Dining mode switcher */}
          <div className="inline-flex p-0.5 bg-[#0e0e11] rounded-full border border-white/5">
            <button
              onClick={() => onSelectOrderMode('dine-in')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-space font-semibold transition-all flex items-center gap-1 ${
                orderMode === 'dine-in'
                  ? 'bg-[#c97f50] text-[#481d00] shadow-sm font-bold'
                  : 'text-[#a08d83] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">table_restaurant</span>
              <span>Dine-In</span>
            </button>
            <button
              onClick={() => onSelectOrderMode('takeaway')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-space font-semibold transition-all flex items-center gap-1 ${
                orderMode === 'takeaway'
                  ? 'bg-[#c97f50] text-[#481d00] shadow-sm font-bold'
                  : 'text-[#a08d83] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">shopping_bag</span>
              <span>Takeaway</span>
            </button>
            <button
              onClick={() => onSelectOrderMode('delivery')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-space font-semibold transition-all flex items-center gap-1 ${
                orderMode === 'delivery'
                  ? 'bg-[#c97f50] text-[#481d00] shadow-sm font-bold'
                  : 'text-[#a08d83] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">two_wheeler</span>
              <span>Delivery</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
