import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ShoppingCart } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  type: 'success' | 'error';
}

export const Toast = ({ message, isVisible, type }: ToastProps) => {
  const isCartAction = message.toLowerCase().includes('cart');
  const bgColor = type === 'success' 
    ? isCartAction ? 'bg-amber-500' : 'bg-green-500'
    : 'bg-red-500';
  
  const Icon = isCartAction 
    ? ShoppingCart 
    : type === 'success' 
      ? Check 
      : X;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-full shadow-lg z-[9999] flex items-center gap-2`}
        >
          <Icon className="h-5 w-5" />
          <span className="font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
