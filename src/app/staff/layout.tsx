'use client';

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LogOut, 
  LayoutDashboard, 
  Store, 
  ShoppingBag, 
  Layers, 
  Boxes, 
  ClipboardList,
  Languages,
  Sun,
  Moon
} from 'lucide-react';
import Link from 'next/link';
import { useSettingsStore, Language } from '@/store/useSettingsStore';
import { translations } from '@/utils/translations';

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { staffUser, staffLogout, isStaffAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { language, setLanguage, theme, toggleTheme } = useSettingsStore();
  const t = translations[language];

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'rw', label: 'Kinyarwanda' },
  ];

  const navigation = [
    { name: t.staff.dashboard, href: '/staff/dashboard', icon: LayoutDashboard },
    { name: t.staff.orders, href: '/staff/orders', icon: ClipboardList },
    { name: t.staff.products, href: '/staff/products', icon: ShoppingBag },
    { name: t.staff.categories, href: '/staff/categories', icon: Layers },
    { name: t.staff.stock, href: '/staff/stock', icon: Boxes },
  ];

  React.useEffect(() => {
    if (isStaffAuthenticated && staffUser) {
      const userRole = staffUser.role?.toLowerCase();
      if (userRole !== 'manager' && userRole !== 'admin') {
        router.push('/staff/login');
      }
    } else if (pathname !== '/staff/login') {
      router.push('/staff/login');
    }
  }, [isStaffAuthenticated, staffUser, router, pathname]);

  if (pathname === '/staff/login') {
    return <>{children}</>;
  }

  const userRole = staffUser?.role?.toLowerCase();
  if (!isStaffAuthenticated || !staffUser || (userRole !== 'manager' && userRole !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'dark bg-gray-950 text-white' : 'bg-gray-50 text-black'}`}>
      <div className="flex w-full">
        {/* Staff Sidebar */}
        <aside className="w-72 bg-white dark:bg-gray-900 border-r border-card-border flex flex-col hidden md:flex sticky top-0 h-screen overflow-hidden">
          <div className="p-6 border-b border-card-border flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <span className="text-xl font-bold text-black dark:text-white">
                Simba<span className="text-orange-600">Staff</span>
              </span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.name}
                  href={item.href} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                    isActive 
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                      : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-orange-600'
                  }`}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-card-border space-y-4 flex-shrink-0">
            {/* Settings Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{t.staff.settings}</span>
              </div>
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all"
              >
                <div className="flex items-center gap-3">
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                  <span>{theme === 'light' ? t.staff.darkMode : t.staff.lightMode}</span>
                </div>
              </button>

              {/* Language Selector */}
              <div className="relative group/lang">
                <button className="w-full flex items-center justify-between px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all">
                  <div className="flex items-center gap-3">
                    <Languages size={18} />
                    <span>{languages.find(l => l.code === language)?.label}</span>
                  </div>
                </button>
                <div className="absolute left-0 bottom-full mb-2 w-full bg-white dark:bg-gray-900 border border-card-border rounded-xl shadow-xl opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all py-2 z-50">
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
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600">
                  <Store size={16} />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{t.staff.activeBranch}</p>
              </div>
              <p className="text-sm font-bold text-black dark:text-white truncate">{staffUser.managedBranch}</p>
            </div>

            <button
              onClick={() => {
                staffLogout();
                router.push('/staff/login');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
            >
              <LogOut size={20} />
              {t.staff.logout}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Mobile Header */}
          <header className="h-16 bg-white dark:bg-gray-900 border-b border-card-border flex md:hidden items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <span className="font-bold text-black dark:text-white">Simba Staff</span>
              <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-800" />
              <button 
                onClick={() => {
                  const currentIndex = languages.findIndex(l => l.code === language);
                  const nextIndex = (currentIndex + 1) % languages.length;
                  setLanguage(languages[nextIndex].code);
                }}
                className="text-xs font-black uppercase text-orange-600"
              >
                {language}
              </button>
            </div>
            <button 
              onClick={() => {
                staffLogout();
                router.push('/staff/login');
              }}
              className="p-2 text-red-500"
            >
              <LogOut size={20} />
            </button>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
