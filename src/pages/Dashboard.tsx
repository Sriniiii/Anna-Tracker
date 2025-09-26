import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Trash2, Leaf, ShoppingCart, CheckCircle, BarChart3 } from 'lucide-react';
import StatCard from '../components/Dashboard/StatCard';
import WasteChart from '../components/Dashboard/WasteChart';
import RecentActivity from '../components/Dashboard/RecentActivity';
import QuickActions from '../components/Dashboard/QuickActions';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([
    { title: 'Total Savings', value: '$0', change: '+0%', trend: 'up' as const, icon: DollarSign, color: 'primary' as const },
    { title: 'Waste Diverted', value: '0 lbs', change: '+0%', trend: 'up' as const, icon: Trash2, color: 'success' as const },
    { title: 'CO2 Emission Reduced', value: '0 lbs', change: '+0%', trend: 'up' as const, icon: Leaf, color: 'accent' as const },
    { title: 'Active Listings', value: '0', change: '+0%', trend: 'up' as const, icon: ShoppingCart, color: 'secondary' as const },
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

        // Calculate Total Savings
        const totalSavings = savingsData.data?.reduce((acc, item) => acc + (item.original_price - item.discounted_price), 0) || 0;
        
        // Calculate Waste Diverted
        const totalWasteDiverted = wasteData.data?.reduce((acc, item) => acc + item.quantity, 0) || 0;

        // Calculate CO2 Reduction (approx. 2.5 lbs CO2 per lb of food waste)
        const co2Reduced = totalWasteDiverted * 2.5;

        // Get Active Listings count
        const activeListings = listingsData.count || 0;

        // Calculate Waste by Category
        const categoryMap: { [key: string]: number } = {};
        categoryData.data?.forEach(item => {
          categoryMap[item.category] = (categoryMap[item.category] || 0) + item.quantity;
        });
        const totalWaste = Object.values(categoryMap).reduce((sum, val) => sum + val, 0);
        const categoryArray = Object.entries(categoryMap)
          .map(([category, amount]) => ({
            category,
            amount: `${totalWaste > 0 ? ((amount / totalWaste) * 100).toFixed(0) : 0}%`,
            color: categoryColors[category] || 'bg-gray-400',
          }))
          .sort((a,b) => parseFloat(b.amount) - parseFloat(a.amount));

        setStats([
          { title: 'Total Savings', value: `$${totalSavings.toFixed(2)}`, change: '+0%', trend: 'up' as const, icon: DollarSign, color: 'primary' as const },
          { title: 'Waste Diverted', value: `${totalWasteDiverted.toFixed(1)} lbs`, change: '+0%', trend: 'up' as const, icon: Trash2, color: 'success' as const },
          { title: 'CO2 Emission Reduced', value: `${co2Reduced.toFixed(1)} lbs`, change: '+0%', trend: 'up' as const, icon: Leaf, color: 'accent' as const },
          { title: 'Active Listings', value: activeListings.toString(), change: '+0%', trend: 'up' as const, icon: ShoppingCart, color: 'secondary' as const },
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
    produce: 'bg-success-500',
    dairy: 'bg-primary-500',
    bakery: 'bg-secondary-500',
    meat: 'bg-accent-500',
    pantry: 'bg-yellow-500',
    frozen: 'bg-blue-500'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your food waste overview.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CheckCircle className="h-4 w-4 text-success-500" />
          <span>All systems operational</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          [...Array(4)].map((_, index) => (
            <div key={index} className="card animate-pulse">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-12 w-12 rounded-lg bg-gray-200"></div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-5 w-28 bg-gray-200 rounded"></div>
              </div>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WasteChart />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentActivity />
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Waste by Category</h3>
          {loading ? (
             <div className="space-y-3 animate-pulse">
                {[...Array(4)].map((_, i) => <div key={i} className="h-6 bg-gray-200 rounded-md" />)}
             </div>
          ) : wasteByCategory.length > 0 ? (
            <div className="space-y-3">
              {wasteByCategory.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${item.color}`} />
                    <span className="text-sm text-gray-600 capitalize">{item.category}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.amount}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="mx-auto h-10 w-10 text-gray-300" />
              <h4 className="mt-2 text-sm font-medium text-gray-900">No Waste Data</h4>
              <p className="mt-1 text-sm text-gray-500">Log waste to see category breakdowns.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
