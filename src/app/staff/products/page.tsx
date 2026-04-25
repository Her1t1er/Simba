'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { api } from '@/utils/api';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSettingsStore } from '@/store/useSettingsStore';
import { translations } from '@/utils/translations';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ShoppingBag,
  X,
  Loader2,
  Save,
  Image as ImageIcon
} from 'lucide-react';
import Image from 'next/image';

interface ProductFormData {
  id?: number;
  name: string;
  price: string;
  unit: string;
  image: string;
  categoryName: string;
}

const initialFormData: ProductFormData = {
  name: '',
  price: '',
  unit: 'kg',
  image: '',
  categoryName: ''
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryFilter = searchParams.get('category');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { language } = useSettingsStore();
  const t = translations[language];

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        api.getProducts(),
        api.getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const categoryName = p.category.name;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter ? categoryName === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter, products]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price) + ' RWF';
  };

  const clearCategoryFilter = () => {
    router.push('/staff/products');
  };

  const handleOpenAddModal = () => {
    setFormData({ ...initialFormData, categoryName: categories[0] || '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: any) => {
    setFormData({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      unit: product.unit,
      image: product.image || '',
      categoryName: product.category.name
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await api.deleteProduct(id);
        fetchData();
      } catch (error) {
        alert("Failed to delete product");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (formData.id) {
        await api.updateProduct(formData.id, payload);
      } else {
        await api.addProduct(payload);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert("Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8 text-black dark:text-white font-bold">Loading products catalog...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-black dark:text-white mb-2 flex items-center gap-4">
            {t.staff.products}
            {categoryFilter && (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-600 text-white rounded-full text-xs font-black uppercase tracking-widest animate-in zoom-in duration-300">
                {t.categoryMap[categoryFilter as keyof typeof t.categoryMap] || categoryFilter}
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
              ? t.staff.showingProductsInCategory.replace('{category}', t.categoryMap[categoryFilter as keyof typeof t.categoryMap] || categoryFilter)
              : t.staff.manageCatalog}
          </p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20"
        >
          <Plus size={20} />
          {t.staff.addProduct}
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
              placeholder={t.search}
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
                <th className="px-6 py-4">{t.staff.product}</th>
                <th className="px-6 py-4">{t.staff.category}</th>
                <th className="px-6 py-4">{t.staff.price}</th>
                <th className="px-6 py-4">{t.staff.unit}</th>
                <th className="px-6 py-4 text-right">{t.staff.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                        {product.image ? (
                          <Image src={product.image} alt={product.name} fill className="object-cover" />
                        ) : (
                          <ShoppingBag size={18} className="text-gray-400" />
                        )}
                      </div>
                      <span className="font-bold text-sm text-black dark:text-white">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/10 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-tight">
                      {t.categoryMap[product.category.name as keyof typeof t.categoryMap] || product.category.name}
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
                      <button 
                        onClick={() => handleOpenEditModal(product)}
                        className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500 italic">
                    {t.staff.noProductsFound || "No products found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 w-full max-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-card-border flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
              <h2 className="text-xl font-black text-black dark:text-white">
                {formData.id ? t.staff.editProduct : t.staff.addProduct}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t.staff.productName}</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t.staff.price} (RWF)</label>
                    <input
                      required
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t.staff.unit}</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. kg, pcs, bottle"
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t.staff.category}</label>
                  <div className="relative">
                    <select
                      value={formData.categoryName}
                      onChange={(e) => setFormData({...formData, categoryName: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white appearance-none cursor-pointer"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{t.categoryMap[cat as keyof typeof t.categoryMap] || cat}</option>
                      ))}
                      <option value="NEW">+ {t.staff.addNewCategory || "Add New Category"}</option>
                    </select>
                    {formData.categoryName === 'NEW' && (
                      <input
                        required
                        type="text"
                        placeholder="Enter category name"
                        onChange={(e) => setFormData({...formData, categoryName: e.target.value})}
                        className="mt-2 w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t.staff.imageUrl}</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <ImageIcon size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder="https://example.com/image.jpg"
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-card-border rounded-xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  {t.staff.cancel || "Cancel"}
                </button>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="flex-[2] px-6 py-3 bg-orange-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-700 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  {formData.id ? (t.staff.updateProduct || "Update Product") : (t.staff.saveProduct || "Save Product")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StaffProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20 text-black dark:text-white font-bold">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        <span className="ml-4">Loading Catalog...</span>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
