import React, { useEffect } from 'react';
import { X, ShoppingCart, Heart, Check, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  type?: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  isVisible, 
  type = 'success',
  onClose 
}) => {
  const [isLeaving, setIsLeaving] = React.useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsLeaving(false);
      const timer = setTimeout(() => {
        setIsLeaving(true);
        setTimeout(onClose, 500); // Wait for animation to complete
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const Icon = type === 'success' ? Check : AlertCircle;
  const ActionIcon = message.toLowerCase().includes('cart') ? ShoppingCart : Heart;

  return (
    <div className="fixed inset-x-0 top-4 flex justify-center z-50">
      <div className={`
        rounded-lg shadow-lg p-4 min-w-[250px] max-w-md
        flex items-center justify-between gap-3 
        ${type === 'success' 
          ? 'bg-gradient-to-r from-green-500 to-green-600' 
          : 'bg-gradient-to-r from-red-500 to-red-600'} 
        text-white
        ${isLeaving ? 'animate-exitToTop' : 'animate-enterFromTop'}
        border border-white/20
        backdrop-blur-sm
      `}>
        <div className="flex items-center gap-2">
          <div className="p-1 bg-white/20 rounded-full animate-pulse">
            <Icon size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{message}</span>
            <div className="flex items-center gap-1 text-xs text-white/80">
              <ActionIcon size={12} />
              <span>{type === 'success' ? 'Added successfully' : 'Action failed'}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-white/20 rounded-full transition-colors duration-200
                     hover:rotate-90 transform transition-transform"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
