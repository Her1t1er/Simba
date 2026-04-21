'use client';

import React, { useState, useMemo, Suspense } from 'react';
import productDataRaw from '@/data/simba_products.json';
import { ProductData } from '@/types';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  ShoppingBag,
  X
} from 'lucide-react';
import Image from 'next/image';

const productData = productDataRaw as ProductData;

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryFilter = searchParams.get('category');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return productData.products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price) + ' RWF';
  };

  const clearCategoryFilter = () => {
    router.push('/staff/products');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-black dark:text-white mb-2 flex items-center gap-4">
            Products
            {categoryFilter && (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-600 text-white rounded-full text-xs font-black uppercase tracking-widest animate-in zoom-in duration-300">
                {categoryFilter}
                <button 
                  onClick={clearCategoryFilter}
                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            )}
          </h1>
          <p className="text-gray-500">
            {categoryFilter 
              ? `Showing all products in ${categoryFilter}` 
              : "Manage your global product catalog."}
          </p>
        </div>
        <button className="bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20">
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-card-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-card-border">
          <div className="relative group max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-600">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-[10px] uppercase font-black text-gray-400 tracking-wider">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Unit</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {product.image ? (
                          <Image src={product.image} alt={product.name} width={40} height={40} className="object-cover" />
                        ) : (
                          <ShoppingBag size={18} className="text-gray-400" />
                        )}
                      </div>
                      <span className="font-bold text-sm text-black dark:text-white">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/10 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-tight">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-sm text-black dark:text-white">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {product.unit}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-orange-600 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function StaffProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
