'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/utils/api';
import { useCartStore } from '@/store/useCartStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useBranchStore } from '@/store/useBranchStore';
import { useAuthStore } from '@/store/useAuthStore';
import { translations } from '@/utils/translations';
import { Check, CreditCard, ShoppingBag, ArrowRight, MapPin, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const { selectedBranch } = useBranchStore();
  const { customerUser, isCustomerAuthenticated } = useAuthStore();
  const { language } = useSettingsStore();
  const t = translations[language];

  const [isHydrated, setIsHydrated] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'mtn' | 'airtel' | 'card'>('mtn');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [pickupNotes, setPickupNotes] = useState('');

  React.useEffect(() => {
    setIsHydrated(true);
    if (!selectedBranch) {
      router.push('/');
    }
    if (isHydrated && !isCustomerAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [selectedBranch, isCustomerAuthenticated, isHydrated, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price) + ' RWF';
  };

  if (!isHydrated || !selectedBranch || !customerUser) return null;

  const prepayment = totalPrice() * 0.1;
  const balanceDue = totalPrice() * 0.9;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Prepare order for backend
    const orderData = {
      customerName: customerUser.name,
      customerEmail: customerUser.email,
      customerPhone: '0780000000',
      pickupNotes: pickupNotes,
      branchName: selectedBranch,
      items: items.map(item => ({ 
        productId: item.product.id, 
        quantity: item.quantity 
      }))
    };

    try {
      await api.checkout(orderData);
      setIsProcessing(false);
      setOrderPlaced(true);
      clearCart();
      
      // Navigate back home after 5 seconds
      setTimeout(() => {
        router.push('/');
      }, 5000);
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Failed to place order. Please check if backend is running.");
      setIsProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <Navbar onSearchChange={() => {}} onCartToggle={() => {}} onMenuToggle={() => {}} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl text-center border border-card-border animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
              <Check size={40} strokeWidth={3} />
            </div>
            <h1 className="text-3xl font-black text-black dark:text-white mb-4">{t.orderSuccessful}</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">{t.orderThankYou}</p>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all flex items-center justify-center gap-2"
            >
              Back to Home <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar
        onSearchChange={() => {}}
        onCartToggle={() => {}}
        onMenuToggle={() => {}}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-3xl font-black text-black dark:text-white mb-8">{t.checkout}</h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 border border-card-border shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                  <UserIcon size={20} />
                </div>
                <h2 className="text-2xl font-bold text-black dark:text-white">Account Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-card-border">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">{t.firstName} & {t.lastName}</p>
                  <p className="font-bold text-black dark:text-white">{customerUser.name}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-card-border">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">{t.emailAddress}</p>
                  <p className="font-bold text-black dark:text-white">{customerUser.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 border border-card-border shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                <h2 className="text-2xl font-bold text-black dark:text-white">{t.paymentMethod}</h2>
              </div>
              <div className="space-y-4">
                <div 
                  onClick={() => setPaymentMethod('mtn')}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'mtn' ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-900/10' : 'border-card-border'
                  }`}
                >
                  <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center text-blue-900 font-bold text-xs p-1">MTN</div>
                  <div className="flex-1">
                    <p className="font-bold text-black dark:text-white">{t.mtnMoMo}</p>
                    <p className="text-sm text-gray-500">Pay with MTN MoMo</p>
                  </div>
                </div>
                <div 
                  onClick={() => setPaymentMethod('airtel')}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'airtel' ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-900/10' : 'border-card-border'
                  }`}
                >
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-xs p-1">Airtel</div>
                  <div className="flex-1">
                    <p className="font-bold text-black dark:text-white">{t.airtelMoney}</p>
                    <p className="text-sm text-gray-500">Pay with Airtel Money</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 border border-card-border shadow-sm">
              <label className="text-lg font-bold text-black dark:text-white mb-4 block">{t.pickupNotes}</label>
              <textarea
                rows={3}
                value={pickupNotes}
                onChange={(e) => setPickupNotes(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white"
                placeholder="Any special instructions..."
              />
            </div>
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 border border-card-border shadow-sm">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-2">{t.orderSummary}</h2>
              <div className="flex items-center gap-2 mb-6 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 rounded-xl w-fit">
                <MapPin size={14} className="text-orange-600" />
                <span className="text-xs font-bold text-orange-600">{selectedBranch}</span>
              </div>
              
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="relative w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {item.product.image ? (
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover p-1" />
                      ) : (
                        <ShoppingBag size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-black dark:text-white line-clamp-2">{item.product.name}</h3>
                      <p className="text-xs text-gray-500">×{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-card-border">
                <div className="flex justify-between items-center pt-4">
                  <span className="text-lg font-bold text-black dark:text-white">{t.total}</span>
                  <span className="text-2xl font-black text-orange-600">{formatPrice(totalPrice())}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing || items.length === 0}
                className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all mt-8 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? t.processing : t.placeOrder}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
