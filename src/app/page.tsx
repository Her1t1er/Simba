'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ProductGrid from '@/components/ProductGrid';
import CartDrawer from '@/components/CartDrawer';
import LandingPage from '@/components/LandingPage';
import Footer from '@/components/Footer';
import { api } from '@/utils/api';
import { Product } from '@/types';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useBranchStore, Branch } from '@/store/useBranchStore';
import { translations } from '@/utils/translations';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, ArrowRight, X } from 'lucide-react';
import { Suspense } from 'react';

const branchesWithLocations = [
  { name: 'Simba Centenary' as Branch, location: 'KN 4 Ave, City Center (Town)' },
  { name: 'Simba Gishushu' as Branch, location: 'KN 5 Rd, Near Parliament' },
  { name: 'Simba Kimironko' as Branch, location: 'KG 11 Ave, Near Kimironko Market' },
  { name: 'Simba Kicukiro' as Branch, location: 'Kicukiro Centre, Sonatubes' },
  { name: 'Simba Kigali Height' as Branch, location: 'KG 7 Ave, Opposite Convention Centre' },
  { name: 'Simba UTC' as Branch, location: 'KN 4 Ave, Union Trade Center' },
  { name: 'Simba Gacuriro' as Branch, location: 'Near Vision City' },
  { name: 'Simba Gikondo' as Branch, location: 'Gikondo Industrial Area' },
  { name: 'Simba sonatube' as Branch, location: 'KN 3 Rd, Sonatube Roundabout' },
  { name: 'Simba Kisimenti' as Branch, location: 'KG 5 Ave, Remera' },
  { name: 'Simba Rebero' as Branch, location: 'Rebero Hill' },
  { name: 'Simba Nyamirambo' as Branch, location: 'KN 2 Ave, Nyamirambo' },
  { name: 'Simba Musanze' as Branch, location: 'Musanze City Center' }
];

type SortOption = 'featured' | 'price-low' | 'price-high' | 'name';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedBranch, selectBranch } = useBranchStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [showBranchSelection, setShowBranchSelection] = useState(false);
  const [isShowingShop, setIsShowingShop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // To handle hydration mismatch with persisted store
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
    
    if (searchParams.get('shop') === 'true' && selectedBranch) {
      setIsShowingShop(true);
    }

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
  }, [searchParams, selectedBranch]);

  const { language } = useSettingsStore();
  const t = translations[language];

  const featuredProducts = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory
        ? product.category.name === selectedCategory
        : true;
      return matchesSearch && matchesCategory;
    });

    // Apply Sorting
    const sortedResult = [...result];
    switch (sortOption) {
      case 'price-low':
        sortedResult.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sortedResult.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        sortedResult.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        // Featured is default API order
        break;
    }

    return sortedResult;
  }, [searchQuery, selectedCategory, products, sortOption]);

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
          onBranchSelect={(branchName) => {
            selectBranch(branchName as Branch);
            setIsShowingShop(true);
          }}
          featuredProducts={featuredProducts}
          categories={categories}
          productCount={products.length}
          branches={branchesWithLocations.map(b => b.name)}
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
                {branchesWithLocations.map((branch) => (
                  <button
                    key={branch.name}
                    onClick={() => {
                      selectBranch(branch.name);
                      setShowBranchSelection(false);
                      setIsShowingShop(true);
                    }}
                    className="group bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-transparent hover:border-orange-500 hover:bg-white dark:hover:bg-gray-800 transition-all text-left flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-black dark:text-white group-hover:text-orange-600 transition-colors">
                          {branch.name}
                        </p>
                        <p className="text-[10px] text-gray-500 group-hover:text-gray-400 mt-1 line-clamp-1">
                          {branch.location}
                        </p>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-gray-300 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <Footer />
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
              
              <div className="flex items-center gap-3 flex-wrap">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-1.5 rounded-xl border border-card-border shadow-sm">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.sort}:</span>
                  <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    className="bg-transparent text-xs font-bold text-black dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="featured">{t.sortByFeatured}</option>
                    <option value="price-low">{t.sortByPriceLow}</option>
                    <option value="price-high">{t.sortByPriceHigh}</option>
                    <option value="name">{t.sortByName}</option>
                  </select>
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
            </div>

            <ProductGrid products={filteredProducts} viewMode={viewMode} />
          </main>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
