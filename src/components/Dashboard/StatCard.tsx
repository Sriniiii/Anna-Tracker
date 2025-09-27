import React from 'react';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedNumber from '../UI/AnimatedNumber';

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon | React.FC<any>;
  color: 'blue' | 'pink' | 'teal' | 'green' | 'yellow' | 'red';
}

const colorClasses = {
  blue: { bg: 'bg-primary-100', text: 'text-primary-600' },
  pink: { bg: 'bg-accent-100', text: 'text-accent-600' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600' },
  green: { bg: 'bg-green-100', text: 'text-green-600' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  red: { bg: 'bg-red-100', text: 'text-red-600' },
};

const StatCard: React.FC<StatCardProps> = ({ title, value, prefix, suffix, change, trend, icon: Icon, color }) => {
  const { bg, text } = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div 
      className="card"
      whileHover={{ y: -6, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="flex items-start justify-between">
        <div className={`rounded-lg p-3 ${bg}`}>
          <Icon className={`h-6 w-6 ${text}`} />
        </div>
        <div className="flex items-center gap-1">
          {trend === 'up' ? (
            <TrendingUp className="h-4 w-4 text-success-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-error-500" />
          )}
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-success-600' : 'text-error-600'}`}>
            {change}
          </span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-neutral-600">{title}</p>
        <AnimatedNumber 
          value={value}
          prefix={prefix}
          suffix={suffix}
          className="text-2xl font-bold text-neutral-900"
        />
      </div>
    </motion.div>
  );
};

export default StatCard;
