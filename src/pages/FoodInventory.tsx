import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Package, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { InventoryItem, Profile } from '../types/database';
import AddInventoryModal from '../components/Modals/AddInventoryModal';
import { useToast } from '../hooks/useToast';
import Toast from '../components/UI/Toast';
import { format } from 'date-fns';

type InventoryItemWithProfile = InventoryItem & { profiles: Profile | null };

const FoodInventory: React.FC = () => {
  const { user, profile } = useAuth();
  const [inventory, setInventory] = useState<InventoryItemWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const fetchInventory = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    let query = supabase.from('inventory_items').select('*, profiles (full_name, email)');

    const { data, error } = await query.order('expiration_date', { ascending: true });

    if (error) {
      console.error('Error fetching inventory:', error);
      showToast('error', 'Fetch Failed', 'Could not fetch inventory data.');
    } else {
      setInventory(data as any);
    }
    setLoading(false);
  }, [user, showToast]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleAddItemSuccess = () => {
    showToast('success', 'Item Added', 'New item has been added to your inventory.');
    fetchInventory();
  };

  const handleDelete = async (itemId: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    const { error } = await supabase.from('inventory_items').delete().eq('id', itemId);

    if (error) {
      showToast('error', 'Delete Failed', error.message);
    } else {
      showToast('success', 'Item Deleted', 'The item has been removed from inventory.');
      fetchInventory();
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Food Inventory</h1>
            <p className="text-gray-600">Manage your food items and track expiration dates.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>

        <div className="card">
          {loading ? (
            <div className="text-center py-8">
              <div className="h-12 w-12 mx-auto animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-500">Loading inventory...</p>
            </div>
          ) : inventory.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items in inventory</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first food item.</p>
              <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                Add First Item
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires On</th>
                    {profile?.role === 'admin' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>}
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventory.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity} {item.unit}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(item.expiration_date), 'MMM dd, yyyy')}</td>
                      {profile?.role === 'admin' && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.profiles?.email || 'N/A'}</td>}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 mr-4"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AddInventoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddItemSuccess}
      />
      <Toast {...toast} onClose={hideToast} />
    </>
  );
};

export default FoodInventory;
