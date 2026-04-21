'use client';

import React, { useMemo } from 'react';
import productDataRaw from '@/data/simba_products.json';
import { ProductData } from '@/types';
import { useRouter } from 'next/navigation';
import { 
  Layers, 
  ChevronRight, 
  MoreHorizontal,
  Plus
} from 'lucide-react';

const productData = productDataRaw as ProductData;

export default function StaffCategoriesPage() {
  const router = useRouter();
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    productData.products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, []);

  const handleCategoryClick = (name: string) => {
    router.push(`/staff/products?category=${encodeURIComponent(name)}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-black dark:text-white mb-2">Categories</h1>
          <p className="text-gray-500">Organize your products into logical groups.</p>
        </div>
        <button className="bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20">
          <Plus size={20} />
          New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(([name, count]) => (
          <div 
            key={name} 
            onClick={() => handleCategoryClick(name)}
            className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-card-border shadow-sm group hover:border-orange-500 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                <Layers size={24} />
              </div>
              <button className="text-gray-400 hover:text-black dark:hover:text-white">
                <MoreHorizontal size={20} />
              </button>
            </div>
            <h3 className="text-xl font-bold text-black dark:text-white mb-1">{name}</h3>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">{count} Products</p>
              <div className="text-orange-600 group-hover:translate-x-1 transition-transform">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
