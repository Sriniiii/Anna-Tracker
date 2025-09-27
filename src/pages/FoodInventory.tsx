import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Package, Edit, Trash2, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { InventoryItem, Profile } from '../types/database';
import AddInventoryModal from '../components/Modals/AddInventoryModal';
import { useToast } from '../hooks/useToast';
import Toast from '../components/UI/Toast';
import { format, differenceInDays } from 'date-fns';
import { faker } from '@faker-js/faker';
import { motion } from 'framer-motion';

type InventoryItemWithProfile = InventoryItem & { profiles: Profile | null };

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

const FoodInventory: React.FC = () => {
  const { profile } = useAuth();
  const [inventory, setInventory] = useState<InventoryItemWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const fetchInventory = useCallback(() => {
    setLoading(true);
    const items: InventoryItemWithProfile[] = Array.from({ length: 15 }, () => ({
        id: faker.number.int(),
        created_at: faker.date.recent().toISOString(),
        user_id: faker.string.uuid(),
        name: faker.commerce.productName(),
        category: faker.helpers.arrayElement(['produce', 'dairy', 'bakery', 'meat', 'pantry', 'frozen']),
        quantity: faker.number.int({ min: 1, max: 100 }),
        unit: faker.helpers.arrayElement(['kg', 'grams', 'pieces', 'liters', 'boxes']),
        expiration_date: faker.date.future({years: 0.1}).toISOString(),
        purchase_price: parseFloat(faker.finance.amount({ min: 50, max: 2000, dec: 0 })),
        storage_location: faker.helpers.arrayElement(['Refrigerator', 'Pantry', 'Freezer']),
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
    setInventory(items);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleAddItemSuccess = () => {
    showToast('success', 'Item Added', 'New item has been added to your inventory.');
    fetchInventory();
  };

  const handleDelete = (itemId: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setInventory(prev => prev.filter(item => item.id !== itemId));
    showToast('success', 'Item Deleted', 'The item has been removed from inventory.');
  };
  
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ExpiryStatus: React.FC<{ date: string }> = ({ date }) => {
    const daysLeft = differenceInDays(new Date(date), new Date());
    let color = 'text-green-600 bg-green-100';
    if (daysLeft <= 0) color = 'text-red-600 bg-red-100';
    else if (daysLeft <= 7) color = 'text-yellow-600 bg-yellow-100';

    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${color}`}>
        {daysLeft <= 0 ? 'Expired' : `${daysLeft} days left`}
      </span>
    );
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
            <h1 className="text-3xl font-bold text-gray-900">Stock Inventory</h1>
            <p className="text-gray-600">Manage your food stock and track expiration dates.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search inventory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
          {loading ? (
            <div className="text-center py-8">
              <div className="h-12 w-12 mx-auto animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-500">Loading inventory...</p>
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600 mb-4">Your inventory is empty or no items match your search.</p>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires On</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    {profile?.role === 'admin' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>}
                    <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <motion.tbody 
                  className="bg-white divide-y divide-gray-200"
                  variants={tableContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredInventory.map((item) => (
                    <motion.tr 
                      key={item.id} 
                      variants={tableRowVariants} 
                      className="transition-colors"
                      whileHover={{ backgroundColor: '#f0fdfa' /* primary-50 */ }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity} {item.unit}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(item.expiration_date), 'MMM dd, yyyy')}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><ExpiryStatus date={item.expiration_date} /></td>
                      {profile?.role === 'admin' && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.profiles?.email || 'N/A'}</td>}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 p-1 rounded-md hover:bg-primary-100 transition-colors"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-100 transition-colors ml-2"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

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
