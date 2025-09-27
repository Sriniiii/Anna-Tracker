import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Leaf, ShoppingCart, CheckCircle } from 'lucide-react';
import StatCard from '../components/Dashboard/StatCard';
import WasteChart from '../components/Dashboard/WasteChart';
import RecentActivity from '../components/Dashboard/RecentActivity';
import { faker } from '@faker-js/faker';
import SpotlightCard from '../components/UI/SpotlightCard';

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
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    try {
      const totalSavings = faker.number.int({ min: 5000, max: 25000 });
      const totalWasteDiverted = faker.number.float({ min: 20, max: 100, precision: 1 });
      const co2Reduced = totalWasteDiverted * 2.5;
      const activeListings = faker.number.int({ min: 5, max: 30 });

      setStats([
        { title: 'Total Savings', value: totalSavings, prefix: '₹', suffix: '', icon: () => <span className="font-bold text-primary-600">₹</span>, color: 'blue' as const },
        { title: 'Waste Diverted', value: totalWasteDiverted, prefix: '', suffix: ' kg', icon: Trash2, color: 'green' as const },
        { title: 'CO2 Reduced', value: co2Reduced, prefix: '', suffix: ' kg', icon: Leaf, color: 'teal' as const },
        { title: 'Active Listings', value: activeListings, prefix: '', suffix: '', icon: ShoppingCart, color: 'pink' as const },
      ]);

    } catch (error) {
      console.error("Error generating dashboard data", error);
    } finally {
      setLoading(false);
    }
  }, []);

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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
              <SpotlightCard>
                <StatCard {...stat} />
              </SpotlightCard>
            </motion.div>
          ))
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SpotlightCard>
            <WasteChart />
          </SpotlightCard>
        </div>
        <div className="lg:col-span-1">
          <SpotlightCard>
            <RecentActivity />
          </SpotlightCard>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
