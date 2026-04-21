'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ProductGrid from '@/components/ProductGrid';
import CartDrawer from '@/components/CartDrawer';
import productDataRaw from '@/data/simba_products.json';
import { ProductData } from '@/types';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useBranchStore, Branch } from '@/store/useBranchStore';
import { translations } from '@/utils/translations';
import { useRouter } from 'next/navigation';
import { MapPin, ArrowRight } from 'lucide-react';

// Cast the raw JSON to our type
const productData = productDataRaw as ProductData;

const branches: Branch[] = [
  'Simba Centenary',
  'Simba Gishushu',
  'Simba Kimironko',
  'Simba Kicukiro',
  'Simba Kigali Height',
  'Simba UTC',
  'Simba Gacuriro',
  'Simba Gikondo',
  'Simba sonatube',
  'Simba Kisimenti',
  'Simba Rebero',
  'Simba Nyamirambo',
  'Simba Musanze'
];

export default function Home() {
  const router = useRouter();
  const { selectedBranch, selectBranch } = useBranchStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // To handle hydration mismatch with persisted store
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

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

  if (!isHydrated) return null;

  // Branch Selection View
  if (!selectedBranch) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-bold text-4xl mx-auto mb-6 shadow-xl shadow-orange-600/20">
              S
            </div>
            <h1 className="text-4xl font-black text-black dark:text-white mb-4">
              Welcome to <span className="text-orange-600">Simba Market</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Please select a branch to start your shopping experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches.map((branch) => (
              <button
                key={branch}
                onClick={() => selectBranch(branch)}
                className="group bg-white dark:bg-gray-900 p-6 rounded-2xl border border-card-border hover:border-orange-500 hover:shadow-lg hover:shadow-orange-600/5 transition-all text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    <MapPin size={20} />
                  </div>
                  <span className="font-bold text-black dark:text-white group-hover:text-orange-600 transition-colors">
                    {branch}
                  </span>
                </div>
                <ArrowRight size={18} className="text-gray-300 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
          
          <p className="text-center text-gray-400 dark:text-gray-500 mt-12 text-sm">
            Select the location nearest to you for faster delivery
          </p>
        </div>
      </div>
    );
  }

  // Main Shop View
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
                <h1 className="text-2xl font-black text-black dark:text-white mb-1">
                  {selectedCategory 
                    ? (t.categoryMap[selectedCategory as keyof typeof t.categoryMap] || selectedCategory)
                    : t.allProducts}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-gray-600">
                  {filteredProducts.length} {t.items}
                </p>
              </div>
              
              <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-1 rounded-xl border border-card-border shadow-sm w-fit">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    viewMode === 'grid' 
                      ? 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' 
                      : 'text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {t.grid}
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    viewMode === 'list' 
                      ? 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' 
                      : 'text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {t.list}
                </button>
              </div>
            </div>

            <ProductGrid products={filteredProducts} viewMode={viewMode} />
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
