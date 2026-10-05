import React, { useState, useEffect } from 'react';
import { MenuItem, CustomizationSelection } from '../types';

interface ItemModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, customization: CustomizationSelection, quantity: number) => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({ item, isOpen, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedMilk, setSelectedMilk] = useState<string>('');
  const [selectedSweetness, setSelectedSweetness] = useState<string>('');
  const [extraShot, setExtraShot] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (item) {
      setSelectedSize(item.sizes && item.sizes.length > 0 ? item.sizes[0].name : '');
      setSelectedMilk(item.milkOptions && item.milkOptions.length > 0 ? item.milkOptions[0] : '');
      setSelectedSweetness(item.sweetnessLevels && item.sweetnessLevels.length > 0 ? item.sweetnessLevels[0] : '');
      setExtraShot(false);
      setNotes('');
      setQuantity(1);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  // Calculate customized unit price
  let unitPrice = item.price;
  if (item.sizes && selectedSize) {
    const sizeObj = item.sizes.find(s => s.name === selectedSize);
    if (sizeObj) unitPrice += sizeObj.priceDiff;
  }
  if (selectedMilk.includes('+Rs 120')) unitPrice += 120;
  if (selectedMilk.includes('+Rs 150')) unitPrice += 150;
  if (extraShot) unitPrice += 150;

  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    const customization: CustomizationSelection = {
      size: selectedSize || undefined,
      milk: selectedMilk || undefined,
      sweetness: selectedSweetness || undefined,
      extraShot,
      notes: notes.trim() || undefined,
      unitPrice,
    };
    onAddToCart(item, customization, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-[#1b1b1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header image & close button */}
        <div className="relative h-44 w-full bg-[#0e0e11] shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b1e] via-[#1b1b1e]/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#0e0e11]/80 hover:bg-[#0e0e11] text-white flex items-center justify-center border border-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
          
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="font-headline text-xl text-white font-bold">{item.name}</h3>
            <p className="text-xs text-[#d8c2b7] line-clamp-1">{item.description}</p>
          </div>
        </div>

        {/* Scrollable Customization Options */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 no-scrollbar flex-grow">
          {/* Sizes */}
          {item.sizes && item.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-space font-semibold text-[#a08d83] uppercase tracking-wider block">
                Select Size
              </label>
              <div className="grid grid-cols-2 gap-2">
                {item.sizes.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setSelectedSize(s.name)}
                    className={`py-2 px-3 rounded-xl border text-xs font-space flex items-center justify-between transition-all ${
                      selectedSize === s.name
                        ? 'border-[#ffb68c] bg-[#ffb68c]/15 text-[#ffb68c] font-bold'
                        : 'border-white/5 bg-[#131316] text-[#d8c2b7] hover:border-white/20'
                    }`}
                  >
                    <span>{s.name}</span>
                    {s.priceDiff > 0 && <span>+Rs {s.priceDiff}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Milk Options */}
          {item.milkOptions && item.milkOptions.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-space font-semibold text-[#a08d83] uppercase tracking-wider block">
                Milk Selection
              </label>
              <div className="grid grid-cols-2 gap-2">
                {item.milkOptions.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMilk(m)}
                    className={`py-2 px-3 rounded-xl border text-xs font-space text-left transition-all ${
                      selectedMilk === m
                        ? 'border-[#ffb68c] bg-[#ffb68c]/15 text-[#ffb68c] font-bold'
                        : 'border-white/5 bg-[#131316] text-[#d8c2b7] hover:border-white/20'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sweetness */}
          {item.sweetnessLevels && item.sweetnessLevels.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-space font-semibold text-[#a08d83] uppercase tracking-wider block">
                Sweetness Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {item.sweetnessLevels.map((sw) => (
                  <button
                    key={sw}
                    type="button"
                    onClick={() => setSelectedSweetness(sw)}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-space text-center truncate transition-all ${
                      selectedSweetness === sw
                        ? 'border-[#ffb68c] bg-[#ffb68c]/15 text-[#ffb68c] font-bold'
                        : 'border-white/5 bg-[#131316] text-[#d8c2b7] hover:border-white/20'
                    }`}
                  >
                    {sw}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extra Shot Option */}
          {item.allowExtraShot && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#131316] border border-white/5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffb68c] text-[18px]">coffee</span>
                <span className="text-xs font-space font-semibold text-white">Extra Espresso Shot</span>
              </div>
              <button
                type="button"
                onClick={() => setExtraShot(!extraShot)}
                className={`px-3 py-1 rounded-full text-xs font-space transition-colors ${
                  extraShot
                    ? 'bg-[#c97f50] text-[#321200] font-bold'
                    : 'bg-[#2a2a2d] text-[#d8c2b7]'
                }`}
              >
                {extraShot ? 'Added (+Rs 150)' : '+Rs 150'}
              </button>
            </div>
          )}

          {/* Special Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-space font-semibold text-[#a08d83] uppercase tracking-wider block">
              Kitchen Instructions / Allergy Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Extra hot, less ice, crispy fries..."
              className="w-full bg-[#131316] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-[#a08d83]/60 focus:outline-none focus:border-[#ffb68c]"
            />
          </div>
        </div>

        {/* Footer with Quantity & Add Button */}
        <div className="p-4 bg-[#131316] border-t border-white/5 flex items-center justify-between gap-3 shrink-0">
          {/* Quantity Stepper */}
          <div className="flex items-center bg-[#0e0e11] rounded-xl p-1 border border-white/5">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg bg-[#2a2a2d] hover:bg-[#353438] text-white flex items-center justify-center font-bold text-sm"
            >
              -
            </button>
            <span className="w-8 text-center font-space font-bold text-sm text-white">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg bg-[#2a2a2d] hover:bg-[#353438] text-white flex items-center justify-center font-bold text-sm"
            >
              +
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAdd}
            className="flex-1 py-3 px-4 bg-[#c97f50] hover:bg-[#ffb68c] text-[#321200] rounded-xl font-space font-bold text-sm flex items-center justify-between shadow-lg active:scale-[0.98] transition-all"
          >
            <span>Add to Cart</span>
            <span>Rs. {totalPrice.toLocaleString()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
