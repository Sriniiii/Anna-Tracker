import React, { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, prefix = '', suffix = '', className }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    const roundedValue = value % 1 !== 0 ? latest.toFixed(1) : Math.round(latest).toLocaleString('en-IN');
    return `${prefix}${roundedValue}${suffix}`;
  });

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1], // EaseOutQuint
    });
    return controls.stop;
  }, [value, count]);

  return <motion.span className={className}>{rounded}</motion.span>;
};

export default AnimatedNumber;
