import { create } from 'zustand';
import { CartItem, Product, WishlistItem } from '../types';

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
}

const getInitialCart = (): CartItem[] => {
  const storedCart = localStorage.getItem('cart');
  return storedCart ? JSON.parse(storedCart) : [];
};

const getInitialWishlist = (): WishlistItem[] => {
  const storedWishlist = localStorage.getItem('wishlist');
  return storedWishlist ? JSON.parse(storedWishlist) : [];
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
}));