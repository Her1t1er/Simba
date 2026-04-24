import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  name: string;
  email: string;
  role: string;
  managedBranch?: string;
}

interface AuthState {
  // Customer Session
  customerUser: User | null;
  customerToken: string | null;
  isCustomerAuthenticated: boolean;
  
  // Staff Session
  staffUser: User | null;
  staffToken: string | null;
  isStaffAuthenticated: boolean;

  // Actions
  login: (user: User, token: string) => void;
  staffLogin: (user: User, token: string) => void;
  signup: (user: User, token: string) => void;
  logout: () => void;
  staffLogout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      customerUser: null,
      customerToken: null,
      isCustomerAuthenticated: false,
      
      staffUser: null,
      staffToken: null,
      isStaffAuthenticated: false,

      login: (user, token) => 
        set({ 
          isCustomerAuthenticated: true, 
          customerUser: user,
          customerToken: token
        }),

      staffLogin: (user, token) =>
        set({
          isStaffAuthenticated: true,
          staffUser: user,
          staffToken: token
        }),

      signup: (user, token) => 
        set({ 
          isCustomerAuthenticated: true, 
          customerUser: user,
          customerToken: token
        }),

      logout: () => set({ 
        isCustomerAuthenticated: false, 
        customerUser: null, 
        customerToken: null 
      }),

      staffLogout: () => set({ 
        isStaffAuthenticated: false, 
        staffUser: null, 
        staffToken: null 
      }),
    }),
    {
      name: 'simba-auth-storage',
    }
  )
);
