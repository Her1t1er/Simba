'use client';

import React from 'react';
import Image from 'next/image';
import { Plus, ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { translations } from '@/utils/translations';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const addItem = useCartStore((state) => state.addItem);
  const { language } = useSettingsStore();
  const t = translations[language];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price) + ' FRW';
  };

  const isPlaceholder = !product.image || product.image.includes('placehold.co');

  if (viewMode === 'list') {
    return (
      <div className="group bg-white dark:bg-gray-900 rounded-2xl p-3 transition-all duration-300 flex items-center gap-4 hover:shadow-lg border border-gray-100 dark:border-gray-800">
        <div className="relative w-24 h-24 bg-white dark:bg-gray-800 rounded-xl overflow-hidden flex-shrink-0 border border-gray-50 dark:border-gray-700">
          {!isPlaceholder ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-2"
              sizes="96px"
            />
          ) : (
            <div className="flex items-center justify-center text-gray-400 dark:text-gray-600 w-full h-full">
              <ShoppingCart size={24} strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600">
            {t.categoryMap[product.category as keyof typeof t.categoryMap] || product.category}
          </span>
          <h3 className="text-sm font-bold text-black dark:text-white truncate">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{product.unit}</p>
        </div>

        <div className="flex items-center gap-4 pr-2 ml-auto">
          <span className="text-lg font-black text-black dark:text-white whitespace-nowrap">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => product.inStock && addItem(product)}
            disabled={!product.inStock}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
              product.inStock
                ? 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95 shadow-lg shadow-orange-600/20'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }`}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-3xl p-4 transition-all duration-300 flex flex-col h-full hover:shadow-xl border border-gray-100 dark:border-gray-800">
      <div className="relative aspect-square w-full mb-4 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden flex items-center justify-center">
        {!isPlaceholder ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-800 w-full h-full rounded-2xl">
            <ShoppingCart size={48} strokeWidth={1.5} />
            <span className="text-[10px] mt-2 font-medium uppercase tracking-wider">No Image</span>
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
              {t.outOfStock}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 px-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 mb-1">
          {t.categoryMap[product.category as keyof typeof t.categoryMap] || product.category}
        </span>
        <h3 className="text-sm font-bold text-black dark:text-white line-clamp-2 mb-2 transition-colors duration-200">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{product.unit}</p>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-lg font-black text-black dark:text-white">
              {formatPrice(product.price)}
            </span>
          </div>
          
          <button
            onClick={() => product.inStock && addItem(product)}
            disabled={!product.inStock}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
              product.inStock
                ? 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95 shadow-lg shadow-orange-600/20'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }`}
            title={t.addToCart}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
