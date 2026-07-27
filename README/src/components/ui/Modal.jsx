import { X } from 'lucide-react';

import { useEffect } from "react";
import { cn } from "../../utils/cn";

export default function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-md", fullScreen = false }) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className={cn("flex min-h-full items-center justify-center", fullScreen ? "p-0" : "p-4 sm:p-6")}>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-slate-900/50 transition-opacity" 
          onClick={onClose}
        />
        
        {/* Modal Content */}
        <div className={cn(
          "relative w-full bg-white dark:bg-slate-900 shadow-xl flex flex-col",
          fullScreen ? "min-h-screen rounded-none border-0" : "rounded-xl border border-slate-200 dark:border-slate-800 my-8 max-h-[90vh]",
          !fullScreen && maxWidth
        )}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-t-xl shrink-0">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-4 overflow-y-auto custom-scrollbar flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
