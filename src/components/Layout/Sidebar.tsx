import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  BarChart3, 
  ShoppingCart, 
  Settings,
  Users,
  Leaf
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, admin: false },
  { name: 'Stock Inventory', href: '/inventory', icon: Package, admin: false },
  { name: 'Waste Tracking', href: '/waste-tracking', icon: TrendingUp, admin: false },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, admin: false },
  { name: 'Food Bazaar', href: '/marketplace', icon: ShoppingCart, admin: false },
  { name: 'User Management', href: '/user-management', icon: Users, admin: true },
];

const Sidebar: React.FC = () => {
  const { profile } = useAuth();

  return (
    <div className="flex w-64 flex-col bg-surface border-r border-surface-border">
      <div className="flex items-center gap-3 p-6 h-16">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white">
          <Leaf className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-text-primary">BiteWise</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-4">
        <p className="px-3 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Menu</p>
        <ul className="space-y-1.5">
          {navigation.map((item) => {
            if (item.admin && profile?.role !== 'admin') {
              return null;
            }
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-text-secondary hover:bg-slate-100 hover:text-text-primary data-[active=true]:text-primary-600 data-[active=true]:font-semibold"
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="active-sidebar-link"
                          className="absolute inset-0 rounded-lg bg-primary-100"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <item.icon className="h-5 w-5 relative" />
                      <span className="relative">{item.name}</span>
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto p-4">
        <ul className="space-y-1.5">
          <li>
            <NavLink
              to="/settings"
              className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-text-secondary hover:bg-slate-100 hover:text-text-primary data-[active=true]:text-primary-600 data-[active=true]:font-semibold"
            >
              {({ isActive }) => (
                <>
                   {isActive && (
                    <motion.div
                      layoutId="active-sidebar-link"
                      className="absolute inset-0 rounded-lg bg-primary-100"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Settings className="h-5 w-5 relative" />
                  <span className="relative">Settings</span>
                </>
              )}
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
