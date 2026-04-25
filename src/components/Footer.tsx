'use client';

import React from 'react';
import { Mail, Phone, MapPin, Globe, Send, Camera, Play, ArrowRight } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { translations } from '@/utils/translations';
import Link from 'next/link';

const Footer = () => {
  const { language } = useSettingsStore();
  const t = translations[language];

  return (
    <footer className="bg-[#0a0a0a] text-white border-t border-white/10 pt-8 pb-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-8">
          {/* Column 1: Brand & Newsletter */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-black text-xl">
                S
              </div>
              <span className="text-xl font-black tracking-tighter">
                Simba<span className="text-orange-600">Market</span>
              </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              Quality and variety in Kigali since 1969.
            </p>
            
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 focus-within:border-orange-600 transition-all max-w-xs">
              <input 
                type="email" 
                placeholder="Email for deals" 
                className="bg-transparent border-none focus:ring-0 text-xs flex-1 px-2 outline-none"
              />
              <button className="bg-orange-600 hover:bg-orange-700 text-white p-1.5 rounded-lg transition-all">
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/?shop=true" className="text-gray-400 hover:text-white transition-colors text-xs font-bold">All Products</Link></li>
              <li><Link href="/?shop=true" className="text-gray-400 hover:text-white transition-colors text-xs font-bold">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-xs font-bold">Help Center</Link></li>
              <li><Link href="/staff/login" className="text-gray-400 hover:text-white transition-colors text-xs font-bold">Staff Portal</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-4">Contact</h4>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <MapPin className="text-orange-500" size={14} />
                <span>Kigali City Center</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Phone className="text-orange-500" size={14} />
                <span>+250 788 000 000</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <a href="#" className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-gray-400 hover:bg-orange-600 hover:text-white transition-all"><Globe size={14} /></a>
              <a href="#" className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-gray-400 hover:bg-orange-600 hover:text-white transition-all"><Send size={14} /></a>
              <a href="#" className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-gray-400 hover:bg-orange-600 hover:text-white transition-all"><Camera size={14} /></a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-[10px] font-bold">
            © 2026 Simba Market Rwanda.
          </p>
          
          <div className="flex items-center gap-3 grayscale opacity-50">
            <div className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[8px] font-black italic">VISA</div>
            <div className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[8px] font-black italic text-orange-500">MOMO</div>
            <div className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[8px] font-black italic">AIRTEL</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
