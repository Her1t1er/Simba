'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/utils/api';
import { useSettingsStore } from '@/store/useSettingsStore';
import { translations } from '@/utils/translations';
import { 
  CheckCircle2, 
  Clock, 
  Package, 
  Search, 
  User, 
  Mail, 
  Phone, 
  ArrowLeft,
  ArrowRight,
  CheckSquare,
  Square,
  BadgeAlert,
  Wallet,
  ArrowRight
} from 'lucide-react';

export default function StaffOrdersPage() {
  const { staffUser } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useSettingsStore();
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const fetchOrders = async () => {
    if (staffUser?.managedBranch) {
      try {
        const data = await api.getBranchOrders(staffUser.managedBranch);
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch branch orders:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [staffUser?.managedBranch]);

  const selectedOrder = useMemo(() => {
    return orders.find(o => o.id === selectedOrderId) || null;
  }, [orders, selectedOrderId]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => 
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      o.id.toString().includes(searchQuery.toLowerCase())
    );
  }, [orders, searchQuery]);

  const handleUpdatePrepayment = async (id: number, status: string) => {
    try {
      await api.updatePrepayment(id, status);
      fetchOrders();
    } catch (error) {
      alert("Failed to update prepayment");
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.updateOrderStatus(id, status);
      fetchOrders();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price) + ' RWF';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'verified': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'ready_for_pickup': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'processing': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-800';
    }
  };

  if (isLoading) return <div className="p-8">Loading orders...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-black dark:text-white mb-2">{t.staff.branchOrders}</h1>
        <p className="text-gray-500">{t.staff.managingOrdersFor} <span className="font-bold text-orange-600">{staffUser?.managedBranch}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-card-border shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-600">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">{t.staff.incoming}</p>
              <p className="text-2xl font-black text-black dark:text-white">
                {orders.filter(o => o.orderStatus === 'PENDING').length}
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
              <p className="text-xs font-bold text-gray-400 uppercase">{t.staff.processing}</p>
              <p className="text-2xl font-black text-black dark:text-white">
                {orders.filter(o => o.orderStatus === 'PROCESSING').length}
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
              <p className="text-xs font-bold text-gray-400 uppercase">{t.staff.ready}</p>
              <p className="text-2xl font-black text-black dark:text-white">
                {orders.filter(o => o.orderStatus === 'READY_FOR_PICKUP').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-600">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder={t.staff.searchOrders}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-card-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white shadow-sm"
            />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-card-border overflow-hidden shadow-sm">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center">
                <Package size={40} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">{t.staff.noOrdersFound}</p>
              </div>
            ) : (
              <div className="divide-y divide-card-border">
                {filteredOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`w-full text-left p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all ${
                      selectedOrderId === order.id ? 'bg-orange-50/50 dark:bg-orange-900/10 border-l-4 border-l-orange-600' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-black text-black dark:text-white">#{order.id}</p>
                      <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${getStatusColor(order.prepaymentStatus)}`}>
                        {order.prepaymentStatus === 'VERIFIED' ? t.staff.paymentVerified : t.staff.paymentPending}
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

        <div className="lg:col-span-7">
          {selectedOrder ? (
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-card-border shadow-lg overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-8 border-b border-card-border bg-gray-50/50 dark:bg-gray-800/30">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-black dark:text-white mb-1">#{selectedOrder.id}</h2>
                    <p className="text-sm text-gray-500">{t.staff.placedOn} {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl font-bold text-sm ${getStatusColor(selectedOrder.orderStatus)}`}>
                    {selectedOrder.orderStatus.replace(/_/g, ' ')}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 border border-card-border">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">{t.staff.email}</p>
                      <p className="text-sm font-bold text-black dark:text-white">{selectedOrder.customerEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 border border-card-border">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">{t.orderSummary} (10%)</p>
                      <p className="text-sm font-bold text-orange-600">{formatPrice(selectedOrder.prepaymentAmount)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <section>
                  <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full" />
                    {t.staff.step1}
                  </h3>
                  <div className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${
                    selectedOrder.prepaymentStatus === 'VERIFIED' 
                      ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' 
                      : 'border-orange-500 bg-orange-50/50 dark:bg-orange-900/10 animate-pulse'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedOrder.prepaymentStatus === 'VERIFIED' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
                      }`}>
                        <Wallet size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-black dark:text-white">
                          {selectedOrder.prepaymentStatus === 'VERIFIED' ? t.staff.paymentVerified : t.staff.paymentPending}
                        </p>
                        <p className="text-xs text-gray-500">{t.staff.customer} paid {formatPrice(selectedOrder.prepaymentAmount)}</p>
                      </div>
                    </div>
                    {selectedOrder.prepaymentStatus !== 'VERIFIED' && (
                      <button 
                        onClick={() => handleUpdatePrepayment(selectedOrder.id, 'verified')}
                        className="px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-lg hover:bg-orange-700 transition-all"
                      >
                        {t.staff.confirmPayment}
                      </button>
                    )}
                  </div>
                </section>

                <section className="pt-6 border-t border-card-border">
                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">{t.staff.balanceDue}</p>
                      <p className="text-xl font-black text-black dark:text-white">{formatPrice(selectedOrder.balanceDue)}</p>
                    </div>
                    <button
                      disabled={selectedOrder.prepaymentStatus !== 'VERIFIED' || selectedOrder.orderStatus === 'READY_FOR_PICKUP'}
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'READY_FOR_PICKUP')}
                      className="flex-1 py-4 bg-black dark:bg-white dark:text-black text-white rounded-2xl font-black hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-black/10"
                    >
                      {selectedOrder.orderStatus === 'READY_FOR_PICKUP' ? (
                        <>
                          <CheckCircle2 size={20} /> {t.staff.readyForPickup}
                        </>
                      ) : (
                        <>
                          {t.staff.approvePickup} <ArrowRight size={20} />
                        </>
                      )}
                    </button>
                  </div>
                </section>
              </div>
            </div>
          ) : (
            <div className="h-[600px] flex flex-col items-center justify-center text-center bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-card-border p-12">
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 text-gray-300">
                <ArrowLeft size={40} />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-2">{t.staff.selectOrder}</h3>
              <p className="text-gray-500 max-w-xs mx-auto">{t.staff.selectOrderDesc}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
