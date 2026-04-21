'use client';

import React, { useState, useMemo } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import productDataRaw from '@/data/simba_products.json';
import { ProductData } from '@/types';
import { 
  Boxes, 
  Search, 
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';

const productData = productDataRaw as ProductData;

export default function StaffStockPage() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Local state to simulate stock management
  // In a real app, this would be branch-specific data from the backend
  const [stockStatus, setStockStatus] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    productData.products.forEach(p => initial[p.id] = true);
    return initial;
  });

  const filteredProducts = useMemo(() => {
    return productData.products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleStock = (id: number) => {
    setStockStatus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-black dark:text-white mb-2">Stock Management</h1>
        <p className="text-gray-500">Update item availability for <span className="font-bold text-orange-600">{user?.managedBranch}</span>.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-card-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-card-border flex flex-wrap gap-4 justify-between items-center">
          <div className="relative group max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-600">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Filter by product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white"
            />
          </div>
          
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-green-50 dark:bg-green-900/10 text-green-600 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={14} />
              {Object.values(stockStatus).filter(v => v).length} In Stock
            </div>
            <div className="px-4 py-2 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
              <XCircle size={14} />
              {Object.values(stockStatus).filter(v => !v).length} Out of Stock
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-[10px] uppercase font-black text-gray-400 tracking-wider">
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-center">Branch Availability</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {filteredProducts.map((product) => {
                const isInStock = stockStatus[product.id];
                return (
                  <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all group">
                    <td className="px-6 py-4">
                      <span className="font-bold text-sm text-black dark:text-white">{product.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500">{product.category}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isInStock ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full text-[10px] font-black uppercase tracking-tight">
                          <CheckCircle2 size={10} /> Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full text-[10px] font-black uppercase tracking-tight">
                          <XCircle size={10} /> Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => toggleStock(product.id)}
                        className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                          isInStock 
                            ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        {isInStock ? 'Mark as Unavailable' : 'Mark as Available'}
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
