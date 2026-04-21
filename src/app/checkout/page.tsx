'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useCartStore } from '@/store/useCartStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useBranchStore } from '@/store/useBranchStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrderStore, Order } from '@/store/useOrderStore';
import { translations } from '@/utils/translations';
import { Check, CreditCard, Truck, Smartphone, Banknote, ShoppingBag, ArrowRight, MapPin, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const { selectedBranch } = useBranchStore();
  const { user, isAuthenticated } = useAuthStore();
  const { addOrder } = useOrderStore();
  const { language } = useSettingsStore();
  const t = translations[language];

  const [isHydrated, setIsHydrated] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'mtn' | 'airtel' | 'card'>('mtn');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
    if (!selectedBranch) {
      router.push('/');
    }
    if (isHydrated && !isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [selectedBranch, isAuthenticated, isHydrated, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price) + ' RWF';
  };

  if (!isHydrated || !selectedBranch || !user) return null;

  const prepayment = totalPrice() * 0.1;
  const balanceDue = totalPrice() * 0.9;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Create actual order object
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: user.name,
      customerEmail: user.email,
      branch: selectedBranch,
      items: items.map(item => ({ product: item.product, quantity: item.quantity })),
      total: totalPrice(),
      prepaymentAmount: prepayment,
      balanceDue: balanceDue,
      prepaymentStatus: 'pending', // Will be verified by staff
      orderStatus: 'pending',
      createdAt: new Date().toISOString(),
      stockVerifiedItems: []
    };

    // Simulate order placement
    setTimeout(() => {
      addOrder(newOrder);
      setIsProcessing(false);
      setOrderPlaced(true);
      clearCart();
      
      // Navigate back home after 5 seconds
      setTimeout(() => {
        router.push('/');
      }, 5000);
    }, 2000);
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
          {/* Left Column: Forms */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Customer Information (Read-only) */}
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
                  <p className="font-bold text-black dark:text-white">{user.name}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-card-border">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">{t.emailAddress}</p>
                  <p className="font-bold text-black dark:text-white">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 border border-card-border shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <h2 className="text-2xl font-bold text-black dark:text-white">{t.paymentMethod}</h2>
              </div>

              <div className="space-y-4">
                {/* Credit/Debit Card */}
                <div 
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'card' 
                      ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-900/10' 
                      : 'border-card-border hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'card' ? 'border-orange-500' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'card' && <div className="w-3 h-3 bg-orange-500 rounded-full" />}
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
                    <CreditCard size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-black dark:text-white">{t.creditCard}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pay securely with your card</p>
                  </div>
                </div>

                {/* MTN MoMo */}
                <div 
                  onClick={() => setPaymentMethod('mtn')}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'mtn' 
                      ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-900/10' 
                      : 'border-card-border hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'mtn' ? 'border-orange-500' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'mtn' && <div className="w-3 h-3 bg-orange-500 rounded-full" />}
                  </div>
                  <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center text-blue-900 font-bold text-xs p-1">
                    MTN
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-black dark:text-white">{t.mtnMoMo}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pay with your MTN MoMo account</p>
                  </div>
                </div>

                {/* Airtel Money */}
                <div 
                  onClick={() => setPaymentMethod('airtel')}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'airtel' 
                      ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-900/10' 
                      : 'border-card-border hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'airtel' ? 'border-orange-500' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'airtel' && <div className="w-3 h-3 bg-orange-500 rounded-full" />}
                  </div>
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-xs p-1">
                    Airtel
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-black dark:text-white">{t.airtelMoney}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pay with your Airtel Money account</p>
                  </div>
                </div>

                {/* Credit Card Form (Conditional) */}
                {paymentMethod === 'card' && (
                  <div className="mt-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.cardNumber}</label>
                      <input
                        required
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.expiryDate}</label>
                        <input
                          required
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.cvv}</label>
                        <input
                          required
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.cardHolder}</label>
                      <input
                        required
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {/* Mobile Money Number Input (Conditional) */}
                {(paymentMethod === 'mtn' || paymentMethod === 'airtel') && (
                  <div className="mt-6 space-y-2 animate-in slide-in-from-top-2 duration-300">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.moMoNumber}</label>
                    <input
                      required
                      type="tel"
                      placeholder="07X XXX XXXX"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Pickup Notes (Moved here) */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 border border-card-border shadow-sm">
              <label className="text-lg font-bold text-black dark:text-white mb-4 block">{t.pickupNotes}</label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white"
                placeholder="Any special instructions for picking up your order..."
              />
            </div>
          </div>

          {/* Right Column: Order Summary */}
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
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover p-1"
                        />
                      ) : (
                        <ShoppingBag size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-black dark:text-white line-clamp-2">{item.product.name}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-500">×{item.quantity}</p>
                        <p className="text-sm font-bold text-black dark:text-white">{formatPrice(item.product.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-card-border">
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>{t.subtotal}</span>
                  <span className="font-bold text-black dark:text-white">{formatPrice(totalPrice())}</span>
                </div>
                <div className="flex justify-between text-orange-600">
                  <span className="font-bold">{t.prepaymentAmount}</span>
                  <span className="font-bold">{formatPrice(prepayment)}</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>{t.dueAtPickup}</span>
                  <span className="font-bold">{formatPrice(balanceDue)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-card-border">
                  <span className="text-lg font-bold text-black dark:text-white">{t.total}</span>
                  <span className="text-2xl font-black text-orange-600">{formatPrice(totalPrice())}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing || items.length === 0}
                className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all active:scale-[0.98] shadow-lg shadow-orange-600/20 mt-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t.processing}
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    {t.placeOrder}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>

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
