import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Clock, Heart, Plus } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import Toast from '../components/UI/Toast';
import { MarketplaceListing } from '../types/database';
import AddListingModal from '../components/Modals/AddListingModal';
import { faker } from '@faker-js/faker';
import SpotlightCard from '../components/UI/SpotlightCard';
import AnimatedButton from '../components/UI/AnimatedButton';

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
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

const Marketplace: React.FC = () => {
  const { toast, showToast, hideToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchListings = useCallback(() => {
    setLoading(true);
    const generatedListings: MarketplaceListing[] = Array.from({ length: 12 }, () => ({
        id: faker.number.int(),
        created_at: faker.date.recent().toISOString(),
        user_id: faker.string.uuid(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        original_price: parseFloat(faker.finance.amount({ min: 800, max: 2500, dec: 0 })),
        discounted_price: parseFloat(faker.finance.amount({ min: 100, max: 1000, dec: 0 })),
        quantity: `${faker.number.int({ min: 1, max: 10 })} kg`,
        category: faker.helpers.arrayElement(['produce', 'dairy', 'bakery', 'meat', 'pantry']),
        vendor: faker.company.name(),
        location: `${faker.number.float({ min: 1, max: 10, precision: 1 })} km away`,
        expires_in: `${faker.number.int({ min: 1, max: 5 })} days`,
        image_url: `https://picsum.photos/400/300?random=${faker.number.int()}`,
    }));
    setListings(generatedListings);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleAddListingSuccess = () => {
    showToast('success', 'Listing Posted', 'Your item is now live on the bazaar.');
    fetchListings();
  };

  const categories = [
    { id: 'all', name: 'All' },
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
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Food Bazaar</h1>
            <p className="text-text-secondary">Discover surplus food from local vendors at great prices.</p>
          </div>
          <button data-cursor-interactive onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Post Listing
          </button>
        </div>

        <div className="sticky top-16 z-20 bg-background/80 backdrop-blur-sm py-4 -mx-6 px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for food, vegetables, etc..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  data-cursor-interactive
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card h-96 animate-pulse bg-gray-100 p-0"></div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {filteredListings.length > 0 ? (
                filteredListings.map((listing) => (
                  <motion.div
                    key={listing.id}
                    variants={itemVariants}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  >
                    <SpotlightCard className="card overflow-hidden p-0 flex flex-col group h-full">
                      <div className="relative">
                        <div className="overflow-hidden rounded-t-xl">
                          <motion.img
                            src={listing.image_url || 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300.png?text=No+Image'}
                            alt={listing.title}
                            className="w-full h-48 object-cover"
                            whileHover={{ scale: 1.05 }}
                          />
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {getDiscountPercentage(listing.original_price, listing.discounted_price)}% OFF
                          </span>
                        </div>
                        <motion.button
                          onClick={() => toggleFavorite(listing.id)}
                          data-cursor-interactive
                          className="absolute top-3 right-3 rounded-full bg-white/80 backdrop-blur-sm p-2 shadow-md hover:bg-white"
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Heart
                            className={`h-4 w-4 transition-all ${
                              favorites.includes(listing.id) 
                                ? 'fill-red-500 text-red-500' 
                                : 'text-gray-500'
                            }`}
                          />
                        </motion.button>
                      </div>
                      
                      <div className="p-4 flex-grow flex flex-col">
                        <h3 className="font-semibold text-text-primary truncate">{listing.title}</h3>
                        <p className="text-sm text-text-secondary mb-3">{listing.vendor}</p>
                        
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-xl font-bold text-text-primary">₹{listing.discounted_price.toFixed(0)}</span>
                          <span className="text-sm text-text-secondary line-through">₹{listing.original_price.toFixed(0)}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-text-secondary mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{listing.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{listing.expires_in}</span>
                          </div>
                        </div>
                        
                        <div className="mt-auto">
                          <AnimatedButton onClick={() => handleAddToCart(listing)} />
                        </div>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                ))
              ) : (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="text-center py-16 col-span-full">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">No items found</h3>
                  <p className="text-text-secondary">Try adjusting your search or filters to find what you're looking for.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>

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
