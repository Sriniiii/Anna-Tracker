import React from 'react';
import { type LucideIcon } from 'lucide-react';
import AnimatedNumber from '../UI/AnimatedNumber';

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon | React.FC<any>;
  color: 'blue' | 'green' | 'teal' | 'pink';
}

const colorClasses = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  green: { bg: 'bg-green-100', text: 'text-green-600' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-600' },
};

const StatCard: React.FC<StatCardProps> = ({ title, value, prefix, suffix, icon: Icon, color }) => {
  const { bg, text } = colorClasses[color] || colorClasses.blue;

  return (
    <div className="card p-5 h-full">
      <div className="flex items-start justify-between">
        <div className={`rounded-lg p-3 ${bg}`}>
          <Icon className={`h-6 w-6 ${text}`} />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        <AnimatedNumber 
          value={value}
          prefix={prefix}
          suffix={suffix}
          className="text-2xl font-bold text-text-primary"
        />
      </div>
    </div>
  );
};

export default StatCard;
