import React from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

const icon = {
  hidden: {
    opacity: 0,
    pathLength: 0,
    fill: "rgba(167, 139, 250, 0)"
  },
  visible: {
    opacity: 1,
    pathLength: 1,
    fill: "rgba(167, 139, 250, 1)",
    transition: {
      default: { duration: 2, ease: "easeInOut" },
      fill: { duration: 2, ease: [1, 0, 0.8, 1] }
    }
  }
};

const AnimatedLogo: React.FC = () => {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-accent-600 text-white">
       <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path 
          d="M11 20A7 7 0 0 1 4 13H2a10 10 0 0 0 10 10zM2 13a10 10 0 0 1 10-10 10 10 0 0 1 10 10h-2a7 7 0 0 0-7-7 7 7 0 0 0-7 7z"
          variants={icon}
          initial="hidden"
          animate="visible"
        />
        <motion.path 
          d="M12 18a6 6 0 0 1-6-6h2a4 4 0 0 0 4 4 4 4 0 0 0 4-4h2a6 6 0 0 1-6 6z"
          variants={icon}
          initial="hidden"
          animate="visible"
        />
      </motion.svg>
    </div>
  );
};

export default AnimatedLogo;
