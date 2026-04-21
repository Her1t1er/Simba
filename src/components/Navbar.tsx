'use client';

import React from 'react';
import { ShoppingCart, Search, Menu, Sun, Moon, Languages } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useSettingsStore, Language } from '@/store/useSettingsStore';
import { translations } from '@/utils/translations';
import Link from 'next/link';

interface NavbarProps {
  onSearchChange: (query: string) => void;
  onCartToggle: () => void;
  onMenuToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearchChange, onCartToggle, onMenuToggle }) => {
  const totalItems = useCartStore((state) => state.totalItems());
  const { language, setLanguage, theme, toggleTheme } = useSettingsStore();
  const t = translations[language];

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
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <span className="text-xl font-bold text-black dark:text-white hidden sm:block">
                Simba<span className="text-orange-600">Market</span>
              </span>
            </Link>
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
