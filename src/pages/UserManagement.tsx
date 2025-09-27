import React, { useState, useEffect, useMemo } from 'react';
import { Search, User, UserPlus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import Toast from '../components/UI/Toast';
import { Profile } from '../types/database';
import { format } from 'date-fns';
import { faker } from '@faker-js/faker';
import { motion } from 'framer-motion';

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

const UserManagement: React.FC = () => {
  const { toast, showToast, hideToast } = useToast();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    const generatedUsers: Profile[] = Array.from({ length: 25 }, () => ({
        id: faker.string.uuid(),
        updated_at: faker.date.past().toISOString(),
        username: faker.internet.username(),
        full_name: faker.person.fullName(),
        avatar_url: faker.image.avatar(),
        website: faker.internet.url(),
        role: faker.helpers.arrayElement(['admin', 'user']),
        email: faker.internet.email(),
    }));
    setUsers(generatedUsers);
    setLoading(false);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = (user.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const handleAction = (action: string, userName: string | null) => {
    showToast('info', `${action} User`, `Functionality to ${action.toLowerCase()} user ${userName} is coming soon.`);
  };

  const RoleBadge: React.FC<{ role: 'admin' | 'user' }> = ({ role }) => {
    const isAdmin = role === 'admin';
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        isAdmin ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {isAdmin ? 'Admin' : 'User'}
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">User Management</h1>
            <p className="text-text-secondary">View, edit, and manage all users in the system.</p>
          </div>
          <button onClick={() => handleAction('Add', '')} className="btn-primary flex items-center gap-2 w-full md:w-auto">
            <UserPlus className="h-4 w-4" />
            Add User
          </button>
        </div>

        <div className="card">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input w-full md:w-48"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="h-12 w-12 mx-auto animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
              <p className="mt-4 text-text-secondary">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">No users found</h3>
              <p className="text-text-secondary">No users match your current search and filter criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-surface-border">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Joined Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <motion.tbody 
                  className="bg-surface divide-y divide-surface-border"
                  variants={tableContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredUsers.map((user) => (
                    <motion.tr 
                      key={user.id} 
                      variants={tableRowVariants}
                      className="transition-colors"
                      whileHover={{ backgroundColor: '#f8fafc' /* slate-50 */ }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img className="h-10 w-10 rounded-full" src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.full_name || user.email}&background=random`} alt={user.full_name || ''} />
                          <div className="text-sm font-medium text-text-primary">{user.full_name || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{format(new Date(user.updated_at), 'MMM dd, yyyy')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleAction('Edit', user.full_name)} className="text-primary-600 hover:text-primary-900 p-1 rounded-md hover:bg-primary-100 transition-colors mr-4"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => handleAction('Delete', user.full_name)} className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-100 transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
      <Toast {...toast} onClose={hideToast} />
    </>
  );
};

export default UserManagement;
