import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  BarChart3, 
  ShoppingCart, 
  Settings,
  Leaf,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, admin: false },
  { name: 'Food Inventory', href: '/inventory', icon: Package, admin: false },
  { name: 'Waste Tracking', href: '/waste-tracking', icon: TrendingUp, admin: false },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, admin: false },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingCart, admin: false },
  { name: 'User Management', href: '/user-management', icon: Users, admin: true },
];

const Sidebar: React.FC = () => {
  const { profile } = useAuth();

  return (
    <div className="flex w-64 flex-col bg-white border-r border-neutral-200/80">
      <div className="flex items-center gap-3 p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
          <Leaf className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-neutral-900">BiteWise</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-4 pb-4">
        <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Menu</p>
        <ul className="space-y-1">
          {navigation.map((item) => {
            if (item.admin && profile?.role !== 'admin') {
              return null;
            }
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto p-4">
        <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Account</p>
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`
              }
            >
              <Settings className="h-5 w-5" />
              Settings
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
