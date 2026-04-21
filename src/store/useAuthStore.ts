import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Branch } from './useBranchStore';

export type UserRole = 'customer' | 'manager';

interface User {
  name: string;
  email: string;
  role: UserRole;
  managedBranch?: Branch;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, name?: string) => void;
  staffLogin: (email: string, branch: Branch, name?: string) => void;
  signup: (email: string, name: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (email, name) => 
        set({ 
          isAuthenticated: true, 
          user: { 
            email, 
            name: name || email.split('@')[0],
            role: 'customer'
          } 
        }),
      staffLogin: (email, branch, name) =>
        set({
          isAuthenticated: true,
          user: {
            email,
            name: name || email.split('@')[0],
            role: 'manager',
            managedBranch: branch
          }
        }),
      signup: (email, name) => 
        set({ 
          isAuthenticated: true, 
          user: { 
            email, 
            name,
            role: 'customer'
          } 
        }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: 'simba-auth-storage',
    }
  )
);
