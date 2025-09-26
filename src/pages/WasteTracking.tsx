import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { WasteLog, Profile } from '../types/database';
import LogWasteModal from '../components/Modals/LogWasteModal';
import { useToast } from '../hooks/useToast';
import Toast from '../components/UI/Toast';
import { format } from 'date-fns';

type WasteLogWithProfile = WasteLog & { profiles: Profile | null };

const WasteTracking: React.FC = () => {
  const { user, profile } = useAuth();
  const [wasteLogs, setWasteLogs] = useState<WasteLogWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const fetchWasteLogs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    let query = supabase.from('waste_logs').select('*, profiles (full_name, email)');

    const { data, error } = await query.order('waste_date', { ascending: false });

    if (error) {
      console.error('Error fetching waste logs:', error);
      showToast('error', 'Fetch Failed', 'Could not fetch waste logs.');
    } else {
      setWasteLogs(data as any);
    }
    setLoading(false);
  }, [user, showToast]);

  useEffect(() => {
    fetchWasteLogs();
  }, [fetchWasteLogs]);

  const handleLogWasteSuccess = () => {
    showToast('success', 'Waste Logged', 'New waste entry has been recorded.');
    fetchWasteLogs();
  };

  const handleDelete = async (logId: number) => {
    if (!window.confirm('Are you sure you want to delete this log?')) return;

    const { error } = await supabase.from('waste_logs').delete().eq('id', logId);

    if (error) {
      showToast('error', 'Delete Failed', error.message);
    } else {
      showToast('success', 'Log Deleted', 'The waste log has been removed.');
      fetchWasteLogs();
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Waste Tracking</h1>
            <p className="text-gray-600">Monitor and log your food waste data.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Log Waste
          </button>
        </div>

        <div className="card">
          {loading ? (
            <div className="text-center py-8">
              <div className="h-12 w-12 mx-auto animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-500">Loading waste logs...</p>
            </div>
          ) : wasteLogs.length === 0 ? (
            <div className="text-center py-12">
              <Trash2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No waste logged yet</h3>
              <p className="text-gray-600 mb-4">Start tracking to understand your waste patterns.</p>
              <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                Log First Waste Entry
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    {profile?.role === 'admin' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>}
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {wasteLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.item_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{log.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.quantity} {log.unit}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{log.reason}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(log.waste_date), 'MMM dd, yyyy')}</td>
                      {profile?.role === 'admin' && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.profiles?.email || 'N/A'}</td>}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 mr-4"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(log.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

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
