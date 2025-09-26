import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Trash2, Leaf, ShoppingCart, CheckCircle, BarChart3 } from 'lucide-react';
import StatCard from '../components/Dashboard/StatCard';
import WasteChart from '../components/Dashboard/WasteChart';
import RecentActivity from '../components/Dashboard/RecentActivity';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([
    { title: 'Total Savings', value: '$0', change: '+0%', trend: 'up' as const, icon: DollarSign, color: 'blue' as const },
    { title: 'Waste Diverted', value: '0 lbs', change: '+0%', trend: 'up' as const, icon: Trash2, color: 'green' as const },
    { title: 'CO2 Reduced', value: '0 lbs', change: '+0%', trend: 'up' as const, icon: Leaf, color: 'teal' as const },
    { title: 'Active Listings', value: '0', change: '+0%', trend: 'up' as const, icon: ShoppingCart, color: 'purple' as const },
  ]);
  const [wasteByCategory, setWasteByCategory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      setLoading(true);

      try {
        const [savingsData, wasteData, listingsData, categoryData] = await Promise.all([
          supabase.from('marketplace_listings').select('original_price, discounted_price'),
          supabase.from('waste_logs').select('quantity'),
          supabase.from('marketplace_listings').select('id', { count: 'exact' }),
          supabase.from('waste_logs').select('category, quantity'),
        ]);

        const totalSavings = savingsData.data?.reduce((acc, item) => acc + (item.original_price - item.discounted_price), 0) || 0;
        const totalWasteDiverted = wasteData.data?.reduce((acc, item) => acc + item.quantity, 0) || 0;
        const co2Reduced = totalWasteDiverted * 2.5;
        const activeListings = listingsData.count || 0;

        const categoryMap: { [key: string]: number } = {};
        categoryData.data?.forEach(item => {
          categoryMap[item.category] = (categoryMap[item.category] || 0) + item.quantity;
        });
        const totalWaste = Object.values(categoryMap).reduce((sum, val) => sum + val, 0);
        const categoryArray = Object.entries(categoryMap)
          .map(([category, amount]) => ({
            category,
            amount: `${totalWaste > 0 ? ((amount / totalWaste) * 100).toFixed(0) : 0}%`,
            color: categoryColors[category] || 'bg-neutral-400',
          }))
          .sort((a,b) => parseFloat(b.amount) - parseFloat(a.amount));

        setStats([
          { title: 'Total Savings', value: `$${totalSavings.toFixed(2)}`, change: '+0%', trend: 'up' as const, icon: DollarSign, color: 'blue' as const },
          { title: 'Waste Diverted', value: `${totalWasteDiverted.toFixed(1)} lbs`, change: '+0%', trend: 'up' as const, icon: Trash2, color: 'green' as const },
          { title: 'CO2 Reduced', value: `${co2Reduced.toFixed(1)} lbs`, change: '+0%', trend: 'up' as const, icon: Leaf, color: 'teal' as const },
          { title: 'Active Listings', value: activeListings.toString(), change: '+0%', trend: 'up' as const, icon: ShoppingCart, color: 'purple' as const },
        ]);

        setWasteByCategory(categoryArray);

      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const categoryColors: { [key: string]: string } = {
    produce: 'bg-green-500',
    dairy: 'bg-blue-500',
    bakery: 'bg-amber-500',
    meat: 'bg-red-500',
    pantry: 'bg-orange-500',
    frozen: 'bg-sky-500'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-600">Welcome back! Here's your food waste overview.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <CheckCircle className="h-4 w-4 text-success-500" />
          <span>All systems operational</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          [...Array(4)].map((_, index) => (
            <div key={index} className="card animate-pulse h-[138px]">
              <div className="h-full bg-neutral-200 rounded-md"></div>
            </div>
          ))
        ) : (
          stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <WasteChart />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>

      <div className="card">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">Waste by Category</h3>
        {loading ? (
            <div className="space-y-3 animate-pulse">
              {[...Array(4)].map((_, i) => <div key={i} className="h-6 bg-neutral-200 rounded-md" />)}
            </div>
        ) : wasteByCategory.length > 0 ? (
          <div className="space-y-3">
            {wasteByCategory.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-neutral-600 capitalize">{item.category}</span>
                </div>
                <span className="text-sm font-medium text-neutral-900">{item.amount}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="mx-auto h-10 w-10 text-neutral-300" />
            <h4 className="mt-2 text-sm font-medium text-neutral-900">No Waste Data</h4>
            <p className="mt-1 text-sm text-neutral-500">Log waste to see category breakdowns.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
