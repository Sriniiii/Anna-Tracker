import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Leaf, ShoppingCart, CheckCircle, BarChart3 } from 'lucide-react';
import StatCard from '../components/Dashboard/StatCard';
import WasteChart from '../components/Dashboard/WasteChart';
import RecentActivity from '../components/Dashboard/RecentActivity';
import { faker } from '@faker-js/faker';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState([
    { title: 'Total Savings', value: 0, prefix: '₹', suffix: '', change: '+0%', trend: 'up' as const, icon: () => <span className="font-bold text-blue-600">₹</span>, color: 'blue' as const },
    { title: 'Waste Diverted', value: 0, prefix: '', suffix: ' kg', change: '+0%', trend: 'up' as const, icon: Trash2, color: 'green' as const },
    { title: 'CO2 Reduced', value: 0, prefix: '', suffix: ' kg', change: '+0%', trend: 'up' as const, icon: Leaf, color: 'teal' as const },
    { title: 'Active Listings', value: 0, prefix: '', suffix: '', change: '+0%', trend: 'up' as const, icon: ShoppingCart, color: 'purple' as const },
  ]);
  const [wasteByCategory, setWasteByCategory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    try {
      const totalSavings = faker.number.int({ min: 80000, max: 400000 });
      const totalWasteDiverted = faker.number.float({ min: 50, max: 250, precision: 1 });
      const co2Reduced = totalWasteDiverted * 2.5;
      const activeListings = faker.number.int({ min: 10, max: 50 });

      const categories = ['produce', 'dairy', 'bakery', 'meat', 'pantry', 'frozen'];
      const categoryMap: { [key: string]: number } = {};
      categories.forEach(cat => {
        categoryMap[cat] = faker.number.int({ min: 10, max: 100 });
      });
      const totalWaste = Object.values(categoryMap).reduce((sum, val) => sum + val, 0);
      const categoryArray = Object.entries(categoryMap)
        .map(([category, amount]) => ({
          category,
          percentage: totalWaste > 0 ? (amount / totalWaste) * 100 : 0,
          color: categoryColors[category] || 'bg-neutral-400',
        }))
        .sort((a,b) => b.percentage - a.percentage);

      setStats([
        { title: 'Total Savings', value: totalSavings, prefix: '₹', suffix: '', change: `+${faker.number.float({ min: 1, max: 10, precision: 1 })}%`, trend: 'up' as const, icon: () => <span className="font-bold text-blue-600">₹</span>, color: 'blue' as const },
        { title: 'Waste Diverted', value: totalWasteDiverted, prefix: '', suffix: ' kg', change: `+${faker.number.float({ min: 1, max: 10, precision: 1 })}%`, trend: 'up' as const, icon: Trash2, color: 'green' as const },
        { title: 'CO2 Reduced', value: co2Reduced, prefix: '', suffix: ' kg', change: `+${faker.number.float({ min: 1, max: 10, precision: 1 })}%`, trend: 'up' as const, icon: Leaf, color: 'teal' as const },
        { title: 'Active Listings', value: activeListings, prefix: '', suffix: '', change: `+${faker.number.int({ min: 1, max: 5 })}`, trend: 'up' as const, icon: ShoppingCart, color: 'purple' as const },
      ]);

      setWasteByCategory(categoryArray);

    } catch (error) {
      console.error("Error generating dashboard data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const categoryColors: { [key: string]: string } = {
    produce: 'bg-green-500',
    dairy: 'bg-blue-500',
    bakery: 'bg-amber-500',
    meat: 'bg-red-500',
    pantry: 'bg-orange-500',
    frozen: 'bg-sky-500'
  };

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
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

      <motion.div 
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {loading ? (
          [...Array(4)].map((_, index) => (
            <div key={index} className="card animate-pulse h-[138px]">
              <div className="h-full bg-neutral-200 rounded-md"></div>
            </div>
          ))
        ) : (
          stats.map((stat) => (
            <motion.div key={stat.title} variants={itemVariants}>
              <StatCard {...stat} />
            </motion.div>
          ))
        )}
      </motion.div>

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
            <div className="h-10 animate-pulse bg-neutral-200 rounded-lg" />
        ) : wasteByCategory.length > 0 ? (
          <div>
            <div className="flex rounded-full overflow-hidden h-3 mb-4">
              {wasteByCategory.map((item, index) => (
                <motion.div
                  key={item.category}
                  className={`${item.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: index * 0.1 }}
                  title={`${item.category}: ${item.percentage.toFixed(1)}%`}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-2">
              {wasteByCategory.map((item) => (
                <div key={item.category} className="flex items-center gap-2 text-sm">
                  <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                  <span className="text-neutral-600 capitalize">{item.category}</span>
                  <span className="font-medium text-neutral-800">{item.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="mx-auto h-10 w-10 text-neutral-300" />
            <h4 className="mt-2 text-sm font-medium text-neutral-900">No Waste Data</h4>
            <p className="mt-1 text-sm text-neutral-500">Log waste to see category breakdowns.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
