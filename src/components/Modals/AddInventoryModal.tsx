import React, { useState } from 'react';
import Modal from '../UI/Modal';
import { Calendar, Package } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddInventoryModal: React.FC<AddInventoryModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    expiration_date: '',
    purchase_price: '',
    storage_location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const { error } = await supabase.from('inventory_items').insert({
      ...formData,
      user_id: user.id,
      quantity: Number(formData.quantity),
      purchase_price: formData.purchase_price ? Number(formData.purchase_price) : null,
    });

    setLoading(false);
    if (!error) {
      onSuccess();
      onClose();
      setFormData({
        name: '',
        category: '',
        quantity: '',
        unit: '',
        expiration_date: '',
        purchase_price: '',
        storage_location: '',
      });
    } else {
      console.error('Error adding inventory item:', error);
      // Here you can show a toast notification for the error
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Inventory Item" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Name
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input pl-10"
                placeholder="e.g., Fresh Apples"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select category</option>
              <option value="produce">Produce</option>
              <option value="dairy">Dairy</option>
              <option value="bakery">Bakery</option>
              <option value="meat">Meat</option>
              <option value="pantry">Pantry</option>
              <option value="frozen">Frozen</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="input"
              placeholder="0"
              required
              min="0"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unit
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select unit</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="grams">Grams (g)</option>
              <option value="pieces">Pieces</option>
              <option value="liters">Liters</option>
              <option value="boxes">Boxes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiration Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                name="expiration_date"
                value={formData.expiration_date}
                onChange={handleChange}
                className="input pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purchase Price (₹, Optional)
            </label>
            <div className="relative">
              <input
                type="number"
                name="purchase_price"
                value={formData.purchase_price}
                onChange={handleChange}
                className="input"
                placeholder="₹0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Storage Location (Optional)
          </label>
          <input
            type="text"
            name="storage_location"
            value={formData.storage_location}
            onChange={handleChange}
            className="input"
            placeholder="e.g., Refrigerator, Pantry, Freezer"
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="btn-outline"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Item'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddInventoryModal;
