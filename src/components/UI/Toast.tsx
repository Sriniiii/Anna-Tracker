import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, X, Info } from 'lucide-react';

interface ToastProps {
  isVisible: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  isVisible, 
  onClose, 
  type, 
  title, 
  message, 
  duration = 4000 
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: X,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: 'bg-success-50 border-success-200 text-success-800',
    error: 'bg-error-50 border-error-200 text-error-800',
    warning: 'bg-warning-50 border-warning-200 text-warning-800',
    info: 'bg-accent-50 border-accent-200 text-accent-800',
  };

  const iconColors = {
    success: 'text-success-500',
    error: 'text-error-500',
    warning: 'text-warning-500',
    info: 'text-accent-500',
  };

  const Icon = icons[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className={`rounded-lg border p-4 shadow-medium ${colors[type]} max-w-sm`}>
            <div className="flex items-start gap-3">
              <Icon className={`h-5 w-5 mt-0.5 ${iconColors[type]}`} />
              <div className="flex-1">
                <h4 className="font-medium">{title}</h4>
                {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
              </div>
              <button
                onClick={onClose}
                className="rounded p-1 hover:bg-black hover:bg-opacity-10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
