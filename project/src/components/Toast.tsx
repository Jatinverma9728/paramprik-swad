import React, { useEffect } from 'react';
import { X } from 'lucide-react';

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
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
      <div className={`
        rounded-lg shadow-lg p-4 min-w-[200px] 
        flex items-center justify-between gap-2
        ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} 
        text-white
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[-1rem] opacity-0'}
        animate-slideIn
      `}>
        <span>{message}</span>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
