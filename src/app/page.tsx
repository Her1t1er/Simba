'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ProductGrid from '@/components/ProductGrid';
import CartDrawer from '@/components/CartDrawer';
import productDataRaw from '@/data/simba_products.json';
import { ProductData } from '@/types';
import { useSettingsStore } from '@/store/useSettingsStore';
import { translations } from '@/utils/translations';

// Cast the raw JSON to our type
const productData = productDataRaw as ProductData;

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { language } = useSettingsStore();
  const t = translations[language];

  const categories = useMemo(() => {
    const uniqueCategories = new Set(productData.products.map((p) => p.category));
    return Array.from(uniqueCategories).sort();
  }, []);

  const filteredProducts = useMemo(() => {
    return productData.products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory
        ? product.category === selectedCategory
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
      <Navbar
        onSearchChange={setSearchQuery}
        onCartToggle={() => setIsCartOpen(true)}
        onMenuToggle={() => setIsSidebarOpen(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar / Mobile Off-canvas */}
          <Sidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                  {selectedCategory 
                    ? (t.categoryMap[selectedCategory as keyof typeof t.categoryMap] || selectedCategory)
                    : t.allProducts}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredProducts.length} {t.items}
                </p>
              </div>
              
              <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-1 rounded-xl border border-card-border shadow-sm w-fit">
                <button className="px-4 py-1.5 text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  {t.grid}
                </button>
                <button className="px-4 py-1.5 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors">
                  {t.list}
                </button>
              </div>
            </div>

            <ProductGrid products={filteredProducts} />
          </main>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 border-t border-card-border mt-20 py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            © 2026 {productData.store.name}. {t.footer}.
          </p>
        </div>
      </footer>
    </div>
  );
}
