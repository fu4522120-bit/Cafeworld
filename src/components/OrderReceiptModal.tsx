import React from 'react';
import { Order } from '../types';

interface OrderReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onTrackInKDS: () => void;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({
  order,
  isOpen,
  onClose,
  onTrackInKDS,
}) => {
  if (!isOpen || !order) return null;

  const steps = [
    { key: 'new', label: 'Order Received', icon: 'done' },
    { key: 'preparing', label: 'Brewing & Cooking', icon: 'skillet' },
    { key: 'ready', label: 'Ready for Service', icon: 'local_cafe' },
    { key: 'completed', label: 'Served / Dispatched', icon: 'celebration' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.status);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-[#1b1b1e] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#2a2a2d] p-5 text-center relative border-b border-white/5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#131316]/70 hover:bg-[#131316] text-[#a08d83] hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>

          <div className="w-12 h-12 rounded-full bg-[#c97f50] text-[#321200] mx-auto flex items-center justify-center mb-2 shadow-lg">
            <span className="material-symbols-outlined text-[26px]">coffee</span>
          </div>
          <h3 className="font-headline font-bold text-xl text-white">Order Confirmed!</h3>
          <p className="font-space text-xs text-[#ffb68c] mt-0.5 font-bold">
            Ticket {order.ticketNumber}
          </p>
          <p className="text-[11px] text-[#a08d83]">
            Transmitted to Coffee Planet Johar Town Kitchen
          </p>
        </div>

        {/* Live Stepper Tracker */}
        <div className="p-5 overflow-y-auto space-y-5 no-scrollbar">
          <div className="bg-[#131316] border border-white/5 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-space">
              <span className="text-white font-bold">Live Status</span>
              <span className="text-[#f5bc7e]">
                Estimated Ready: ~{order.estimatedMinutes} mins
              </span>
            </div>

            {/* Stepper Dots */}
            <div className="relative flex items-center justify-between pt-2">
              <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-white/10 z-0" />
              {steps.map((step, idx) => {
                const isPassed = idx <= activeIndex;
                const isCurrent = idx === activeIndex;

                return (
                  <div key={step.key} className="relative z-10 flex flex-col items-center gap-1.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-[#ffb68c] text-[#321200] ring-4 ring-[#ffb68c]/20'
                          : isPassed
                          ? 'bg-[#c97f50] text-[#321200]'
                          : 'bg-[#2a2a2d] text-[#a08d83]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">{step.icon}</span>
                    </div>
                    <span
                      className={`text-[9px] font-space text-center max-w-[60px] leading-tight ${
                        isCurrent
                          ? 'text-[#ffb68c] font-bold'
                          : isPassed
                          ? 'text-white'
                          : 'text-[#a08d83]'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Receipt Breakdown */}
          <div className="bg-[#131316] border border-white/5 rounded-2xl p-4 space-y-3 text-xs font-space">
            <div className="flex justify-between items-start border-b border-white/5 pb-2">
              <div>
                <p className="text-white font-bold">
                  {order.orderMode === 'dine-in' && `Dine-In · Table ${order.tableNumber || '07'}`}
                  {order.orderMode === 'takeaway' && 'Counter Takeaway'}
                  {order.orderMode === 'delivery' && `Delivery to ${order.deliveryAddress}`}
                </p>
                <p className="text-[10px] text-[#a08d83]">
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Johar Town Branch #01
                </p>
              </div>
              <span className="text-[10px] text-[#a08d83] text-right">NTN: 418290-7</span>
            </div>

            {/* Items */}
            <div className="space-y-2">
              {order.items.map((i, idx) => (
                <div key={idx} className="flex justify-between text-[#d8c2b7]">
                  <div className="min-w-0 pr-2">
                    <span className="text-white font-medium">
                      {i.quantity}x {i.name}
                    </span>
                    {i.customizationSummary && (
                      <p className="text-[10px] text-[#a08d83]">{i.customizationSummary}</p>
                    )}
                  </div>
                  <span className="text-white shrink-0">
                    Rs. {(i.price * i.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-2 border-t border-white/5 space-y-1 text-[#a08d83]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {order.subtotal.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>- Rs. {order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Punjab GST (16%)</span>
                <span>Rs. {order.tax.toLocaleString()}</span>
              </div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>Rs. {order.deliveryFee}</span>
                </div>
              )}
              <div className="flex justify-between text-white font-bold text-sm pt-1 border-t border-white/5">
                <span>Grand Total</span>
                <span className="text-[#ffb68c]">Rs. {order.grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-[#131316] border-t border-white/5 flex gap-2">
          <button
            onClick={onTrackInKDS}
            className="flex-1 py-3 px-4 rounded-xl bg-[#c97f50] hover:bg-[#ffb68c] text-[#321200] font-space font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-[17px]">soup_kitchen</span>
            <span>View Live Kitchen Screen</span>
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-[#2a2a2d] hover:bg-[#353438] text-white font-space text-xs font-semibold transition-all"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};
