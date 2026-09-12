import React, { useEffect } from 'react';
import { Check } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className="fixed top-5 right-5 z-50 bg-black text-white px-4 py-3 rounded-md shadow-xl flex items-center gap-3 border border-gray-800 animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-auto">
      <Check className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2.5} />
      <span className="font-jakarta text-xs font-medium tracking-wide">
        {toast.text}
      </span>
    </div>
  );
};
