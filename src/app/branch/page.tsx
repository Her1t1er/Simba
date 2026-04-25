'use client';

import React from 'react';
import { useBranchStore, Branch } from '@/store/useBranchStore';
import { useRouter } from 'next/navigation';
import { MapPin, ArrowRight } from 'lucide-react';

const branchesWithLocations = [
  { name: 'Simba Centenary' as Branch, location: 'KN 4 Ave, City Center (Town)' },
  { name: 'Simba Gishushu' as Branch, location: 'KN 5 Rd, Near Parliament' },
  { name: 'Simba Kimironko' as Branch, location: 'KG 11 Ave, Near Kimironko Market' },
  { name: 'Simba Kicukiro' as Branch, location: 'Kicukiro Centre, Sonatubes' },
  { name: 'Simba Kigali Height' as Branch, location: 'KG 7 Ave, Opposite Convention Centre' },
  { name: 'Simba UTC' as Branch, location: 'KN 4 Ave, Union Trade Center' },
  { name: 'Simba Gacuriro' as Branch, location: 'Near Vision City' },
  { name: 'Simba Gikondo' as Branch, location: 'Gikondo Industrial Area' },
  { name: 'Simba sonatube' as Branch, location: 'KN 3 Rd, Sonatube Roundabout' },
  { name: 'Simba Kisimenti' as Branch, location: 'KG 5 Ave, Remera' },
  { name: 'Simba Rebero' as Branch, location: 'Rebero Hill' },
  { name: 'Simba Nyamirambo' as Branch, location: 'KN 2 Ave, Nyamirambo' },
  { name: 'Simba Musanze' as Branch, location: 'Musanze City Center' }
];

export default function BranchSelectionPage() {
  const { selectBranch } = useBranchStore();
  const router = useRouter();

  const handleBranchSelect = (branch: Branch) => {
    selectBranch(branch);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-bold text-4xl mx-auto mb-6 shadow-xl shadow-orange-600/20">
            S
          </div>
          <h1 className="text-4xl font-black text-black dark:text-white mb-4">
            Welcome to <span className="text-orange-600">Simba Market</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Please select a branch to start your shopping experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {branchesWithLocations.map((branch) => (
            <button
              key={branch.name}
              onClick={() => handleBranchSelect(branch.name)}
              className="group bg-white dark:bg-gray-900 p-6 rounded-2xl border border-card-border hover:border-orange-500 hover:shadow-lg hover:shadow-orange-600/5 transition-all text-left flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="font-bold text-black dark:text-white group-hover:text-orange-600 transition-colors">
                    {branch.name}
                  </p>
                  <p className="text-[10px] text-gray-500 group-hover:text-gray-400 mt-1">
                    {branch.location}
                  </p>
                </div>
              </div>
              <ArrowRight size={18} className="text-gray-300 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
        
        <p className="text-center text-gray-400 dark:text-gray-500 mt-12 text-sm">
          Select the location nearest to you for faster delivery
        </p>
      </div>
    </div>
  );
}
