'use client';

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LogOut, 
  LayoutDashboard, 
  Settings, 
  User, 
  Store, 
  ShoppingBag, 
  Layers, 
  Boxes, 
  ClipboardList 
} from 'lucide-react';
import Link from 'next/link';

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/staff/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/staff/orders', icon: ClipboardList },
    { name: 'Products', href: '/staff/products', icon: ShoppingBag },
    { name: 'Categories', href: '/staff/categories', icon: Layers },
    { name: 'Stock Management', href: '/staff/stock', icon: Boxes },
  ];

  React.useEffect(() => {
    if (pathname !== '/staff/login' && (!isAuthenticated || user?.role !== 'manager')) {
      router.push('/staff/login');
    }
  }, [isAuthenticated, user, router, pathname]);

  if (pathname === '/staff/login') {
    return <>{children}</>;
  }

  if (!user || user.role !== 'manager') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Staff Sidebar */}
      <aside className="w-72 bg-white dark:bg-gray-900 border-r border-card-border flex flex-col hidden md:flex">
        <div className="p-6 border-b border-card-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <span className="text-xl font-bold text-black dark:text-white">
              Simba<span className="text-orange-600">Staff</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
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

        <div className="p-4 border-t border-card-border">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600">
                <Store size={16} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Active Branch</p>
            </div>
            <p className="text-sm font-bold text-black dark:text-white truncate">{user.managedBranch}</p>
          </div>

          <button
            onClick={() => {
              logout();
              router.push('/staff/login');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-card-border flex md:hidden items-center justify-between px-4">
          <span className="font-bold text-black dark:text-white">Simba Staff</span>
          <button 
            onClick={() => {
              logout();
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
  );
}
