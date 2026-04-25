'use client';

import React, { useEffect, useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, X, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const CartNotification = () => {
  const { lastAddedItem, clearLastAdded } = useCartStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (lastAddedItem) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Delay clearing the state to allow exit animation
        setTimeout(clearLastAdded, 500);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lastAddedItem, clearLastAdded]);

  if (!lastAddedItem && !isVisible) return null;

  return (
    <div className={`fixed top-20 right-4 z-[100] transition-all duration-500 transform ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-orange-500 text-white p-4 rounded-2xl shadow-2xl border-2 border-orange-600 flex items-center gap-4 min-w-[300px]">
        <div className="relative w-12 h-12 bg-white rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
          {lastAddedItem?.image ? (
            <Image src={lastAddedItem.image} alt={lastAddedItem.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <ShoppingBag size={20} className="text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-1 mb-0.5">
            <CheckCircle2 size={14} className="text-white" />
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-100">Added to Cart</span>
          </div>
          <p className="font-bold text-sm truncate max-w-[180px]">
            {lastAddedItem?.name}
          </p>
        </div>

        <button 
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      
      {/* Decorative arrow/pointer */}
      <div className="absolute -top-2 right-8 w-4 h-4 bg-orange-500 border-t-2 border-l-2 border-orange-600 rotate-45" />
    </div>
  );
};

export default CartNotification;
