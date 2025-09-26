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
  { name: 'Settings', href: '/settings', icon: Settings, admin: false },
];

const Sidebar: React.FC = () => {
  const { profile } = useAuth();

  return (
    <div className="flex w-64 flex-col bg-white shadow-medium">
      <div className="flex items-center gap-3 p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500">
          <Leaf className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">BiteWise</h1>
          <p className="text-sm text-gray-500">Food Waste Manager</p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 pb-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            if (item.admin && profile?.role !== 'admin') {
              return null;
            }
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
    </div>
  );
};

export default Sidebar;
