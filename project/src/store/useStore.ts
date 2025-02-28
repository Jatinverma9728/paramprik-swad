import { create } from 'zustand';
import { CartItem, Product, WishlistItem } from '../types';

interface Order {
  id: string;
  orderItems: CartItem[];
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  orderSummary: {
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
  };
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
}

interface Store {
  cart: CartItem[];
  wishlist: WishlistItem[];
  user: { isAuthenticated: boolean; data: null | { name: string; email: string } };
  toast: {
    message: string;
    isVisible: boolean;
    type: 'success' | 'error';
  };
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  setUser: (userData: { name: string; email: string } | null) => void;
  clearCart: () => void; // Add this line
  orders: Order[];
  lastOrder: Order | null;
  addOrder: (order: Omit<Order, 'id' | 'status' | 'date'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderById: (orderId: string) => Order | undefined; // Add this line
  clearOrders: () => void; // Add this line
}

const getInitialCart = (): CartItem[] => {
  const storedCart = localStorage.getItem('cart');
  return storedCart ? JSON.parse(storedCart) : [];
};

const getInitialWishlist = (): WishlistItem[] => {
  const storedWishlist = localStorage.getItem('wishlist');
  return storedWishlist ? JSON.parse(storedWishlist) : [];
};

const getInitialOrders = (): Order[] => {
  try {
    const stored = localStorage.getItem('orders');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
};

export const useStore = create<Store>((set) => ({
  cart: getInitialCart(),
  wishlist: getInitialWishlist(),
  user: { isAuthenticated: false, data: null },
  toast: {
    message: '',
    isVisible: false,
    type: 'success',
  },
  
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id);
      const updatedCart = existingItem
        ? state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...state.cart, { ...product, quantity: 1 }];
      
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      // Show toast notification
      set({
        toast: {
          message: existingItem ? 'Updated quantity in cart' : 'Added to cart',
          isVisible: true,
          type: 'success'
        }
      });

      // Hide toast after 2 seconds
      setTimeout(() => {
        set({ toast: { message: '', isVisible: false, type: 'success' } });
      }, 2000);

      return { cart: updatedCart };
    }),

  removeFromCart: (productId) =>
    set((state) => {
      const updatedCart = state.cart.filter((item) => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      // Show toast notification
      set({
        toast: {
          message: 'Removed from cart',
          isVisible: true,
          type: 'error'
        }
      });

      // Hide toast after 2 seconds
      setTimeout(() => {
        set({ toast: { message: '', isVisible: false, type: 'success' } });
      }, 2000);

      return { cart: updatedCart };
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      const updatedCart = state.cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return { cart: updatedCart };
    }),

  toggleWishlist: (product) =>
    set((state) => {
      const exists = state.wishlist.some((item) => item.id === product.id);
      const updatedWishlist = exists
        ? state.wishlist.filter((item) => item.id !== product.id)
        : [...state.wishlist, product];
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));

      // Show toast notification
      set({
        toast: {
          message: exists ? 'Removed from wishlist' : 'Added to wishlist',
          isVisible: true,
          type: exists ? 'error' : 'success'
        }
      });

      // Hide toast after 2 seconds
      setTimeout(() => {
        set({ toast: { message: '', isVisible: false, type: 'success' } });
      }, 2000);

      return { wishlist: updatedWishlist };
    }),

  setUser: (userData) =>
    set({
      user: {
        isAuthenticated: !!userData,
        data: userData,
      },
    }),

  // Add clearCart function
  clearCart: () => {
    set({ cart: [] });
  },

  orders: getInitialOrders(),
  lastOrder: null,

  addOrder: (orderData) => set(state => {
    try {
      const newOrder: Order = {
        ...orderData,
        id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: 'pending',
        date: new Date().toISOString()
      };
      
      const updatedOrders = [...state.orders, newOrder];
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      return {
        orders: updatedOrders,
        lastOrder: newOrder,
        cart: [] // Clear cart after successful order
      };
    } catch (error) {
      console.error('Error adding order:', error);
      return state;
    }
  }),

  updateOrderStatus: (orderId, status) => set(state => {
    try {
      const updatedOrders = state.orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      return { orders: updatedOrders };
    } catch (error) {
      console.error('Error updating order status:', error);
      return state;
    }
  }),

  // Add order utility functions
  getOrderById: (orderId: string) => {
    const state = useStore.getState();
    return state.orders.find(order => order.id === orderId);
  },

  // Add this to clear orders (for testing)
  clearOrders: () => set({ orders: [], lastOrder: null })
}));