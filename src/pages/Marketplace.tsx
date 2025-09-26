import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Clock, Star, Heart, ShoppingCart, Plus } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import Toast from '../components/UI/Toast';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { MarketplaceListing } from '../types/database';
import AddListingModal from '../components/Modals/AddListingModal';

const Marketplace: React.FC = () => {
  const { toast, showToast, hideToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('marketplace_listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching listings:', error);
      showToast('error', 'Fetch Failed', 'Could not load marketplace listings.');
    } else {
      setListings(data);
    }
    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleAddListingSuccess = () => {
    showToast('success', 'Listing Posted', 'Your item is now live on the marketplace.');
    fetchListings();
  };

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'produce', name: 'Produce' },
    { id: 'dairy', name: 'Dairy' },
    { id: 'bakery', name: 'Bakery' },
    { id: 'meat', name: 'Meat' },
    { id: 'pantry', name: 'Pantry' },
  ];

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const handleAddToCart = (listing: any) => {
    showToast('success', 'Added to Cart', `${listing.title} has been added to your cart.`);
  };

  const getDiscountPercentage = (original: number, discounted: number) => {
    if (original === 0) return 0;
    return Math.round(((original - discounted) / original) * 100);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Food Marketplace</h1>
            <p className="text-gray-600">Discover surplus food at discounted prices and help reduce waste.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Post Listing
          </button>
        </div>

        <div className="card">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for food items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              <button className="btn-outline flex items-center gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card h-96 animate-pulse bg-gray-100"></div>
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card overflow-hidden p-0"
              >
                <div className="relative">
                  <img
                    src={listing.image_url || 'https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300.png?text=No+Image'}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {getDiscountPercentage(listing.original_price, listing.discounted_price)}% OFF
                    </span>
                  </div>
                  <button
                    onClick={() => toggleFavorite(listing.id)}
                    className="absolute top-3 right-3 rounded-full bg-white p-2 shadow-md hover:bg-gray-50"
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors ${
                        favorites.includes(listing.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate">{listing.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 h-10 overflow-hidden">{listing.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-lg font-bold text-gray-900">${listing.discounted_price.toFixed(2)}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">${listing.original_price.toFixed(2)}</span>
                    </div>
                    <span className="text-sm text-gray-600">{listing.quantity}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{listing.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{listing.expires_in}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 truncate">{listing.vendor}</span>
                    <button
                      onClick={() => handleAddToCart(listing)}
                      className="btn-primary flex items-center gap-2 text-sm"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>

      <AddListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddListingSuccess}
      />
      <Toast {...toast} onClose={hideToast} />
    </>
  );
};

export default Marketplace;
