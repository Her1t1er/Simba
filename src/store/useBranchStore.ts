import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Branch = 
  | 'Simba Centenary'
  | 'Simba Gishushu'
  | 'Simba Kimironko'
  | 'Simba Kicukiro'
  | 'Simba Kigali Height'
  | 'Simba UTC'
  | 'Simba Gacuriro'
  | 'Simba Gikondo'
  | 'Simba sonatube'
  | 'Simba Kisimenti'
  | 'Simba Rebero'
  | 'Simba Nyamirambo'
  | 'Simba Musanze';

interface BranchState {
  selectedBranch: Branch | null;
  selectBranch: (branch: Branch) => void;
  clearBranch: () => void;
}

export const useBranchStore = create<BranchState>()(
  persist(
    (set) => ({
      selectedBranch: null,
      selectBranch: (branch) => set({ selectedBranch: branch }),
      clearBranch: () => set({ selectedBranch: null }),
    }),
    {
      name: 'simba-branch-storage',
    }
  )
);
