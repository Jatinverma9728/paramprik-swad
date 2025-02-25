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
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`
        rounded-lg shadow-lg p-4 min-w-[200px] 
        flex items-center justify-between gap-2
        ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} 
        text-white
      `}>
        <span>{message}</span>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-full"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
