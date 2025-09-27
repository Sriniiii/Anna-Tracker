import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check } from 'lucide-react';

interface AnimatedButtonProps {
  onClick: () => void;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ onClick }) => {
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleClick = () => {
    if (status !== 'idle') return;
    onClick();
    setStatus('success');
    setTimeout(() => setStatus('idle'), 2000);
  };

  return (
    <button
      data-cursor-interactive
      onClick={handleClick}
      className={`btn-primary w-full flex items-center justify-center gap-2 text-sm ${status === 'success' ? 'bg-success-600 hover:bg-success-700' : ''}`}
      disabled={status !== 'idle'}
    >
      <AnimatePresence mode="popLayout">
        {status === 'idle' && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </motion.span>
        )}
        {status === 'success' && (
          <motion.span
            key="success"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Added!
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

export default AnimatedButton;
