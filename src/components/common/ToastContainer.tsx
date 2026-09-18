import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`toast-${toast.id}`}
          className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white transition-all transform animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            )}
            {toast.type === 'warning' && (
              <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            )}
            {toast.type === 'info' && (
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
              {toast.title}
            </h4>
            {toast.description && (
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {toast.description}
              </p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 -mr-1 -mt-1 rounded-md"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
