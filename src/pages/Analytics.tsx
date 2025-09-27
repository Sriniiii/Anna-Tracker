import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart, Download, Leaf } from 'lucide-react';
import { faker } from '@faker-js/faker';
import AnimatedNumber from '../components/UI/AnimatedNumber';

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

const Analytics: React.FC = () => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [wasteByCategory, setWasteByCategory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    try {
      const totalSavings = faker.number.int({ min: 10000, max: 50000 });
      const totalWasteDiverted = faker.number.float({ min: 20, max: 120, precision: 0.1 });
      const co2Reduced = totalWasteDiverted * 2.5;
      const itemsRedistributed = faker.number.int({ min: 40, max: 150 });

      setMetrics([
        { title: 'Cost Savings', value: totalSavings, prefix: '₹', suffix: '', color: 'text-primary-500', icon: () => <span className="font-bold">₹</span> },
        { title: 'Waste Diverted', value: totalWasteDiverted, prefix: '', suffix: ' kg', color: 'text-success-500', icon: TrendingUp },
        { title: 'Items Redistributed', value: itemsRedistributed, prefix: '', suffix: '', color: 'text-accent-500', icon: BarChart3 },
        { title: 'Carbon Footprint Reduced', value: co2Reduced, prefix: '', suffix: ' kg CO2e', color: 'text-green-500', icon: Leaf },
      ]);

      const categoryMap: { [key: string]: number } = {};
      const categories = ['produce', 'dairy', 'bakery', 'meat', 'pantry', 'frozen'];
      categories.forEach(cat => {
        categoryMap[cat] = faker.number.int({ min: 5, max: 80 });
      });

      const totalWaste = Object.values(categoryMap).reduce((sum, val) => sum + val, 0);
      const categoryArray = Object.entries(categoryMap)
        .map(([category, amount]) => ({
          category,
          percentage: totalWaste > 0 ? (amount / totalWaste) * 100 : 0,
          amount: `${amount.toFixed(1)} kg`,
          color: categoryColors[category] || 'bg-gray-400',
        }))
        .sort((a,b) => b.percentage - a.percentage);
      
      setWasteByCategory(categoryArray);

    } catch (error) {
      console.error("Error generating analytics data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const categoryColors: { [key: string]: string } = {
    produce: 'bg-success-500',
    dairy: 'bg-primary-500',
    bakery: 'bg-secondary-500',
    meat: 'bg-accent-500',
    pantry: 'bg-yellow-500',
    frozen: 'bg-blue-500'
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
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
            Download Report
          </button>
        </div>
      </div>

      <motion.div 
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {loading ? [...Array(4)].map((_, i) => (
          <div key={i} className="card h-36 animate-pulse bg-gray-100"></div>
        )) : metrics.map((metric) => (
          <motion.div
            key={metric.title}
            variants={itemVariants}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <AnimatedNumber
                  value={metric.value}
                  prefix={metric.prefix}
                  suffix={metric.suffix}
                  className="text-2xl font-bold text-gray-900"
                />
              </div>
              <div className={`flex items-center justify-center rounded-lg p-3 h-12 w-12 ${metric.color.replace('text-', 'bg-').replace('-500', '-100')}`}>
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
              </div>
            </div>
            <div className="mt-4 h-5" /> {/* Placeholder for removed trend line to maintain card height */}
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Waste by Category</h3>
          {loading ? <div className="h-64 animate-pulse bg-gray-100 rounded-lg"></div> :
            wasteByCategory.length > 0 ? (
              <div className="space-y-4">
                {wasteByCategory.map((item, index) => (
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
                      <motion.div
                        className={`h-2 rounded-full ${item.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: index * 0.1 }}
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
    </motion.div>
  );
};

export default Analytics;
