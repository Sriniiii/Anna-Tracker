import React, { useState, useEffect } from 'react';
import { Clock, Package, Users, TrendingDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { WasteLog, InventoryItem } from '../../types/database';

type Activity = {
  id: string;
  type: 'waste_reduced' | 'new_inventory';
  message: string;
  timestamp: Date;
  icon: React.ElementType;
  color: string;
};

const RecentActivity: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) return;
      setLoading(true);

      try {
        const [wasteLogs, inventoryItems] = await Promise.all([
          supabase
            .from('waste_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3),
          supabase
            .from('inventory_items')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3),
        ]);

        const combinedActivities: Activity[] = [];

        if (wasteLogs.data) {
          wasteLogs.data.forEach((log: WasteLog) => {
            combinedActivities.push({
              id: `waste-${log.id}`,
              type: 'waste_reduced',
              message: `${log.quantity} ${log.unit} of ${log.item_name} logged as waste.`,
              timestamp: new Date(log.created_at),
              icon: TrendingDown,
              color: 'text-secondary-500',
            });
          });
        }

        if (inventoryItems.data) {
          inventoryItems.data.forEach((item: InventoryItem) => {
            combinedActivities.push({
              id: `inventory-${item.id}`,
              type: 'new_inventory',
              message: `Added ${item.name} to inventory.`,
              timestamp: new Date(item.created_at),
              icon: Package,
              color: 'text-primary-500',
            });
          });
        }

        combinedActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setActivities(combinedActivities.slice(0, 5));
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user]);

  if (loading) {
    return (
      <div className="card">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">Recent Activity</h3>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="h-8 w-8 rounded-lg bg-gray-200"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-primary-600 hover:text-primary-700">View all</button>
      </div>
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`rounded-lg p-2 ${activity.color.replace('text-', 'bg-').replace('-500', '-100')}`}>
                <activity.icon className={`h-4 w-4 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Clock className="mx-auto h-10 w-10 text-gray-300" />
            <h4 className="mt-2 text-sm font-medium text-gray-900">No Recent Activity</h4>
            <p className="mt-1 text-sm text-gray-500">Add inventory or log waste to see activity here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
