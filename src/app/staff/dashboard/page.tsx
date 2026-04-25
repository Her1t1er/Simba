'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { api } from '@/utils/api';
import { translations } from '@/utils/translations';
import { 
  TrendingUp, 
  ShoppingBag, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardOverview() {
  const { staffUser } = useAuthStore();
  const [branchOrders, setBranchOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useSettingsStore();
  const t = translations[language];

  useEffect(() => {
    const fetchData = async () => {
      if (staffUser?.managedBranch) {
        try {
          const data = await api.getBranchOrders(staffUser.managedBranch);
          // Sort by ID descending (newest first)
          const sortedData = data.sort((a: any, b: any) => b.id - a.id);
          setBranchOrders(sortedData);
        } catch (error) {
          console.error("Failed to fetch branch orders:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [staffUser?.managedBranch]);

  const stats = useMemo(() => {
    const totalRevenue = branchOrders
      .filter(o => o.prepaymentStatus === 'VERIFIED')
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = branchOrders.filter(o => o.orderStatus === 'PENDING').length;
    const readyOrders = branchOrders.filter(o => o.orderStatus === 'READY_FOR_PICKUP').length;

    return {
      revenue: totalRevenue,
      pending: pendingOrders,
      ready: readyOrders,
      total: branchOrders.length
    };
  }, [branchOrders]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price) + ' RWF';
  };

  if (isLoading) return <div className="p-8 text-black dark:text-white font-bold">Loading dashboard data...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-black dark:text-white mb-2">{t.staff.welcome}, {staffUser?.name}</h1>
        <p className="text-gray-500">{t.staff.happeningAt} <span className="font-bold text-orange-600">{staffUser?.managedBranch}</span> today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-card-border shadow-sm">
          <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-green-600 mb-4">
            <TrendingUp size={24} />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">{t.staff.totalRevenue}</p>
          <p className="text-2xl font-black text-black dark:text-white">{formatPrice(stats.revenue)}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-card-border shadow-sm">
          <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-600 mb-4">
            <Clock size={24} />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">{t.staff.pendingOrders}</p>
          <p className="text-2xl font-black text-black dark:text-white">{stats.pending}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-card-border shadow-sm">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
            <CheckCircle2 size={24} />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">{t.staff.readyForPickup}</p>
          <p className="text-2xl font-black text-black dark:text-white">{stats.ready}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-card-border shadow-sm">
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
            <ShoppingBag size={24} />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">{t.staff.totalOrders}</p>
          <p className="text-2xl font-black text-black dark:text-white">{stats.total}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-card-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-card-border flex justify-between items-center">
            <h2 className="font-black text-black dark:text-white">{t.staff.recentOrders}</h2>
            <Link href="/staff/orders" className="text-orange-600 text-xs font-bold hover:underline flex items-center gap-1">
              {t.staff.viewAll} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-card-border">
            {branchOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                <div>
                  <p className="font-bold text-sm text-black dark:text-white">#{order.id}</p>
                  <p className="text-xs text-gray-500">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-orange-600">{formatPrice(order.total)}</p>
                  <span className="text-[10px] uppercase font-black text-gray-400">{order.orderStatus.replace(/_/g, ' ')}</span>
                </div>
              </div>
            ))}
            {branchOrders.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-sm italic">{t.staff.noOrders}</div>
            )}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-card-border shadow-sm p-6">
          <h2 className="font-black text-black dark:text-white mb-6">{t.staff.notifications}</h2>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/30">
              <AlertCircle className="text-orange-600 shrink-0" size={20} />
              <div>
                <p className="font-bold text-sm text-orange-900 dark:text-orange-400">{t.staff.verificationRequired}</p>
                <p className="text-xs text-orange-700 dark:text-orange-500/80 mt-1">
                  {t.staff.verificationDesc.replace('{count}', stats.pending.toString())}
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
              <ShoppingBag className="text-blue-600 shrink-0" size={20} />
              <div>
                <p className="font-bold text-sm text-blue-900 dark:text-blue-400">{t.staff.inventorySync}</p>
                <p className="text-xs text-blue-700 dark:text-blue-500/80 mt-1">
                  {t.staff.inventoryDesc.replace('{branch}', staffUser?.managedBranch || '')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
