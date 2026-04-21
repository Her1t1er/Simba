import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Branch } from './useBranchStore';
import { Product } from '@/types';

export type PrepaymentStatus = 'pending' | 'verified';
export type OrderStatus = 'pending' | 'processing' | 'ready_for_pickup' | 'completed';

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  branch: Branch;
  items: OrderItem[];
  total: number;
  prepaymentAmount: number;
  balanceDue: number;
  prepaymentStatus: PrepaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  stockVerifiedItems: string[]; // Array of product IDs
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updatePrepaymentStatus: (orderId: string, status: PrepaymentStatus) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  toggleStockVerification: (orderId: string, productId: string) => void;
}

// Initial mock data
const initialOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    branch: 'Simba Kimironko',
    items: [
      {
        product: { id: 1, name: 'Lentz Radiant Heater', price: 83600, category: 'Kitchenware & Electronics', image: '', unit: '1 unit' },
        quantity: 1
      },
      {
        product: { id: 2, name: 'Tropical heat Salad Seasoning', price: 900, category: 'Food Products', image: '', unit: '50g' },
        quantity: 2
      }
    ],
    total: 85400,
    prepaymentAmount: 8540,
    balanceDue: 76860,
    prepaymentStatus: 'verified',
    orderStatus: 'pending',
    createdAt: new Date().toISOString(),
    stockVerifiedItems: []
  },
  {
    id: 'ORD-002',
    customerName: 'Alice Munyana',
    customerEmail: 'alice@test.rw',
    branch: 'Simba Gishushu',
    items: [
      {
        product: { id: 3, name: 'Herman Black Pepper', price: 5100, category: 'Food Products', image: '', unit: '100g' },
        quantity: 1
      }
    ],
    total: 5100,
    prepaymentAmount: 510,
    balanceDue: 4590,
    prepaymentStatus: 'pending',
    orderStatus: 'pending',
    createdAt: new Date().toISOString(),
    stockVerifiedItems: []
  },
  {
    id: 'ORD-003',
    customerName: 'Kevin Karasira',
    customerEmail: 'kevin@simba.com',
    branch: 'Simba Kimironko',
    items: [
      {
        product: { id: 4, name: 'Inyange Milk', price: 1000, category: 'Food Products', image: '', unit: '500ml' },
        quantity: 5
      }
    ],
    total: 5000,
    prepaymentAmount: 500,
    balanceDue: 4500,
    prepaymentStatus: 'verified',
    orderStatus: 'processing',
    createdAt: new Date().toISOString(),
    stockVerifiedItems: ['4']
  }
];

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: initialOrders,
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updatePrepaymentStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, prepaymentStatus: status } : o
          )
        })),
      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, orderStatus: status } : o
          )
        })),
      toggleStockVerification: (orderId, productId) =>
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id === orderId) {
              const isVerified = o.stockVerifiedItems.includes(productId);
              return {
                ...o,
                stockVerifiedItems: isVerified
                  ? o.stockVerifiedItems.filter((id) => id !== productId)
                  : [...o.stockVerifiedItems, productId]
              };
            }
            return o;
          })
        }))
    }),
    {
      name: 'simba-orders-storage'
    }
  )
);