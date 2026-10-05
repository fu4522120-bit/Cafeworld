import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, MenuItem } from '../types';

interface KDSAdminProps {
  orders: Order[];
  menuItems: MenuItem[];
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  onToggleItemAvailability: (itemId: string) => void;
  onSimulateOrder: () => void;
  onClearHistory: () => void;
}

export const KDSAdmin: React.FC<KDSAdminProps> = ({
  orders,
  menuItems,
  onUpdateOrderStatus,
  onToggleItemAvailability,
  onSimulateOrder,
  onClearHistory,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | OrderStatus>('all');
  const [searchTicket, setSearchTicket] = useState('');
  const [showItemManager, setShowItemManager] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch =
      searchTicket.trim() === '' ||
      order.ticketNumber.toLowerCase().includes(searchTicket.toLowerCase()) ||
      (order.tableNumber && order.tableNumber.includes(searchTicket)) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchTicket.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Calculate live statistics
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.grandTotal, 0);
  const inKitchenCount = orders.filter((o) => o.status === 'new' || o.status === 'preparing').length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;

  const getElapsedTime = (createdAt: number) => {
    const elapsedMinutes = Math.floor((Date.now() - createdAt) / 60000);
    return elapsedMinutes;
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto text-[#e4e1e6] pb-16 space-y-6">
      {/* Top Station Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1b1b1e] border border-white/5 px-4 py-3.5 rounded-2xl shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0"></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-space text-xs font-bold text-[#ffb68c] uppercase tracking-wider">
                Johar Town Station 01
              </span>
              <span className="text-[11px] font-space text-[#a08d83]">· KDS Dispatch Online</span>
            </div>
            <p className="text-xs text-[#d8c2b7]">
              Real-time synchronization with kitchen baristas and POS terminal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Live digital clock */}
          <div className="flex items-center gap-1.5 bg-[#131316] border border-white/5 px-3 py-1.5 rounded-xl font-space text-xs font-bold text-white">
            <span className="material-symbols-outlined text-[16px] text-[#f5bc7e]">schedule</span>
            <span>{currentTime || '02:14:38 AM'}</span>
          </div>

          {/* Quick Simulate Order Button */}
          <button
            onClick={onSimulateOrder}
            title="Inject simulated order to test kitchen flow"
            className="px-3 py-1.5 bg-[#2a2a2d] hover:bg-[#353438] text-[#ffb68c] rounded-xl text-xs font-space font-semibold border border-white/5 flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span className="hidden sm:inline">Simulate Order</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#1b1b1e] border border-white/5 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
          <span className="text-xs font-space text-[#a08d83]">Today's Revenue</span>
          <div className="font-space text-lg sm:text-xl font-bold text-white mt-1">
            Rs. {totalRevenue.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400 font-space mt-1">
            {orders.length} tickets processed
          </span>
        </div>

        <div className="bg-[#1b1b1e] border border-white/5 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
          <span className="text-xs font-space text-[#a08d83]">In Kitchen</span>
          <div className="font-space text-lg sm:text-xl font-bold text-[#f5bc7e] mt-1">
            {inKitchenCount} Orders
          </div>
          <span className="text-[10px] text-[#a08d83] font-space mt-1">
            Active on line
          </span>
        </div>

        <div className="bg-[#1b1b1e] border border-white/5 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
          <span className="text-xs font-space text-[#a08d83]">Ready for Service</span>
          <div className="font-space text-lg sm:text-xl font-bold text-[#ffb68c] mt-1">
            {readyCount} Orders
          </div>
          <span className="text-[10px] text-[#ffb68c] font-space mt-1">
            Counter / Pass
          </span>
        </div>

        <div className="bg-[#1b1b1e] border border-white/5 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
          <span className="text-xs font-space text-[#a08d83]">Avg Prep Speed</span>
          <div className="font-space text-lg sm:text-xl font-bold text-white mt-1">
            11.4 mins
          </div>
          <span className="text-[10px] text-[#a08d83] font-space mt-1">
            Target &lt; 15 mins
          </span>
        </div>
      </div>

      {/* Ticket Controls: Filter Bar & 86 Item Toggle Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1b1b1e] border border-white/5 p-3 rounded-2xl">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Tickets' },
            { id: 'new', label: 'New' },
            { id: 'preparing', label: 'Preparing' },
            { id: 'ready', label: 'Ready' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as 'all' | OrderStatus)}
              className={`px-3 py-1.5 rounded-xl font-space text-xs transition-colors shrink-0 ${
                filterStatus === tab.id
                  ? 'bg-[#c97f50] text-[#321200] font-bold shadow-sm'
                  : 'text-[#a08d83] hover:text-white hover:bg-[#2a2a2d]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search ticket input & 86 toggle */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search #CP or Table..."
            value={searchTicket}
            onChange={(e) => setSearchTicket(e.target.value)}
            className="bg-[#131316] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-[#a08d83]/70 focus:outline-none focus:border-[#ffb68c] w-36 sm:w-44"
          />
          <button
            onClick={() => setShowItemManager(!showItemManager)}
            className={`px-3 py-1.5 rounded-xl text-xs font-space font-semibold border transition-colors flex items-center gap-1 shrink-0 ${
              showItemManager
                ? 'bg-[#ffb68c] text-[#321200] border-[#ffb68c]'
                : 'bg-[#2a2a2d] hover:bg-[#353438] text-white border-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">inventory_2</span>
            <span>Item 86</span>
          </button>
        </div>
      </div>

      {/* Item Availability / 86 Drawer */}
      {showItemManager && (
        <div className="bg-[#1b1b1e] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffb68c]">inventory</span>
              <h4 className="font-headline font-semibold text-white text-sm">
                Kitchen Item Availability (86 Stock Controller)
              </h4>
            </div>
            <span className="text-[11px] font-space text-[#a08d83]">
              Toggling an item "Sold Out" instantly hides it from customer cart
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1 no-scrollbar">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#131316] border border-white/5 text-xs font-space"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-white truncate font-medium">{item.name}</p>
                  <p className="text-[10px] text-[#a08d83]">Rs. {item.price}</p>
                </div>
                <button
                  onClick={() => onToggleItemAvailability(item.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                    item.isAvailable
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900'
                      : 'bg-red-950 text-red-400 border border-red-500/30 hover:bg-red-900'
                  }`}
                >
                  {item.isAvailable ? 'In Stock' : 'Sold Out (86)'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Kitchen Tickets Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-lg sm:text-xl text-white font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffb68c]">receipt_long</span>
            <span>Active Kitchen Tickets</span>
            <span className="font-space text-xs text-[#a08d83]">
              ({filteredOrders.length} shown)
            </span>
          </h2>

          {completedCount > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs font-space text-[#a08d83] hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">archive</span>
              <span>Archive Completed</span>
            </button>
          )}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-[#1b1b1e] border border-white/5 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined text-4xl text-[#a08d83]">check_circle</span>
            <p className="font-space text-sm text-[#d8c2b7]">All stations clear!</p>
            <p className="text-xs text-[#a08d83]">No active orders matching the selected filter</p>
            <button
              onClick={onSimulateOrder}
              className="mt-2 px-4 py-2 bg-[#c97f50] hover:bg-[#ffb68c] text-[#321200] font-space font-bold text-xs rounded-xl transition-all"
            >
              Simulate Customer Ticket
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => {
              const elapsedMinutes = getElapsedTime(order.createdAt);
              const isOverdue = elapsedMinutes > 15;
              const isWarning = elapsedMinutes > 10;

              return (
                <div
                  key={order.id}
                  className={`bg-[#1b1b1e] border rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-lg transition-all ${
                    order.status === 'completed'
                      ? 'opacity-60 border-white/5'
                      : order.status === 'ready'
                      ? 'border-[#ffb68c]/40 ring-1 ring-[#ffb68c]/20'
                      : order.status === 'preparing'
                      ? 'border-[#f5bc7e]/30'
                      : 'border-white/10'
                  }`}
                >
                  {/* Ticket Header */}
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-space font-bold text-base text-[#ffb68c]">
                          {order.ticketNumber}
                        </span>
                        {/* Elapsed Timer */}
                        <span
                          className={`font-space text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            isOverdue
                              ? 'bg-red-950 text-red-300 animate-pulse border border-red-500/40'
                              : isWarning
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                              : 'bg-[#131316] text-[#a08d83]'
                          }`}
                        >
                          {elapsedMinutes}m ago
                        </span>
                      </div>

                      {/* Location & Mode */}
                      <p className="text-xs text-[#d8c2b7] font-space mt-0.5">
                        {order.orderMode === 'dine-in' && `Table ${order.tableNumber || '07'} · Dine-In`}
                        {order.orderMode === 'takeaway' && 'Takeaway Counter Pickup'}
                        {order.orderMode === 'delivery' && `Delivery · ${order.deliveryAddress || 'Johar Town'}`}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {order.status === 'new' && (
                        <span className="px-2.5 py-1 rounded-full bg-[#f5bc7e] text-[#482900] font-space font-bold text-[10px] uppercase tracking-wider">
                          New Order
                        </span>
                      )}
                      {order.status === 'preparing' && (
                        <span className="px-2.5 py-1 rounded-full bg-[#67400d] text-[#e5ae71] font-space font-bold text-[10px] uppercase tracking-wider">
                          Preparing
                        </span>
                      )}
                      {order.status === 'ready' && (
                        <span className="px-2.5 py-1 rounded-full bg-[#c97f50] text-[#321200] font-space font-bold text-[10px] uppercase tracking-wider">
                          Ready for Pass
                        </span>
                      )}
                      {order.status === 'completed' && (
                        <span className="px-2.5 py-1 rounded-full bg-[#2a2a2d] text-[#a08d83] font-space font-bold text-[10px] uppercase tracking-wider">
                          Archived
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="bg-[#131316] border border-white/5 rounded-xl p-3 space-y-2 flex-grow">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-xs font-space">
                        <div className="flex items-center justify-between text-white font-medium">
                          <span>
                            <strong className="text-[#ffb68c] mr-1">{item.quantity}x</strong>{' '}
                            {item.name}
                          </span>
                          <span className="text-[#a08d83] text-[11px]">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                        {item.customizationSummary && (
                          <p className="text-[11px] text-[#a08d83] pl-4 italic">
                            ↳ {item.customizationSummary}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-[11px] text-[#f5bc7e] pl-4 font-medium">
                            Note: "{item.notes}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Customer & Total Row */}
                  <div className="flex items-center justify-between text-xs font-space pt-1 text-[#a08d83]">
                    <span>Total: Rs. {order.grandTotal.toLocaleString()}</span>
                    <span>{order.customerPhone || 'Johar Town'}</span>
                  </div>

                  {/* KDS Action Trigger Button */}
                  <div className="pt-1">
                    {order.status === 'new' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#c97f50] hover:bg-[#ffb68c] text-[#321200] font-space font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-[0.98]"
                      >
                        <span className="material-symbols-outlined text-[17px]">skillet</span>
                        <span>Accept & Start Prep</span>
                      </button>
                    )}

                    {order.status === 'preparing' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#2a2a2d] hover:bg-[#353438] text-[#ffb68c] hover:text-white font-space font-bold text-xs border border-white/10 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                      >
                        <span className="material-symbols-outlined text-[17px]">notifications_active</span>
                        <span>Mark as Ready for Pickup</span>
                      </button>
                    )}

                    {order.status === 'ready' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'completed')}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#1b1b1e] hover:bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-space font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                      >
                        <span className="material-symbols-outlined text-[17px]">check_circle</span>
                        <span>Dispatch & Complete</span>
                      </button>
                    )}

                    {order.status === 'completed' && (
                      <div className="text-center text-xs font-space text-[#a08d83] py-1">
                        Order Dispatched & Completed
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
