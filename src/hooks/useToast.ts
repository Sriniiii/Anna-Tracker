import { useState, useCallback } from 'react';

interface ToastState {
  isVisible: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showToast = useCallback((
    type: ToastState['type'],
    title: string,
    message?: string
  ) => {
    setToast({
      isVisible: true,
      type,
      title,
      message,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
};
