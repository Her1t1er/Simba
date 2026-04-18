'use client';

import React from 'react';
import { LayoutGrid, Check } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { translations } from '@/utils/translations';

interface SidebarProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  isOpen,
  onClose,
}) => {
  const { language } = useSettingsStore();
  const t = translations[language];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-[64px] left-0 h-[calc(100vh-64px)] w-64 bg-[var(--background)] border-r border-card-border p-6 z-40 transition-transform lg:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center gap-2 mb-8">
          <LayoutGrid size={20} className="text-orange-600" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t.categories}</h2>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => {
              onCategorySelect(null);
              onClose();
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedCategory === null
                ? 'bg-orange-50 dark:bg-orange-900/10 text-orange-700 dark:text-orange-500 font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <span>{t.allProducts}</span>
            {selectedCategory === null && <Check size={14} />}
          </button>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                onCategorySelect(category);
                onClose();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-orange-50 dark:bg-orange-900/10 text-orange-700 dark:text-orange-500 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <span className="truncate">
                {t.categoryMap[category as keyof typeof t.categoryMap] || category}
              </span>
              {selectedCategory === category && <Check size={14} />}
            </button>
          ))}
        </nav>

        {/* Info Card */}
        <div className="mt-auto pt-8">
          <div className="bg-orange-600 rounded-2xl p-4 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-xs font-medium opacity-80 mb-1">{t.newArrivals}</p>
              <p className="text-lg font-bold mb-3 leading-tight">{t.freshVeggies}</p>
              <button className="bg-white text-orange-600 text-xs font-bold px-4 py-2 rounded-full hover:bg-orange-50 transition-colors">
                {t.shopNow}
              </button>
            </div>
            {/* Decorative circles */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-110 transition-transform" />
            <div className="absolute -right-2 -top-2 w-12 h-12 bg-white/5 rounded-full group-hover:scale-125 transition-transform" />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
