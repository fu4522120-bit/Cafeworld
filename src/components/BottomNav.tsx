import React from 'react';

interface BottomNavProps {
  currentTab: 'menu' | 'cart' | 'admin' | 'receipt';
  cartCount: number;
  activeOrdersCount: number;
  hasPlacedOrders: boolean;
  onSelectTab: (tab: 'menu' | 'cart' | 'admin' | 'receipt') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  cartCount,
  activeOrdersCount,
  hasPlacedOrders,
  onSelectTab,
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-[#131316]/90 backdrop-blur-xl border-t border-white/5 transition-all">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-4">
        {/* Menu Tab */}
        <button
          onClick={() => onSelectTab('menu')}
          className={`flex flex-col items-center justify-center w-16 h-12 transition-colors ${
            currentTab === 'menu' ? 'text-[#ffb68c]' : 'text-[#a08d83] hover:text-[#d8c2b7]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: currentTab === 'menu' ? "'FILL' 1" : "'FILL' 0" }}
          >
            local_cafe
          </span>
          <span className="font-space text-[10px] mt-1 font-semibold">Menu</span>
        </button>

        {/* Cart Tab */}
        <button
          onClick={() => onSelectTab('cart')}
          className={`relative flex flex-col items-center justify-center w-16 h-12 transition-colors ${
            currentTab === 'cart' ? 'text-[#ffb68c]' : 'text-[#a08d83] hover:text-[#d8c2b7]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: currentTab === 'cart' ? "'FILL' 1" : "'FILL' 0" }}
          >
            shopping_bag
          </span>
          {cartCount > 0 && (
            <span className="absolute top-1 right-3 bg-[#c97f50] text-[#321200] font-space text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow">
              {cartCount}
            </span>
          )}
          <span className="font-space text-[10px] mt-1 font-semibold">Cart</span>
        </button>

        {/* Live KDS Admin */}
        <button
          onClick={() => onSelectTab('admin')}
          className={`relative flex flex-col items-center justify-center w-16 h-12 transition-colors ${
            currentTab === 'admin' ? 'text-[#ffb68c]' : 'text-[#a08d83] hover:text-[#d8c2b7]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: currentTab === 'admin' ? "'FILL' 1" : "'FILL' 0" }}
          >
            tune
          </span>
          {activeOrdersCount > 0 && (
            <span className="absolute top-1 right-2.5 bg-amber-500 text-black font-space text-[10px] px-1 h-4 min-w-[16px] rounded-full flex items-center justify-center font-bold">
              {activeOrdersCount}
            </span>
          )}
          <span className="font-space text-[10px] mt-1 font-semibold">KDS</span>
        </button>

        {/* Track Order / Receipt Tab */}
        {hasPlacedOrders && (
          <button
            onClick={() => onSelectTab('receipt')}
            className={`relative flex flex-col items-center justify-center w-16 h-12 transition-colors ${
              currentTab === 'receipt' ? 'text-[#ffb68c]' : 'text-[#a08d83] hover:text-[#d8c2b7]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: currentTab === 'receipt' ? "'FILL' 1" : "'FILL' 0" }}
            >
              receipt_long
            </span>
            <span className="font-space text-[10px] mt-1 font-semibold">Track</span>
          </button>
        )}
      </div>
    </nav>
  );
};
