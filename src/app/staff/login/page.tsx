'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/utils/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { translations } from '@/utils/translations';
import { Branch } from '@/store/useBranchStore';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, Store, ArrowRight } from 'lucide-react';

const branches: Branch[] = [
  'Simba Centenary',
  'Simba Gishushu',
  'Simba Kimironko',
  'Simba Kicukiro',
  'Simba Kigali Height',
  'Simba UTC',
  'Simba Gacuriro',
  'Simba Gikondo',
  'Simba sonatube',
  'Simba Kisimenti',
  'Simba Rebero',
  'Simba Nyamirambo',
  'Simba Musanze'
];

export default function StaffLoginPage() {
  const [email, setEmail] = useState('manager@simba.rw');
  const [password, setPassword] = useState('password123');
  const [selectedBranch, setSelectedBranch] = useState<Branch | ''>('Simba Centenary');
  const [isLoading, setIsLoading] = useState(false);
  const { staffLogin } = useAuthStore();
  const { language } = useSettingsStore();
  const t = translations[language];
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranch) {
      alert("Please select a branch");
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Attempting login...");
      const response = await api.login({
        email,
        password,
        branchName: selectedBranch
      });
      
      console.log("Login successful, response:", response);
      
      staffLogin({
        email: email,
        name: response.name,
        role: response.role,
        managedBranch: response.branchName
      }, response.token);
      
      router.push('/staff/dashboard');
    } catch (error: any) {
      console.error("Login failed error:", error);
      alert(`Login Failed: ${error.message || "Unknown error"}. Check if backend is running on port 8081.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Navbar onSearchChange={() => {}} onCartToggle={() => {}} onMenuToggle={() => {}} />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl p-8 border border-card-border shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 mx-auto mb-4">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black text-black dark:text-white mb-2">{t.staff.staffPortal}</h1>
            <p className="text-gray-500 dark:text-gray-400">{t.staff.managerLogin}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.staff.email}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white"
                  placeholder="manager@simba.rw"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.staff.password}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.staff.assignedBranch}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-600 transition-colors">
                  <Store size={18} />
                </div>
                <select
                  required
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value as Branch)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white appearance-none"
                >
                  <option value="">{t.staff.selectYourBranch}</option>
                  {branches.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black dark:bg-white dark:text-black text-white py-4 rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {t.staff.accessDashboard} <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            {t.staff.securityNote}
          </p>
        </div>
      </main>
    </div>
  );
}
