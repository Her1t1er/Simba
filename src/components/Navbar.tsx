'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, Sun, Moon, Languages, MapPin, User as UserIcon, LogOut, Bell, Package, CheckCircle, XCircle } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useSettingsStore, Language } from '@/store/useSettingsStore';
import { useBranchStore } from '@/store/useBranchStore';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/utils/api';
import { translations } from '@/utils/translations';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  onSearchChange: (query: string) => void;
  onCartToggle: () => void;
  onMenuToggle: () => void;
  onLogoClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearchChange, onCartToggle, onMenuToggle, onLogoClick }) => {
  const router = useRouter();
  const totalItems = useCartStore((state) => state.totalItems());
  const { selectedBranch, clearBranch } = useBranchStore();
  const { customerUser, logout, isCustomerAuthenticated } = useAuthStore();
  const { language, setLanguage, theme, toggleTheme } = useSettingsStore();
  const t = translations[language];

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (isCustomerAuthenticated && customerUser?.email) {
      const fetchCustomerOrders = async () => {
        try {
          const customerOrders = await api.getCustomerOrders(customerUser.email);
          // Sort by date
          const sortedOrders = customerOrders
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          
          // Only show interesting status updates (Verified or Declined) from last 24h
          const relevantOrders = sortedOrders.filter((o: any) => 
            o.prepaymentStatus === 'VERIFIED' || o.prepaymentStatus === 'DECLINED'
          ).slice(0, 5); // Keep last 5

          setNotifications(relevantOrders);
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        }
      };

      fetchCustomerOrders();
      const interval = setInterval(fetchCustomerOrders, 30000); // Polling every 30s
      return () => clearInterval(interval);
    }
  }, [isCustomerAuthenticated, customerUser?.email]);

  const handleBranchChange = () => {
    clearBranch();
    if (onLogoClick) onLogoClick();
    router.push('/');
  };

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'rw', label: 'Kinyarwanda' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-gray-950 border-b border-card-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-2">
            <button 
              onClick={onMenuToggle}
              className="p-2 -ml-2 lg:hidden text-black dark:text-gray-400 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <Menu size={24} />
            </button>
            <div 
              onClick={() => {
                if (onLogoClick) onLogoClick();
                router.push('/');
              }} 
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
                S
              </div>
              <span className="text-xl font-bold text-black dark:text-white hidden sm:block">
                Simba<span className="text-orange-600">Market</span>
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative group hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-600 dark:text-gray-500 transition-colors">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder={t.search}
              className="block w-full pl-10 pr-3 py-2 border border-card-border rounded-full bg-gray-100 dark:bg-gray-800 text-sm text-black dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Branch Selector (Desktop) - Only visible when branch is selected */}
            {selectedBranch && (
              <button 
                onClick={handleBranchChange}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-card-border rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-orange-600 hover:border-orange-500 transition-all group"
              >
                <MapPin size={14} className="text-orange-600" />
                <span className="max-w-[120px] truncate">{selectedBranch}</span>
              </button>
            )}

            {/* Language Selector */}
            <div className="relative group">
              <button className="p-2 text-black dark:text-gray-400 text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-1">
                <Languages size={20} />
                <span className="text-xs font-bold uppercase hidden sm:block">{language}</span>
              </button>
              <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-900 border border-card-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors ${
                      language === lang.code ? 'text-orange-600 font-bold' : 'text-black dark:text-gray-400 text-gray-600'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-black dark:text-gray-400 text-gray-600 hover:text-orange-600 transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Notifications */}
            {isCustomerAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-black dark:text-gray-400 text-gray-600 hover:text-orange-600 transition-colors relative"
                >
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-600 rounded-full border border-white dark:border-gray-950" />
                  )}
                </button>

                {showNotifications && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowNotifications(false)} 
                    />
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 border border-card-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-4 border-b border-card-border flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                        <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-wider">{t.notifications}</h3>
                        {notifications.length > 0 && (
                          <span className="text-[10px] bg-orange-600 text-white px-2 py-0.5 rounded-full font-bold">
                            {notifications.length}
                          </span>
                        )}
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center">
                            <Bell size={32} className="mx-auto text-gray-300 mb-2" />
                            <p className="text-sm text-gray-500">{t.noNotifications}</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-card-border">
                            {notifications.map((n) => (
                              <div key={n.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-default">
                                <div className="flex gap-3">
                                  <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                    n.prepaymentStatus === 'VERIFIED' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'
                                  }`}>
                                    {n.prepaymentStatus === 'VERIFIED' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                  </div>
                                  <div>
                                    <p className="text-xs font-black text-black dark:text-white mb-0.5">
                                      {t.orderStatusUpdate}
                                    </p>
                                    <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                                      {n.prepaymentStatus === 'VERIFIED' 
                                        ? t.orderVerifiedDesc.replace('{id}', n.id.toString())
                                        : t.orderDeclinedDesc.replace('{id}', n.id.toString()).replace('{reason}', n.declineReason || 'N/A')
                                      }
                                    </p>
                                    <p className="text-[9px] text-gray-400 mt-2 font-bold uppercase">
                                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Cart Icon */}
            <button
              onClick={onCartToggle}
              className="relative p-2 text-black dark:text-gray-400 text-gray-600 hover:text-orange-600 transition-colors group"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-orange-600 rounded-full border-2 border-white dark:border-gray-950 transform translate-x-1 -translate-y-1">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Account / Login */}
            {isCustomerAuthenticated ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-card-border rounded-xl">
                <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                  {customerUser?.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-black dark:text-white hidden sm:block max-w-[80px] truncate">
                  {customerUser?.name}
                </span>
                <button 
                  onClick={() => logout()}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <Link 
                href="/login"
                className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10"
              >
                <UserIcon size={16} />
                <span className="hidden sm:block">Login</span>
              </Link>
            )}
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder={t.search}
              className="block w-full pl-9 pr-3 py-2 border border-card-border rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-black dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

