import React, { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

const LiveCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
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

  const smoothMouse2 = {
    x: useSpring(mousePosition.x, { damping: 40, stiffness: 300 }),
    y: useSpring(mousePosition.y, { damping: 40, stiffness: 300 }),
  };

  return (
    <>
      {/* This is the trailing circle */}
      <motion.div
        style={{
          left: smoothMouse2.x,
          top: smoothMouse2.y,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="pointer-events-none fixed z-[9999] h-8 w-8 rounded-full bg-accent-500/20"
      />
      {/* This is the main dot */}
      <motion.div
        style={{
          left: smoothMouse.x,
          top: smoothMouse.y,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="pointer-events-none fixed z-[9999] h-2 w-2 rounded-full bg-accent-500"
      />
    </>
  );
};

export default LiveCursor;
