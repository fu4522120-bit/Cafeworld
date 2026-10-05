import React, { useState } from 'react';
import { CartItem, OrderMode } from '../types';

interface CartViewProps {
  cart: CartItem[];
  orderMode: OrderMode;
  tableNumber: string;
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
  onSelectOrderMode: (mode: OrderMode) => void;
  onUpdateTableNumber: (table: string) => void;
  onPlaceOrder: (orderDetails: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    discountAmount: number;
    promoCodeApplied: string;
  }) => void;
  onGoToMenu: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cart,
  orderMode,
  tableNumber,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSelectOrderMode,
  onUpdateTableNumber,
  onPlaceOrder,
  onGoToMenu,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number; fixed: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  
  // Delivery & Customer fields
  const [customerName, setCustomerName] = useState('Ahmed Raza');
  const [customerPhone, setCustomerPhone] = useState('0300-4821902');
  const [selectedBlock, setSelectedBlock] = useState('Block G3 (Johar Town)');
  const [streetAddress, setStreetAddress] = useState('House 42, Street 8');
  const [kitchenNotes, setKitchenNotes] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  // Discount calculation
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.percent > 0) {
      discountAmount = Math.round((subtotal * appliedPromo.percent) / 100);
    } else if (appliedPromo.fixed > 0) {
      discountAmount = Math.min(subtotal, appliedPromo.fixed);
    }
  }

  // Delivery fee
  const deliveryFee = orderMode === 'delivery' ? 120 : 0;

  // Punjab Restaurant GST (16% on taxable amount)
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const gst = Math.round(taxableAmount * 0.16);
  const grandTotal = taxableAmount + gst + deliveryFee;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();

    if (code === 'JOHAR20') {
      setAppliedPromo({ code, percent: 20, fixed: 0 });
    } else if (code === 'COFFEE10') {
      setAppliedPromo({ code, percent: 10, fixed: 0 });
    } else if (code === 'FLAT150') {
      setAppliedPromo({ code, percent: 0, fixed: 150 });
    } else {
      setPromoError('Invalid code. Try JOHAR20 or COFFEE10');
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const fullDeliveryAddress = orderMode === 'delivery' ? `${streetAddress}, ${selectedBlock}` : '';
    onPlaceOrder({
      customerName,
      customerPhone,
      deliveryAddress: fullDeliveryAddress,
      discountAmount,
      promoCodeApplied: appliedPromo?.code || '',
    });
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto text-[#e4e1e6] pb-16 space-y-6">
      {/* 1. Dining Mode Selector Card */}
      <div className="bg-[#1b1b1e] border border-white/5 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-space font-semibold text-[#a08d83] uppercase tracking-wider">
            Order Experience
          </span>
          <span className="text-xs font-space text-[#ffb68c]">
            Johar Town Branch #01
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 p-1 bg-[#0e0e11] rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => onSelectOrderMode('dine-in')}
            className={`py-2.5 px-2 rounded-lg font-space text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              orderMode === 'dine-in'
                ? 'bg-[#c97f50] text-[#321200] font-bold shadow-md'
                : 'text-[#a08d83] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">table_restaurant</span>
            <span>Dine-In</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectOrderMode('takeaway')}
            className={`py-2.5 px-2 rounded-lg font-space text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              orderMode === 'takeaway'
                ? 'bg-[#c97f50] text-[#321200] font-bold shadow-md'
                : 'text-[#a08d83] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
            <span>Takeaway</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectOrderMode('delivery')}
            className={`py-2.5 px-2 rounded-lg font-space text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              orderMode === 'delivery'
                ? 'bg-[#c97f50] text-[#321200] font-bold shadow-md'
                : 'text-[#a08d83] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">two_wheeler</span>
            <span>Delivery</span>
          </button>
        </div>

        {/* Dynamic Mode Form Details */}
        {orderMode === 'dine-in' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 bg-[#131316] p-3 rounded-xl border border-white/5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffb68c] text-[20px]">pin_drop</span>
              <div>
                <p className="text-xs font-semibold text-white font-space">Johar Town Cafe Table</p>
                <p className="text-[11px] text-[#a08d83]">Your order will be served directly to your seat</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="table-select" className="text-xs text-[#d8c2b7] font-space font-medium">Table #:</label>
              <select
                id="table-select"
                value={tableNumber}
                onChange={(e) => onUpdateTableNumber(e.target.value)}
                className="bg-[#1b1b1e] border border-white/10 rounded-lg px-3 py-1.5 text-xs font-space font-bold text-[#ffb68c] focus:outline-none focus:border-[#ffb68c]"
              >
                {Array.from({ length: 24 }, (_, i) => {
                  const num = (i + 1).toString().padStart(2, '0');
                  return (
                    <option key={num} value={num}>
                      Table {num}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        )}

        {orderMode === 'takeaway' && (
          <div className="bg-[#131316] p-3 rounded-xl border border-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-space">
              <span className="text-white font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#f5bc7e] text-[18px]">alarm</span>
                Estimated Ready Time:
              </span>
              <span className="text-[#ffb68c] font-bold">12 - 15 mins</span>
            </div>
            <p className="text-[11px] text-[#a08d83]">
              Pickup from barista counter at Coffee Planet Johar Town (Opposite Emporium Mall road, Johar Town Lahore).
            </p>
          </div>
        )}

        {orderMode === 'delivery' && (
          <div className="bg-[#131316] p-3.5 rounded-xl border border-white/5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-space text-[#a08d83] block mb-1">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#1b1b1e] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ffb68c]"
                />
              </div>
              <div>
                <label className="text-[11px] font-space text-[#a08d83] block mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#1b1b1e] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ffb68c]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-space text-[#a08d83] block mb-1">Johar Town Sector / Block</label>
                <select
                  value={selectedBlock}
                  onChange={(e) => setSelectedBlock(e.target.value)}
                  className="w-full bg-[#1b1b1e] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ffb68c]"
                >
                  <option value="Block G3 (Johar Town)">Block G3 (Johar Town)</option>
                  <option value="Block G2 (Johar Town)">Block G2 (Johar Town)</option>
                  <option value="Block R1 / Phase 2">Block R1 / Phase 2</option>
                  <option value="Block F (Shaukat Khanum Rd)">Block F (Shaukat Khanum Rd)</option>
                  <option value="Block J3 (Doctor Hospital Rd)">Block J3 (Doctor Hospital Rd)</option>
                  <option value="PIA Main Boulevard">PIA Main Boulevard</option>
                  <option value="Faisal Town / Model Town Ext">Faisal Town / Model Town Ext</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-space text-[#a08d83] block mb-1">House / Apartment & Street</label>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full bg-[#1b1b1e] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ffb68c]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Cart Items List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-lg sm:text-xl text-white font-bold flex items-center gap-2">
            <span>Your Selection</span>
            <span className="font-space text-xs text-[#ffb68c]">
              ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
            </span>
          </h2>
          {cart.length > 0 && (
            <button
              onClick={onClearCart}
              className="text-xs font-space text-[#a08d83] hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-[#1b1b1e] border border-white/5 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined text-4xl text-[#a08d83]">shopping_cart</span>
            <p className="font-space text-sm text-[#d8c2b7]">Your cart is currently empty</p>
            <p className="text-xs text-[#a08d83]">Craving artisan espresso, frappes or gourmet breakfast?</p>
            <button
              onClick={onGoToMenu}
              className="mt-2 px-5 py-2.5 rounded-xl bg-[#c97f50] hover:bg-[#ffb68c] text-[#321200] font-space font-bold text-xs shadow-md transition-all"
            >
              Browse Johar Town Menu
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {cart.map((cartItem) => {
              const { item, customization, quantity, totalPrice, id } = cartItem;

              return (
                <div
                  key={id}
                  className="bg-[#1b1b1e] border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-grow">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#0e0e11] border border-white/5"
                    />
                    <div className="min-w-0 flex-grow">
                      <h4 className="font-headline font-semibold text-white text-sm sm:text-base truncate">
                        {item.name}
                      </h4>
                      <p className="font-space text-xs text-[#ffb68c] font-bold">
                        Rs. {(totalPrice / quantity).toLocaleString()} each
                      </p>

                      {/* Customization Details without pill tags */}
                      {customization && (
                        <div className="text-[11px] text-[#a08d83] font-space mt-1 space-y-0.5">
                          <p>
                            {[customization.size, customization.milk, customization.sweetness]
                              .filter(Boolean)
                              .join(' · ')}
                            {customization.extraShot && ' · +Extra Shot'}
                          </p>
                          {customization.notes && (
                            <p className="italic text-[#d8c2b7]">Note: "{customization.notes}"</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper and Total Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    <div className="flex items-center bg-[#0e0e11] rounded-xl p-1 border border-white/5">
                      <button
                        onClick={() => onUpdateQuantity(id, -1)}
                        className="w-7 h-7 rounded-lg bg-[#2a2a2d] hover:bg-[#353438] text-white flex items-center justify-center font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="w-7 text-center font-space font-bold text-xs text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(id, 1)}
                        className="w-7 h-7 rounded-lg bg-[#2a2a2d] hover:bg-[#353438] text-white flex items-center justify-center font-bold text-xs"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-[90px]">
                      <span className="font-space font-bold text-sm sm:text-base text-white">
                        Rs. {totalPrice.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => onRemoveItem(id)}
                      className="text-[#a08d83] hover:text-red-400 p-1.5 transition-colors"
                      title="Remove item"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <>
          {/* 3. Promo Code Form */}
          <div className="bg-[#1b1b1e] border border-white/5 rounded-2xl p-4 shadow-md">
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promo Code (e.g. JOHAR20)"
                className="flex-grow bg-[#131316] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase placeholder:text-[#a08d83]/70 focus:outline-none focus:border-[#ffb68c]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#2a2a2d] hover:bg-[#353438] text-[#ffb68c] font-space font-bold text-xs rounded-xl transition-colors shrink-0"
              >
                Apply
              </button>
            </form>
            {appliedPromo && (
              <div className="mt-2 text-xs font-space text-emerald-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>
                  Code {appliedPromo.code} applied! (-Rs {discountAmount.toLocaleString()})
                </span>
              </div>
            )}
            {promoError && (
              <div className="mt-2 text-xs font-space text-red-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{promoError}</span>
              </div>
            )}
          </div>

          {/* 4. Bill Breakdown */}
          <div className="bg-[#1b1b1e] border border-white/5 rounded-2xl p-5 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="font-headline font-semibold text-base text-white">Bill Breakdown</span>
              <span className="font-space text-[11px] text-[#a08d83]">
                NTN: 418290-7 (PRA Registered)
              </span>
            </div>

            <div className="space-y-2 text-xs font-space text-[#d8c2b7]">
              <div className="flex justify-between items-center">
                <span>Items Subtotal</span>
                <span className="text-white">Rs. {subtotal.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-emerald-400">
                  <span>Promo Discount ({appliedPromo?.code})</span>
                  <span>- Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>Punjab Restaurant GST (16%)</span>
                <span className="text-white">Rs. {gst.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>{orderMode === 'delivery' ? 'Delivery Fee' : 'Service Charge'}</span>
                <span className={deliveryFee === 0 ? 'text-[#f5bc7e]' : 'text-white'}>
                  {deliveryFee === 0 ? 'Rs. 0 (Complimentary)' : `Rs. ${deliveryFee}`}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#a08d83] block">Grand Total Payable</span>
                <span className="text-[11px] text-[#a08d83]/70">Cash or POS Card upon delivery/serve</span>
              </div>
              <span className="font-space text-xl sm:text-2xl text-[#ffb68c] font-bold">
                Rs. {grandTotal.toLocaleString()}
              </span>
            </div>

            {/* Submit Order Action Button */}
            <button
              onClick={handleCheckout}
              className="w-full py-4 px-6 rounded-xl bg-[#c97f50] hover:bg-[#ffb68c] text-[#321200] font-headline font-bold text-base tracking-wide flex items-center justify-center gap-2 shadow-2xl hover:shadow-[#c97f50]/20 active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">local_cafe</span>
              <span>Transmit Order to Kitchen (Rs. {grandTotal.toLocaleString()})</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
