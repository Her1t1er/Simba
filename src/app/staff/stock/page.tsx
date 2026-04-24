'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/utils/api';
import { useSettingsStore } from '@/store/useSettingsStore';
import { translations } from '@/utils/translations';
import { 
  Search, 
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function StaffStockPage() {
  const { staffUser } = useAuthStore();
  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { language } = useSettingsStore();
  const t = translations[language];
  
  const fetchInventory = async () => {
    if (staffUser?.managedBranch) {
      try {
        const data = await api.getBranchInventory(staffUser.managedBranch);
        setInventory(data);
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [staffUser?.managedBranch]);

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => 
      item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, inventory]);

  const toggleStock = async (id: number) => {
    try {
      await api.toggleStock(id);
      fetchInventory();
    } catch (error) {
      alert("Failed to toggle stock status");
    }
  };

  if (isLoading) return <div className="p-8 text-black dark:text-white font-bold">Loading inventory...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-black dark:text-white mb-2">{t.staff.stock}</h1>
        <p className="text-gray-500">{t.staff.updateStock} {t.footer} <span className="font-bold text-orange-600">{staffUser?.managedBranch}</span>.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-card-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-card-border flex flex-wrap gap-4 justify-between items-center">
          <div className="relative group max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-600">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder={t.staff.filterByName}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white"
            />
          </div>
          
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-green-50 dark:bg-green-900/10 text-green-600 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={14} />
              {inventory.filter(i => i.inStock).length} {t.staff.inStock}
            </div>
            <div className="px-4 py-2 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
              <XCircle size={14} />
              {inventory.filter(i => !i.inStock).length} {t.staff.outOfStock}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-[10px] uppercase font-black text-gray-400 tracking-wider">
                <th className="px-6 py-4">{t.staff.productName}</th>
                <th className="px-6 py-4">{t.staff.category}</th>
                <th className="px-6 py-4 text-center">{t.staff.availability}</th>
                <th className="px-6 py-4 text-right">{t.staff.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {filteredInventory.map((item) => {
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all group">
                    <td className="px-6 py-4">
                      <span className="font-bold text-sm text-black dark:text-white">{item.product.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500">
                        {t.categoryMap[item.product.category.name as keyof typeof t.categoryMap] || item.product.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.inStock ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full text-[10px] font-black uppercase tracking-tight">
                          <CheckCircle2 size={10} /> {t.staff.available}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full text-[10px] font-black uppercase tracking-tight">
                          <XCircle size={10} /> {t.staff.outOfStock}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => toggleStock(item.id)}
                        className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                          item.inStock 
                            ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        {item.inStock ? t.staff.markUnavailable : t.staff.markAvailable}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
