'use client';

import React from 'react';
import { 
  ArrowRight, 
  Truck, 
  Leaf, 
  CreditCard, 
  MapPin, 
  ChevronRight,
  Star,
  ShoppingBag,
  CheckCircle2
} from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { translations } from '@/utils/translations';

interface LandingPageProps {
  onStartShopping: () => void;
  featuredProducts: Product[];
  categories: string[];
  productCount: number;
  branches: string[];
  t: typeof translations['en'];
}

const LandingPage: React.FC<LandingPageProps> = ({ 
  onStartShopping, 
  featuredProducts, 
  categories,
  productCount,
  branches,
  t
}) => {
  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/10 dark:to-gray-950 py-20 lg:py-32">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-72 h-72 bg-orange-600/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Star size={14} className="fill-current" />
                {t.footer}
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-black dark:text-white leading-[1.1] mb-6">
                {t.landing.heroTitlePart1} <span className="text-orange-600">{t.landing.heroTitlePart2}</span> <br />
                {t.landing.heroTitlePart3}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-lg leading-relaxed">
                {t.landing.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onStartShopping}
                  className="group flex items-center justify-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-600/20 transition-all active:scale-95"
                >
                  {t.startShopping}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center gap-4 px-6 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 overflow-hidden relative">
                        <Image src={`https://i.pravatar.cc/150?u=${i}`} alt="user" fill />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="font-bold text-black dark:text-white">{t.landing.happyCustomers}</div>
                    <div className="text-gray-500 text-xs">{t.landing.joinedAcross}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
                <Image 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000" 
                  alt="Fresh groceries" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl border border-gray-50 dark:border-gray-800 animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600">
                    <Truck size={24} />
                  </div>
                  <div>
                    <div className="font-black text-black dark:text-white">{t.landing.deliveryTime}</div>
                    <div className="text-xs text-gray-500">{t.landing.fastestInKigali}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 border-y border-gray-100 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex gap-6">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex-shrink-0 flex items-center justify-center text-orange-600">
                <Truck size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">{t.landing.valueProp1Title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  {t.landing.valueProp1Desc}
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex-shrink-0 flex items-center justify-center text-green-600">
                <Leaf size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">{t.landing.valueProp2Title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  {t.landing.valueProp2Desc}
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex-shrink-0 flex items-center justify-center text-blue-600">
                <CreditCard size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">{t.landing.valueProp3Title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  {t.landing.valueProp3Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-black text-black dark:text-white mb-4">{t.landing.shopByCategory}</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                {t.landing.categoryDesc}
              </p>
            </div>
            <button 
              onClick={onStartShopping}
              className="flex items-center gap-2 text-orange-600 font-bold hover:gap-3 transition-all"
            >
              {t.landing.seeAllCategories} <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((category) => (
              <button
                key={category}
                onClick={onStartShopping}
                className="group relative h-40 rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-900"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-500">
                  <div className="w-full h-full bg-orange-600/10 flex items-center justify-center">
                    <ShoppingBag size={40} className="text-orange-600/20" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <div className="text-white font-bold truncate">
                    {t.categoryMap[category as keyof typeof t.categoryMap] || category}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-black dark:text-white mb-4">{t.landing.featuredToday}</h2>
            <p className="text-gray-500 dark:text-gray-400">{t.landing.featuredDesc}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <button
              onClick={onStartShopping}
              className="px-10 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold hover:scale-105 transition-transform"
            >
              {t.landing.viewFullCatalog}
            </button>
          </div>
        </div>
      </section>

      {/* Trust Signals & Stats */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-orange-600 rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            
            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <h2 className="text-4xl font-black mb-8 leading-tight">
                  {t.landing.trustedBy}
                </h2>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-4xl font-black mb-2">{productCount}+</div>
                    <div className="text-orange-100 text-sm">{t.landing.productAvailable}</div>
                  </div>
                  <div>
                    <div className="text-4xl font-black mb-2">{branches.length}+</div>
                    <div className="text-orange-100 text-sm">{t.landing.branchLocations}</div>
                  </div>
                  <div>
                    <div className="text-4xl font-black mb-2">45m</div>
                    <div className="text-orange-100 text-sm">{t.landing.avgDelivery}</div>
                  </div>
                  <div>
                    <div className="text-4xl font-black mb-2">100%</div>
                    <div className="text-orange-100 text-sm">{t.landing.qualityGuaranteed}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-6 bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20">
                <h3 className="text-xl font-bold">{t.landing.whySimba}</h3>
                {t.landing.whyPoints.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <CheckCircle2 size={24} className="flex-shrink-0" />
                    <p className="text-orange-50 font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-black dark:text-white mb-4">{t.landing.visitBranches}</h2>
            <p className="text-gray-500 dark:text-gray-400">{t.landing.convenientlyLocated}</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {branches.slice(0, 10).map((branch) => (
              <div 
                key={branch}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300"
              >
                <MapPin size={16} className="text-orange-600" />
                {branch}
              </div>
            ))}
            {branches.length > 10 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 rounded-xl text-sm font-bold text-orange-600">
                + {branches.length - 10} {t.landing.moreLocations}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
