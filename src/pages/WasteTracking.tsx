import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { WasteLog, Profile } from '../types/database';
import LogWasteModal from '../components/Modals/LogWasteModal';
import { useToast } from '../hooks/useToast';
import Toast from '../components/UI/Toast';
import { format } from 'date-fns';
import { faker } from '@faker-js/faker';
import { motion } from 'framer-motion';

type WasteLogWithProfile = WasteLog & { profiles: Profile | null };

const tableContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const tableRowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
  },
};

const WasteTracking: React.FC = () => {
  const { profile } = useAuth();
  const [wasteLogs, setWasteLogs] = useState<WasteLogWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const fetchWasteLogs = useCallback(() => {
    setLoading(true);
    const logs: WasteLogWithProfile[] = Array.from({ length: 20 }, () => ({
        id: faker.number.int(),
        created_at: faker.date.recent().toISOString(),
        user_id: faker.string.uuid(),
        item_name: faker.commerce.productName(),
        category: faker.helpers.arrayElement(['produce', 'dairy', 'bakery', 'meat', 'pantry', 'frozen']),
        quantity: faker.number.int({ min: 1, max: 20 }),
        unit: faker.helpers.arrayElement(['kg', 'grams', 'pieces']),
        reason: faker.helpers.arrayElement(['expired', 'spoiled', 'overordered', 'damaged']),
        waste_date: faker.date.recent({ days: 30 }).toISOString(),
        notes: faker.lorem.sentence(),
        profiles: {
            id: faker.string.uuid(),
            updated_at: faker.date.past().toISOString(),
            username: faker.internet.username(),
            full_name: faker.person.fullName(),
            avatar_url: faker.image.avatar(),
            website: faker.internet.url(),
            role: 'user',
            email: faker.internet.email(),
        }
    }));
    setWasteLogs(logs);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWasteLogs();
  }, [fetchWasteLogs]);

  const handleLogWasteSuccess = () => {
    showToast('success', 'Waste Logged', 'New waste entry has been recorded.');
    fetchWasteLogs();
  };

  const handleDelete = (logId: number) => {
    if (!window.confirm('Are you sure you want to delete this log?')) return;
    setWasteLogs(prev => prev.filter(log => log.id !== logId));
    showToast('success', 'Log Deleted', 'The waste log has been removed.');
  };

  return (
    <>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Waste Tracking</h1>
            <p className="text-text-secondary">Monitor and log your food waste data.</p>
          </div>
          <button data-cursor-interactive onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Log Waste
          </button>
        </div>

        <div className="card">
          {loading ? (
            <div className="text-center py-8">
              <div className="h-12 w-12 mx-auto animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
              <p className="mt-4 text-text-secondary">Loading waste logs...</p>
            </div>
          ) : wasteLogs.length === 0 ? (
            <div className="text-center py-12">
              <Trash2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">No waste logged yet</h3>
              <p className="text-text-secondary mb-4">Start tracking to understand your waste patterns.</p>
              <button data-cursor-interactive onClick={() => setIsModalOpen(true)} className="btn-primary">
                Log First Waste Entry
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-surface-border">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Item Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Date</th>
                    {profile?.role === 'admin' && <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">User</th>}
                    <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <motion.tbody 
                  className="bg-surface divide-y divide-surface-border"
                  variants={tableContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {wasteLogs.map((log) => (
                    <motion.tr 
                      key={log.id} 
                      variants={tableRowVariants}
                      className="transition-colors"
                      whileHover={{ backgroundColor: '#f8fafc' /* slate-50 */ }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{log.item_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary capitalize">{log.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{log.quantity} {log.unit}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary capitalize">{log.reason}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{format(new Date(log.waste_date), 'MMM dd, yyyy')}</td>
                      {profile?.role === 'admin' && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{log.profiles?.email || 'N/A'}</td>}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button data-cursor-interactive className="text-primary-600 hover:text-primary-900 p-1 rounded-md hover:bg-primary-100 transition-colors mr-4"><Edit className="h-4 w-4" /></button>
                        <button data-cursor-interactive onClick={() => handleDelete(log.id)} className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-100 transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      <LogWasteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleLogWasteSuccess}
      />
      <Toast {...toast} onClose={hideToast} />
    </>
  );
};

export default WasteTracking;
