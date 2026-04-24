'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { api } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useSettingsStore } from '@/store/useSettingsStore';
import { translations } from '@/utils/translations';
import { 
  Layers, 
  ChevronRight, 
  Trash2,
  Plus
} from 'lucide-react';

export default function StaffCategoriesPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useSettingsStore();
  const t = translations[language];

  const fetchData = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      const categoryName = p.category.name;
      counts[categoryName] = (counts[categoryName] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [products]);

  const handleCategoryClick = (name: string) => {
    router.push(`/staff/products?category=${encodeURIComponent(name)}`);
  };

  const handleDeleteCategory = async (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    if (confirm(t.staff.confirmDeleteCategory)) {
      try {
        await api.deleteCategory(name);
        fetchData();
      } catch (error) {
        alert("Failed to delete category");
      }
    }
  };

  const handleAddCategory = () => {
    const name = prompt("Enter new category name:");
    if (name) {
      router.push(`/staff/products?category=${encodeURIComponent(name)}`);
    }
  };

  if (isLoading) return <div className="p-8 text-black dark:text-white font-bold">Loading categories...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-black dark:text-white mb-2">{t.staff.categories}</h1>
          <p className="text-gray-500">{t.staff.organizeGroups}</p>
        </div>
        <button 
          onClick={handleAddCategory}
          className="bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20"
        >
          <Plus size={20} />
          {t.staff.newCategory}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(([name, count]) => (
          <div 
            key={name} 
            onClick={() => handleCategoryClick(name)}
            className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-card-border shadow-sm group hover:border-orange-500 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                <Layers size={24} />
              </div>
              <button 
                onClick={(e) => handleDeleteCategory(e, name)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <h3 className="text-xl font-bold text-black dark:text-white mb-1">
              {t.categoryMap[name as keyof typeof t.categoryMap] || name}
            </h3>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">{t.staff.productCount.replace('{count}', count.toString())}</p>
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
