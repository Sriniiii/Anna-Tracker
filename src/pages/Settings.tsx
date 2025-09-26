import React, { useState } from 'react';
import { User, Lock, Bell } from 'lucide-react';
import ProfileSettings from '../components/Settings/ProfileSettings';
import PasswordSettings from '../components/Settings/PasswordSettings';
import NotificationSettings from '../components/Settings/NotificationSettings';

type Tab = 'profile' | 'password' | 'notifications';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'password', name: 'Password', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'password':
        return <PasswordSettings />;
      case 'notifications':
        return <NotificationSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-600">Manage your account settings and preferences.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="lg:col-span-3">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
