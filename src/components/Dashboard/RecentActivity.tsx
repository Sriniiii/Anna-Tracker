import React, { useState, useEffect } from 'react';
import { Clock, Package, TrendingDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { faker } from '@faker-js/faker';

type Activity = {
  id: string;
  type: 'waste_reduced' | 'new_inventory';
  message: string;
  timestamp: Date;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
};

const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const activityTypes = [
        {
            type: 'waste_reduced' as const,
            icon: TrendingDown,
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            generateMessage: () => `${faker.number.int({min: 1, max: 20})} ${faker.helpers.arrayElement(['kg', 'grams', 'pieces'])} of ${faker.commerce.productName()} logged as waste.`
        },
        {
            type: 'new_inventory' as const,
            icon: Package,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            generateMessage: () => `Added ${faker.commerce.productName()} to inventory.`
        }
    ];

    const generatedActivities: Activity[] = Array.from({ length: 5 }, () => {
        const activityConfig = faker.helpers.arrayElement(activityTypes);
        return {
            id: faker.string.uuid(),
            type: activityConfig.type,
            message: activityConfig.generateMessage(),
            timestamp: faker.date.recent({ days: 7 }),
            icon: activityConfig.icon,
            iconBg: activityConfig.iconBg,
            iconColor: activityConfig.iconColor,
        };
    });

    generatedActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setActivities(generatedActivities);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="card h-full">
        <h3 className="mb-6 text-lg font-semibold text-text-primary">Recent Activity</h3>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="h-10 w-10 rounded-full bg-slate-200"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card h-full">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
        <button className="text-sm text-primary-600 hover:text-primary-700">View all</button>
      </div>
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${activity.iconBg}`}>
                <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary">{activity.message}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3 text-slate-400" />
                  <span className="text-xs text-slate-500">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 h-full flex flex-col justify-center">
            <Clock className="mx-auto h-10 w-10 text-slate-300" />
            <h4 className="mt-2 text-sm font-medium text-text-primary">No Recent Activity</h4>
            <p className="mt-1 text-sm text-text-secondary">Add inventory or log waste to see activity here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
