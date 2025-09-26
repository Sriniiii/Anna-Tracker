import React from 'react';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: 'blue' | 'purple' | 'teal' | 'green' | 'yellow' | 'red';
}

const colorClasses = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600' },
  green: { bg: 'bg-green-100', text: 'text-green-600' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  red: { bg: 'bg-red-100', text: 'text-red-600' },
};

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon: Icon, color }) => {
  const { bg, text } = colorClasses[color];

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-600">{title}</p>
          <p className="text-2xl font-bold text-neutral-900">{value}</p>
        </div>
        <div className={`rounded-md p-3 ${bg}`}>
          <Icon className={`h-6 w-6 ${text}`} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        {trend === 'up' ? (
          <TrendingUp className="h-4 w-4 text-success-500" />
        ) : (
          <TrendingDown className="h-4 w-4 text-error-500" />
        )}
        <span className={`text-sm font-medium ${trend === 'up' ? 'text-success-600' : 'text-error-600'}`}>
          {change}
        </span>
        <span className="text-sm text-neutral-500">from last month</span>
      </div>
    </div>
  );
};

export default StatCard;
