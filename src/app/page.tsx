'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ProductGrid from '@/components/ProductGrid';
import CartDrawer from '@/components/CartDrawer';
import LandingPage from '@/components/LandingPage';
import { api } from '@/utils/api';
import { Product, ProductData } from '@/types';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useBranchStore, Branch } from '@/store/useBranchStore';
import { translations } from '@/utils/translations';
import { useRouter } from 'next/navigation';
import { MapPin, ArrowRight, X } from 'lucide-react';

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
  const { selectedBranch, selectBranch, clearBranch } = useBranchStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showBranchSelection, setShowBranchSelection] = useState(false);
  const [isShowingShop, setIsShowingShop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // To handle hydration mismatch with persisted store
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
    
    // Fetch live data
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          api.getProducts(),
          api.getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch data from backend:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const { language } = useSettingsStore();
  const t = translations[language];

  const featuredProducts = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory
        ? product.category === selectedCategory
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, products]);

  if (!isHydrated || isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  // Landing Page & Branch Selection View
  if (!isShowingShop || !selectedBranch) {
    return (
      <div className="relative">
        <Navbar
          onSearchChange={setSearchQuery}
          onCartToggle={() => setIsCartOpen(true)}
          onMenuToggle={() => setIsSidebarOpen(true)}
          onLogoClick={() => setIsShowingShop(false)}
        />
        
        <LandingPage 
          onStartShopping={() => {
            if (selectedBranch) {
              setIsShowingShop(true);
            } else {
              setShowBranchSelection(true);
            }
          }}
          featuredProducts={featuredProducts}
          categories={categories}
          productCount={products.length}
          branches={branches}
          t={t}
        />

        {/* Branch Selection Modal/Overlay */}
        {showBranchSelection && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowBranchSelection(false)}
            />
            <div className="relative bg-white dark:bg-gray-900 w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-8 pb-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                <div>
                  <h2 className="text-2xl font-black text-black dark:text-white">{t.landing.selectBranch}</h2>
                  <p className="text-sm text-gray-500">{t.landing.nearestLocation}</p>
                </div>
                <button 
                  onClick={() => setShowBranchSelection(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {branches.map((branch) => (
                  <button
                    key={branch}
                    onClick={() => {
                      selectBranch(branch);
                      setShowBranchSelection(false);
                      setIsShowingShop(true);
                    }}
                    className="group bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-transparent hover:border-orange-500 hover:bg-white dark:hover:bg-gray-800 transition-all text-left flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
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
            </div>
          </div>
        )}

        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        
        <footer className="bg-white dark:bg-gray-950 border-t border-card-border py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              © 2026 Simba Market. {t.footer}.
            </p>
          </div>
        </footer>
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
            © 2026 Simba Market. {t.footer}.
          </p>
        </div>
      </footer>
    </div>
  );
}
