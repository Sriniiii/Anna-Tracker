import React, { useState, useEffect } from 'react';
import { Bell, Search, ChevronDown, Settings, LogOut, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Notification } from '../../types/database';
import { formatDistanceToNow } from 'date-fns';
import { NavLink } from 'react-router-dom';
import { faker } from '@faker-js/faker';

const Header: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  useEffect(() => {
    setLoadingNotifications(true);
    const generatedNotifications: Notification[] = Array.from({ length: 5 }, () => ({
        id: faker.number.int(),
        created_at: faker.date.recent().toISOString(),
        user_id: user?.id || faker.string.uuid(),
        title: faker.lorem.sentence(3),
        message: faker.lorem.sentence(8),
        is_read: faker.datatype.boolean(),
    }));
    setNotifications(generatedNotifications);
    setLoadingNotifications(false);
  }, [user]);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200/60 glassmorphic px-6 h-16">
      <div className="flex items-center gap-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 rounded-lg border-neutral-300 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </form>
      </div>
      
      <div className="flex items-center gap-5">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-full h-10 w-10 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-full mt-2 w-80 rounded-lg bg-white shadow-strong border border-neutral-200 z-50"
              >
                <div className="p-4 border-b border-neutral-200">
                  <h3 className="font-semibold text-neutral-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {loadingNotifications ? (
                    <div className="p-4 text-center text-sm text-neutral-500">Loading...</div>
                  ) : notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50 ${
                          !notification.is_read ? 'bg-primary-50/50' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-neutral-900">{notification.title}</h4>
                            <p className="text-sm text-neutral-600 mt-1">{notification.message}</p>
                          </div>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-primary-500 rounded-full ml-2 mt-1.5 flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 mt-2">{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-neutral-500">No new notifications</div>
                  )}
                </div>
                <div className="p-3 border-t border-neutral-200">
                  <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-full p-1 text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <img 
              className="h-8 w-8 rounded-full" 
              src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name || user?.email}&background=random&color=fff`} 
              alt="User avatar" 
            />
            <span className="text-sm font-medium hidden sm:block">{profile?.full_name?.split(' ')[0] ?? user?.email?.split('@')[0]}</span>
            <ChevronDown className="h-4 w-4 text-neutral-500" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-full mt-2 w-56 rounded-lg bg-white shadow-strong border border-neutral-200 z-50"
              >
                <div className="p-3 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-neutral-900 truncate">{profile?.full_name || user?.email?.split('@')[0]}</p>
                    {profile?.role === 'admin' && (
                      <span className="text-xs font-semibold text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full">Admin</span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500 truncate">{user?.email}</p>
                </div>
                <div className="py-2">
                  <NavLink to="/settings" className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900">
                    <Settings className="h-4 w-4" />
                    Settings
                  </NavLink>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900">
                    <HelpCircle className="h-4 w-4" />
                    Help & Support
                  </button>
                  <hr className="my-2 border-neutral-100" />
                  <button 
                    onClick={signOut}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
