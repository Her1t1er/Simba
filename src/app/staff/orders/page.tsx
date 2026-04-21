'use client';

import React, { useState, useMemo } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrderStore, Order } from '@/store/useOrderStore';
import { 
  CheckCircle2, 
  Clock, 
  Package, 
  Search, 
  ExternalLink, 
  User, 
  Mail, 
  Phone, 
  ArrowLeft,
  CheckSquare,
  Square,
  BadgeAlert,
  Wallet
} from 'lucide-react';
import Image from 'next/image';

export default function StaffDashboard() {
  const { user } = useAuthStore();
  const { orders, updatePrepaymentStatus, updateOrderStatus, toggleStockVerification } = useOrderStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter orders for this specific branch
  const branchOrders = useMemo(() => {
    return orders.filter(o => 
      o.branch === user?.managedBranch && 
      (o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || o.id.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [orders, user, searchQuery]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price) + ' RWF';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'ready_for_pickup': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'processing': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-800';
    }
  };

  const isOrderFullyVerified = (order: Order) => {
    return order.prepaymentStatus === 'verified' && 
           order.stockVerifiedItems.length === order.items.length;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-black dark:text-white mb-2">Branch Orders</h1>
        <p className="text-gray-500">Managing orders for <span className="font-bold text-orange-600">{user?.managedBranch}</span></p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-card-border shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-600">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Incoming</p>
              <p className="text-2xl font-black text-black dark:text-white">
                {branchOrders.filter(o => o.orderStatus === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-card-border shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600">
              <Package size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Processing</p>
              <p className="text-2xl font-black text-black dark:text-white">
                {branchOrders.filter(o => o.orderStatus === 'processing').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-card-border shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-green-600">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Ready</p>
              <p className="text-2xl font-black text-black dark:text-white">
                {branchOrders.filter(o => o.orderStatus === 'ready_for_pickup').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Orders List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-600">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by Order ID or Customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-card-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white shadow-sm"
            />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-card-border overflow-hidden shadow-sm">
            {branchOrders.length === 0 ? (
              <div className="p-12 text-center">
                <Package size={40} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No orders found</p>
              </div>
            ) : (
              <div className="divide-y divide-card-border">
                {branchOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`w-full text-left p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all ${
                      selectedOrder?.id === order.id ? 'bg-orange-50/50 dark:bg-orange-900/10 border-l-4 border-l-orange-600' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-black text-black dark:text-white">{order.id}</p>
                      <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${getStatusColor(order.prepaymentStatus)}`}>
                        {order.prepaymentStatus}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <User size={14} />
                      {order.customerName}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-orange-600 text-sm">{formatPrice(order.total)}</p>
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Details / Verification */}
        <div className="lg:col-span-7">
          {selectedOrder ? (
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-card-border shadow-lg overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Detail Header */}
              <div className="p-8 border-b border-card-border bg-gray-50/50 dark:bg-gray-800/30">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-black dark:text-white mb-1">{selectedOrder.id}</h2>
                    <p className="text-sm text-gray-500">Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl font-bold text-sm ${getStatusColor(selectedOrder.orderStatus)}`}>
                    {selectedOrder.orderStatus.replace(/_/g, ' ').toUpperCase()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 border border-card-border">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">Email</p>
                      <p className="text-sm font-bold text-black dark:text-white">{selectedOrder.customerEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 border border-card-border">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">Prepayment (10%)</p>
                      <p className="text-sm font-bold text-orange-600">{formatPrice(selectedOrder.prepaymentAmount)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Workflow */}
              <div className="p-8 space-y-8">
                {/* 1. Payment Verification */}
                <section>
                  <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full" />
                    Step 1: Verify Prepayment
                  </h3>
                  <div className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${
                    selectedOrder.prepaymentStatus === 'verified' 
                      ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' 
                      : 'border-orange-500 bg-orange-50/50 dark:bg-orange-900/10 animate-pulse'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedOrder.prepaymentStatus === 'verified' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
                      }`}>
                        <Wallet size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-black dark:text-white">
                          {selectedOrder.prepaymentStatus === 'verified' ? 'Payment Confirmed' : 'Payment Awaiting Verification'}
                        </p>
                        <p className="text-xs text-gray-500">Customer paid {formatPrice(selectedOrder.prepaymentAmount)}</p>
                      </div>
                    </div>
                    {selectedOrder.prepaymentStatus !== 'verified' && (
                      <button 
                        onClick={() => updatePrepaymentStatus(selectedOrder.id, 'verified')}
                        className="px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-lg hover:bg-orange-700 transition-all"
                      >
                        Confirm Payment
                      </button>
                    )}
                  </div>
                </section>

                {/* 2. Stock Verification */}
                <section>
                  <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full" />
                    Step 2: Physical Stock Check
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div 
                        key={item.product.id}
                        onClick={() => toggleStockVerification(selectedOrder.id, String(item.product.id))}
                        className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                          selectedOrder.stockVerifiedItems.includes(String(item.product.id))
                            ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-900/30'
                            : 'bg-white dark:bg-gray-900 border-card-border hover:border-gray-300'
                        }`}
                      >
                        <div className="text-orange-600">
                          {selectedOrder.stockVerifiedItems.includes(String(item.product.id)) ? <CheckSquare size={24} /> : <Square size={24} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-black dark:text-white">{item.product.name}</p>
                          <p className="text-xs text-gray-500">Quantity: {item.quantity} {item.product.unit}</p>
                        </div>
                        <p className="font-bold text-sm text-black dark:text-white">{formatPrice(item.product.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 3. Final Approval */}
                <section className="pt-6 border-t border-card-border">
                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">Balance to Collect at Pickup</p>
                      <p className="text-xl font-black text-black dark:text-white">{formatPrice(selectedOrder.balanceDue)}</p>
                    </div>
                    <button
                      disabled={!isOrderFullyVerified(selectedOrder) || selectedOrder.orderStatus === 'ready_for_pickup'}
                      onClick={() => updateOrderStatus(selectedOrder.id, 'ready_for_pickup')}
                      className="flex-1 py-4 bg-black dark:bg-white dark:text-black text-white rounded-2xl font-black hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-black/10"
                    >
                      {selectedOrder.orderStatus === 'ready_for_pickup' ? (
                        <>
                          <CheckCircle2 size={20} /> Ready for Pickup
                        </>
                      ) : (
                        <>
                          Approve for Pickup <ArrowRight size={20} />
                        </>
                      )}
                    </button>
                  </div>
                  {!isOrderFullyVerified(selectedOrder) && selectedOrder.orderStatus !== 'ready_for_pickup' && (
                    <p className="text-[10px] text-orange-600 font-bold mt-4 flex items-center gap-1">
                      <BadgeAlert size={12} /> Verification incomplete. Please confirm payment and check all items.
                    </p>
                  )}
                </section>
              </div>
            </div>
          ) : (
            <div className="h-[600px] flex flex-col items-center justify-center text-center bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-card-border p-12">
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 text-gray-300">
                <ArrowLeft size={40} />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-2">Select an Order</h3>
              <p className="text-gray-500 max-w-xs mx-auto">Select an order from the list on the left to begin the verification and fulfillment process.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
