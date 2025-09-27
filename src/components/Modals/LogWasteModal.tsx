import React, { useState } from 'react';
import Modal from '../UI/Modal';
import { TrendingDown, Calendar, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

interface LogWasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const LogWasteModal: React.FC<LogWasteModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    item_name: '',
    category: '',
    quantity: '',
    unit: '',
    reason: '',
    waste_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const { error } = await supabase.from('waste_logs').insert({
      ...formData,
      user_id: user.id,
      quantity: Number(formData.quantity),
    });

    setLoading(false);
    if (!error) {
      onSuccess();
      onClose();
      setFormData({
        item_name: '',
        category: '',
        quantity: '',
        unit: '',
        reason: '',
        waste_date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    } else {
      console.error('Error logging waste:', error);
      // Show error toast
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Food Waste" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Item Name
            </label>
            <input
              type="text"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Expired Milk"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
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
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Quantity Wasted
            </label>
            <div className="relative">
              <TrendingDown className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="input pl-10"
                placeholder="0"
                required
                min="0"
                step="0.1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
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
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Reason for Waste
            </label>
            <div className="relative">
              <AlertTriangle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="input pl-10"
                required
              >
                <option value="">Select reason</option>
                <option value="expired">Expired</option>
                <option value="spoiled">Spoiled</option>
                <option value="overordered">Over-ordered</option>
                <option value="damaged">Damaged</option>
                <option value="customer_return">Customer Return</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                name="waste_date"
                value={formData.waste_date}
                onChange={handleChange}
                className="input pl-10"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="input resize-none"
            placeholder="Any additional information about the waste incident..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-surface-border">
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
            {loading ? 'Logging...' : 'Log Waste'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default LogWasteModal;
