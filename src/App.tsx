import React, { useState, useEffect } from 'react';
import { MenuItem, CartItem, Order, OrderMode, OrderStatus, CustomizationSelection } from './types';
import { INITIAL_MENU_ITEMS } from './data/menu';
import { Header } from './components/Header';
import { MenuCatalog } from './components/MenuCatalog';
import { ItemModal } from './components/ItemModal';
import { CartView } from './components/CartView';
import { KDSAdmin } from './components/KDSAdmin';
import { OrderReceiptModal } from './components/OrderReceiptModal';
import { BottomNav } from './components/BottomNav';
import { sound } from './utils/audio';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'menu' | 'cart' | 'admin' | 'receipt'>('menu');
  const [orderMode, setOrderMode] = useState<OrderMode>('dine-in');
  const [tableNumber, setTableNumber] = useState<string>('07');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Item customization modal
  const [activeModalItem, setActiveModalItem] = useState<MenuItem | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Pre-seed cart with initial items matching the prototype
  const [cart, setCart] = useState<CartItem[]>(() => {
    const platter = INITIAL_MENU_ITEMS.find((i) => i.id === 'cp-breakfast-platter')!;
    const frappe = INITIAL_MENU_ITEMS.find((i) => i.id === 'white-choc-caramel')!;
    return [
      {
        id: 'cart-init-1',
        item: platter,
        quantity: 1,
        totalPrice: platter.price,
      },
      {
        id: 'cart-init-2',
        item: frappe,
        quantity: 1,
        totalPrice: frappe.price,
      },
    ];
  });

  // Pre-seed orders matching Johar Town KDS
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-1043',
      ticketNumber: '#CP-1043',
      createdAt: Date.now() - 3 * 60 * 1000,
      orderMode: 'delivery',
      deliveryAddress: 'Johar Town Block G',
      customerName: 'Hamza Malik',
      customerPhone: '0321-9876543',
      subtotal: 2997,
      tax: 480,
      discount: 0,
      deliveryFee: 120,
      grandTotal: 3597,
      status: 'new',
      estimatedMinutes: 15,
      items: [
        { name: 'CP Special Chicken Burger', quantity: 2, price: 999 },
        { name: 'Cookies & Cream Frappe', quantity: 1, price: 999 },
      ],
    },
    {
      id: 'ord-1042',
      ticketNumber: '#CP-1042',
      createdAt: Date.now() - 8 * 60 * 1000,
      orderMode: 'dine-in',
      tableNumber: '07',
      customerName: 'Usman Ali',
      subtotal: 2194,
      tax: 351,
      discount: 0,
      deliveryFee: 0,
      grandTotal: 2545,
      status: 'preparing',
      estimatedMinutes: 12,
      items: [
        { name: 'Spanish Latte (Hot)', quantity: 1, price: 695 },
        { name: 'CP Special Breakfast Platter', quantity: 1, price: 1499 },
      ],
    },
  ]);

  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Sound toggle handler
  const handleToggleSound = () => {
    const next = !isSoundMuted;
    setIsSoundMuted(next);
    sound.setSoundEnabled(!next);
    showToast(next ? 'Sound Muted' : 'Sound Enabled');
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2400);
  };

  // Quick Add Item directly to cart
  const handleQuickAdd = (item: MenuItem) => {
    if (!item.isAvailable) {
      showToast(`${item.name} is currently sold out!`);
      return;
    }
    sound.playAddToCart();
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id && !i.customization);
      if (existing) {
        return prev.map((ci) =>
          ci.id === existing.id
            ? { ...ci, quantity: ci.quantity + 1, totalPrice: (ci.quantity + 1) * ci.item.price }
            : ci
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          item,
          quantity: 1,
          totalPrice: item.price,
        },
      ];
    });
    showToast(`Added ${item.name} to order`);
  };

  // Open item customizer
  const handleOpenCustomize = (item: MenuItem) => {
    setActiveModalItem(item);
    setIsCustomizerOpen(true);
  };

  // Add customized item
  const handleAddCustomizedItem = (
    item: MenuItem,
    customization: CustomizationSelection,
    quantity: number
  ) => {
    sound.playAddToCart();
    const lineTotal = customization.unitPrice * quantity;
    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      item,
      quantity,
      customization,
      totalPrice: lineTotal,
    };
    setCart((prev) => [...prev, newItem]);
    showToast(`Added ${quantity}x ${item.name} to order`);
  };

  // Update item quantity in cart
  const handleUpdateQuantity = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) => {
          if (ci.id === cartId) {
            const newQty = ci.quantity + delta;
            if (newQty <= 0) return null;
            const unitPrice = ci.customization ? ci.customization.unitPrice : ci.item.price;
            return {
              ...ci,
              quantity: newQty,
              totalPrice: newQty * unitPrice,
            };
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Remove single item from cart
  const handleRemoveItem = (cartId: string) => {
    setCart((prev) => prev.filter((ci) => ci.id !== cartId));
    showToast('Item removed from cart');
  };

  // Clear cart
  const handleClearCart = () => {
    setCart([]);
    showToast('Cart cleared');
  };

  // Place Order -> Transmit to KDS
  const handlePlaceOrder = (details: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    discountAmount: number;
    promoCodeApplied: string;
  }) => {
    if (cart.length === 0) return;

    sound.playOrderBell();

    const subtotal = cart.reduce((acc, i) => acc + i.totalPrice, 0);
    const taxable = Math.max(0, subtotal - details.discountAmount);
    const tax = Math.round(taxable * 0.16);
    const deliveryFee = orderMode === 'delivery' ? 120 : 0;
    const grandTotal = taxable + tax + deliveryFee;

    const ticketNumber = `#CP-${1040 + orders.length + 1}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      ticketNumber,
      createdAt: Date.now(),
      orderMode,
      tableNumber: orderMode === 'dine-in' ? tableNumber : undefined,
      deliveryAddress: orderMode === 'delivery' ? details.deliveryAddress : undefined,
      customerName: details.customerName,
      customerPhone: details.customerPhone,
      subtotal,
      discount: details.discountAmount,
      tax,
      deliveryFee,
      grandTotal,
      status: 'new',
      estimatedMinutes: orderMode === 'delivery' ? 25 : 12,
      items: cart.map((ci) => {
        let customizationSummary = '';
        if (ci.customization) {
          const parts = [
            ci.customization.size,
            ci.customization.milk,
            ci.customization.sweetness,
            ci.customization.extraShot ? 'Extra Shot' : null,
          ].filter(Boolean);
          customizationSummary = parts.join(' · ');
        }
        return {
          name: ci.item.name,
          quantity: ci.quantity,
          price: ci.customization ? ci.customization.unitPrice : ci.item.price,
          notes: ci.customization?.notes,
          customizationSummary: customizationSummary || undefined,
        };
      }),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    setIsReceiptOpen(true);
    setCart([]);
    showToast(`Order ${ticketNumber} transmitted to Johar Town kitchen!`);
  };

  // KDS Status Transition
  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    if (nextStatus === 'ready' || nextStatus === 'completed') {
      sound.playOrderComplete();
    }
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
    if (lastPlacedOrder && lastPlacedOrder.id === orderId) {
      setLastPlacedOrder((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }
    showToast(`Order status updated to ${nextStatus}`);
  };

  // 86 Out of Stock toggle
  const handleToggleItemAvailability = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const nextState = !item.isAvailable;
          showToast(`${item.name} is now ${nextState ? 'In Stock' : 'Marked 86 (Sold Out)'}`);
          return { ...item, isAvailable: nextState };
        }
        return item;
      })
    );
  };

  // Simulate an incoming order for live testing
  const handleSimulateOrder = () => {
    sound.playOrderBell();
    const demoItems = [
      { name: 'Artisan Velvet Latte', quantity: 1, price: 712 },
      { name: 'Molten Belgian Lava Cake', quantity: 1, price: 850 },
    ];
    const subtotal = 1562;
    const tax = Math.round(subtotal * 0.16);
    const simulated: Order = {
      id: `ord-${Date.now()}`,
      ticketNumber: `#CP-${1040 + orders.length + 1}`,
      createdAt: Date.now(),
      orderMode: 'dine-in',
      tableNumber: String(Math.floor(Math.random() * 20) + 1).padStart(2, '0'),
      customerName: 'Walk-in Guest',
      subtotal,
      discount: 0,
      tax,
      deliveryFee: 0,
      grandTotal: subtotal + tax,
      status: 'new',
      estimatedMinutes: 10,
      items: demoItems,
    };
    setOrders((prev) => [simulated, ...prev]);
    showToast(`Incoming ticket ${simulated.ticketNumber} arrived at KDS!`);
  };

  const handleClearHistory = () => {
    setOrders((prev) => prev.filter((o) => o.status !== 'completed'));
    showToast('Archived completed tickets');
  };

  const activeOrdersCount = orders.filter((o) => o.status === 'new' || o.status === 'preparing').length;
  const totalCartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#131316] text-[#e4e1e6] flex flex-col font-sans selection:bg-[#ffb68c]/30 selection:text-[#ffb68c]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300">
          <div className="bg-[#2a2a2d]/95 backdrop-blur-md text-white border border-white/10 px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 text-xs font-space font-medium">
            <span className="material-symbols-outlined text-[#ffb68c] text-[18px]">info</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main App Header */}
      <Header
        currentTab={currentTab}
        orderMode={orderMode}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectOrderMode={setOrderMode}
        cartCount={totalCartCount}
        tableNumber={tableNumber}
        isSoundMuted={isSoundMuted}
        onToggleSound={handleToggleSound}
      />

      {/* Main Body Content Container */}
      <main className="flex-grow pt-28 sm:pt-32 pb-24 px-4 max-w-4xl mx-auto w-full">
        {currentTab === 'menu' && (
          <MenuCatalog
            items={menuItems}
            onQuickAdd={handleQuickAdd}
            onCustomize={handleOpenCustomize}
          />
        )}

        {currentTab === 'cart' && (
          <CartView
            cart={cart}
            orderMode={orderMode}
            tableNumber={tableNumber}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onSelectOrderMode={setOrderMode}
            onUpdateTableNumber={setTableNumber}
            onPlaceOrder={handlePlaceOrder}
            onGoToMenu={() => setCurrentTab('menu')}
          />
        )}

        {currentTab === 'admin' && (
          <KDSAdmin
            orders={orders}
            menuItems={menuItems}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onToggleItemAvailability={handleToggleItemAvailability}
            onSimulateOrder={handleSimulateOrder}
            onClearHistory={handleClearHistory}
          />
        )}

        {currentTab === 'receipt' && (
          <div className="space-y-6">
            <div className="bg-[#1b1b1e] border border-white/5 rounded-2xl p-6 text-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-[#ffb68c]">receipt_long</span>
              <h2 className="font-headline text-2xl text-white font-bold">Track Your Johar Town Order</h2>
              <p className="text-xs text-[#d8c2b7] max-w-md mx-auto">
                Real-time connection with our baristas in Johar Town, Lahore.
              </p>
            </div>

            {lastPlacedOrder ? (
              <div className="bg-[#1b1b1e] border border-white/5 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div>
                    <span className="text-xs font-space text-[#a08d83]">Active Ticket</span>
                    <h3 className="font-space text-xl font-bold text-[#ffb68c]">
                      {lastPlacedOrder.ticketNumber}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#c97f50] text-[#321200] font-space font-bold text-xs uppercase">
                    Status: {lastPlacedOrder.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-space">
                  {lastPlacedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-[#d8c2b7]">
                      <span>{it.quantity}x {it.name}</span>
                      <span className="text-white">Rs. {(it.price * it.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-space">
                  <span className="text-[#a08d83]">Grand Total (with 16% GST)</span>
                  <span className="font-bold text-base text-[#ffb68c]">
                    Rs. {lastPlacedOrder.grandTotal.toLocaleString()}
                  </span>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => setIsReceiptOpen(true)}
                    className="flex-1 py-2.5 px-4 bg-[#2a2a2d] hover:bg-[#353438] text-white rounded-xl font-space text-xs font-semibold transition-colors"
                  >
                    View Digital Receipt
                  </button>
                  <button
                    onClick={() => setCurrentTab('admin')}
                    className="flex-1 py-2.5 px-4 bg-[#c97f50] hover:bg-[#ffb68c] text-[#321200] rounded-xl font-space font-bold text-xs transition-colors"
                  >
                    Watch Live on KDS
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#1b1b1e] border border-white/5 rounded-2xl p-8 text-center text-xs font-space text-[#a08d83]">
                No recent orders placed yet. Add items from the menu to transmit a ticket!
              </div>
            )}
          </div>
        )}
      </main>

      {/* Item Customizer Modal */}
      <ItemModal
        item={activeModalItem}
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        onAddToCart={handleAddCustomizedItem}
      />

      {/* Order Digital Receipt & Status Modal */}
      <OrderReceiptModal
        order={lastPlacedOrder}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        onTrackInKDS={() => {
          setIsReceiptOpen(false);
          setCurrentTab('admin');
        }}
      />

      {/* Floating Cart Pill on Mobile when browsing Menu */}
      {currentTab === 'menu' && totalCartCount > 0 && (
        <div className="fixed bottom-20 inset-x-0 z-30 px-4 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <button
              onClick={() => {
                setCurrentTab('cart');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3.5 px-5 bg-[#c97f50] hover:bg-[#ffb68c] text-[#321200] rounded-2xl font-space font-bold text-sm shadow-2xl flex items-center justify-between active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#321200] text-[#ffb68c] text-xs flex items-center justify-center font-bold">
                  {totalCartCount}
                </span>
                <span>View Cart</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>
                  Rs.{' '}
                  {cart
                    .reduce((sum, item) => sum + item.totalPrice, 0)
                    .toLocaleString()}
                </span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Sticky Navigation */}
      <BottomNav
        currentTab={currentTab}
        cartCount={totalCartCount}
        activeOrdersCount={activeOrdersCount}
        hasPlacedOrders={orders.length > 0}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
