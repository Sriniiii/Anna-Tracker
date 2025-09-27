import React, { useState, useEffect } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';

const LiveCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
      
      const target = event.target as HTMLElement;
      const interactive = target.closest('[data-cursor-interactive]');
      setIsInteractive(!!interactive);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const springConfig = { damping: 25, stiffness: 400 };
  const smoothMouse = {
    x: useSpring(mousePosition.x, springConfig),
    y: useSpring(mousePosition.y, springConfig),
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      <AnimatePresence>
        <motion.div
          key={isInteractive ? 'interactive' : 'default'}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          style={{
            left: smoothMouse.x,
            top: smoothMouse.y,
            translateX: '-50%',
            translateY: '-50%',
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          {isInteractive ? (
            <div className="h-8 w-8 rounded-full bg-accent-500/20" />
          ) : (
            <div className="h-2 w-2 rounded-full bg-accent-500" />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LiveCursor;
