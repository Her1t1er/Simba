'use client';

import React from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { ShoppingBag } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { translations } from '@/utils/translations';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading }) => {
  const { language } = useSettingsStore();
  const t = translations[language];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-80 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4 text-gray-300 dark:text-gray-700">
          <ShoppingBag size={32} />
        </div>
        <h3 className="text-lg font-bold text-black dark:text-white mb-1">{t.noProducts}</h3>
        <p className="text-gray-500 dark:text-gray-400">{t.tryAdjusting}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
