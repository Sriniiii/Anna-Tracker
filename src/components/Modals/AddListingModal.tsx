import React, { useState } from 'react';
import Modal from '../UI/Modal';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddListingModal: React.FC<AddListingModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    quantity: '',
    original_price: '',
    discounted_price: '',
    vendor: '',
    location: '',
    expires_in: '',
    image_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const { error } = await supabase.from('marketplace_listings').insert({
      ...formData,
      user_id: user.id,
      original_price: Number(formData.original_price),
      discounted_price: Number(formData.discounted_price),
    });

    setLoading(false);
    if (!error) {
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        title: '', description: '', category: '', quantity: '', original_price: '',
        discounted_price: '', vendor: '', location: '', expires_in: '', image_url: '',
      });
    } else {
      console.error('Error adding listing:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Post a New Marketplace Listing" size="xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" value={formData.title} onChange={handleChange} className="input" placeholder="Listing Title" required />
          <select name="category" value={formData.category} onChange={handleChange} className="input" required>
            <option value="">Select Category</option>
            <option value="produce">Produce</option>
            <option value="dairy">Dairy</option>
            <option value="bakery">Bakery</option>
            <option value="meat">Meat</option>
            <option value="pantry">Pantry</option>
          </select>
          <input name="quantity" value={formData.quantity} onChange={handleChange} className="input" placeholder="Quantity (e.g., 5 lbs, 1 box)" required />
          <input name="original_price" type="number" value={formData.original_price} onChange={handleChange} className="input" placeholder="Original Price" required />
          <input name="discounted_price" type="number" value={formData.discounted_price} onChange={handleChange} className="input" placeholder="Discounted Price" required />
          <input name="vendor" value={formData.vendor} onChange={handleChange} className="input" placeholder="Vendor/Store Name" required />
          <input name="location" value={formData.location} onChange={handleChange} className="input" placeholder="Location (e.g., 2.5 miles away)" required />
          <input name="expires_in" value={formData.expires_in} onChange={handleChange} className="input" placeholder="Expires In (e.g., 2 days)" required />
        </div>
        <textarea name="description" value={formData.description} onChange={handleChange} className="input" placeholder="Detailed description of the item" rows={3} required />
        <input name="image_url" value={formData.image_url} onChange={handleChange} className="input" placeholder="Image URL (optional)" />
        
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button type="button" onClick={onClose} className="btn-outline" disabled={loading}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Posting...' : 'Post Listing'}</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddListingModal;
