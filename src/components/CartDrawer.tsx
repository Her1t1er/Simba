'use client';

import React from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { translations } from '@/utils/translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, totalPrice } = useCartStore();
  const { language } = useSettingsStore();
  const t = translations[language];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-950 z-[70] shadow-2xl transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-card-border">
            <div className="flex items-center gap-2">
              <ShoppingBag size={24} className="text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.cart}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4 text-gray-300 dark:text-gray-700">
                  <ShoppingBag size={40} />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">{t.emptyCart}</p>
                <button
                  onClick={onClose}
                  className="mt-4 text-orange-600 font-bold hover:underline"
                >
                  {t.startShopping}
                </button>
              </div>
            ) : (
              items.map((item) => {
                const isPlaceholder = item.product.image.includes('placehold.co') || !item.product.image;
                return (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="relative w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {!isPlaceholder ? (
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover p-1"
                        />
                      ) : (
                        <ShoppingBag size={24} className="text-gray-300 dark:text-gray-700" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{item.product.unit}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-md bg-white dark:bg-gray-800 border border-card-border text-gray-600 dark:text-gray-400 hover:text-orange-600 shadow-sm"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-bold w-4 text-center dark:text-gray-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-md bg-white dark:bg-gray-800 border border-card-border text-gray-600 dark:text-gray-400 hover:text-orange-600 shadow-sm"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-1 self-start text-gray-300 dark:text-gray-700 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-card-border bg-gray-50/50 dark:bg-gray-900/50">
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-500 dark:text-gray-400 font-medium">{t.subtotal}</span>
                <span className="text-2xl font-black text-gray-900 dark:text-white">
                  {formatPrice(totalPrice())}
                </span>
              </div>
              <button className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all active:scale-[0.98] shadow-lg shadow-orange-600/20">
                {t.checkout}
              </button>
              <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
                {t.shippingTaxes}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
