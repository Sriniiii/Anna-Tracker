import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart, Download, DollarSign, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<any[]>([]);
  const [wasteByCategory, setWasteByCategory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!user) return;
      setLoading(true);

      try {
        const [savingsData, wasteData, listingsData, categoryData] = await Promise.all([
          supabase.from('marketplace_listings').select('original_price, discounted_price'),
          supabase.from('waste_logs').select('quantity'),
          supabase.from('marketplace_listings').select('id'),
          supabase.from('waste_logs').select('category, quantity'),
        ]);

        const totalSavings = savingsData.data?.reduce((acc, item) => acc + (item.original_price - item.discounted_price), 0) || 0;
        const totalWasteDiverted = wasteData.data?.reduce((acc, item) => acc + item.quantity, 0) || 0;
        const co2Reduced = totalWasteDiverted * 2.5;
        const itemsRedistributed = listingsData.data?.length || 0;

        setMetrics([
          { title: 'Cost Savings', value: `$${totalSavings.toFixed(2)}`, change: '+0%', trend: 'up', color: 'text-primary-500', icon: DollarSign },
          { title: 'Waste Diverted', value: `${totalWasteDiverted.toFixed(1)} lbs`, change: '+0%', trend: 'up', color: 'text-success-500', icon: TrendingUp },
          { title: 'Items Redistributed', value: itemsRedistributed, change: '+0%', trend: 'up', color: 'text-accent-500', icon: BarChart3 },
          { title: 'Carbon Footprint Reduced', value: `${co2Reduced.toFixed(1)} lbs CO2`, change: '+0%', trend: 'up', color: 'text-green-500', icon: Leaf },
        ]);

        const categoryMap: { [key: string]: number } = {};
        categoryData.data?.forEach(item => {
          categoryMap[item.category] = (categoryMap[item.category] || 0) + item.quantity;
        });

        const totalWaste = Object.values(categoryMap).reduce((sum, val) => sum + val, 0);
        const categoryArray = Object.entries(categoryMap)
          .map(([category, amount]) => ({
            category,
            percentage: totalWaste > 0 ? (amount / totalWaste) * 100 : 0,
            amount: `${amount.toFixed(1)} lbs`,
            color: categoryColors[category] || 'bg-gray-400',
          }))
          .sort((a,b) => b.percentage - a.percentage);
        
        setWasteByCategory(categoryArray);

      } catch (error) {
        console.error("Error fetching analytics data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
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
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights into your food waste management performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500">
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last year</option>
          </select>
          <button className="btn-primary flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading ? [...Array(4)].map((_, i) => (
          <div key={i} className="card h-36 animate-pulse bg-gray-100"></div>
        )) : metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
              <div className={`rounded-lg p-3 ${metric.color.replace('text-', 'bg-').replace('-500', '-100')}`}>
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className={`text-sm font-medium ${metric.color}`}>{metric.change}</span>
              <span className="text-sm text-gray-500">from last period</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Waste by Category</h3>
          {loading ? <div className="h-64 animate-pulse bg-gray-100 rounded-lg"></div> :
            wasteByCategory.length > 0 ? (
              <div className="space-y-4">
                {wasteByCategory.map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${item.color}`} />
                        <span className="text-sm font-medium text-gray-900 capitalize">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900">{item.percentage.toFixed(1)}%</span>
                        <span className="block text-xs text-gray-500">{item.amount}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <PieChart className="mx-auto h-12 w-12 text-gray-300" />
                <h4 className="mt-2 text-sm font-medium text-gray-900">No Waste Data</h4>
                <p className="mt-1 text-sm text-gray-500">Log waste to see category breakdowns.</p>
              </div>
            )
          }
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Trends</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Interactive chart coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
