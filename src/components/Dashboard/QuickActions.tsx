import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, BarChart3, ShoppingCart, Upload, Users } from 'lucide-react';
import AddInventoryModal from '../Modals/AddInventoryModal';
import LogWasteModal from '../Modals/LogWasteModal';
import { useToast } from '../../hooks/useToast';
import Toast from '../UI/Toast';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [showAddInventory, setShowAddInventory] = useState(false);
  const [showLogWaste, setShowLogWaste] = useState(false);

  const handleAction = (actionType: string) => {
    switch (actionType) {
      case 'add_inventory':
        setShowAddInventory(true);
        break;
      case 'log_waste':
        setShowLogWaste(true);
        break;
      case 'view_analytics':
        navigate('/analytics');
        break;
      case 'browse_marketplace':
        navigate('/marketplace');
        break;
      case 'upload_receipt':
        showToast('info', 'Receipt Upload', 'Receipt upload feature coming soon!');
        break;
      case 'invite_users':
        showToast('info', 'Invite Users', 'User invitation feature coming soon!');
        break;
      default:
        console.log('Unknown action:', actionType);
    }
  };

  const handleAddInventory = (data: any) => {
    console.log('Adding inventory:', data);
    showToast('success', 'Inventory Added', `${data.name} has been added to your inventory.`);
  };

  const handleLogWaste = (data: any) => {
    console.log('Logging waste:', data);
    showToast('success', 'Waste Logged', `Waste entry for ${data.itemName} has been recorded.`);
  };

  const actions = [
    {
      title: 'Add Inventory',
      description: 'Add new food items to track',
      icon: Plus,
      color: 'bg-primary-500 hover:bg-primary-600',
      action: 'add_inventory',
    },
    {
      title: 'Log Waste',
      description: 'Record food waste data',
      icon: TrendingUp,
      color: 'bg-secondary-500 hover:bg-secondary-600',
      action: 'log_waste',
    },
    {
      title: 'View Analytics',
      description: 'Check detailed reports',
      icon: BarChart3,
      color: 'bg-accent-500 hover:bg-accent-600',
      action: 'view_analytics',
    },
    {
      title: 'Browse Marketplace',
      description: 'Find surplus food deals',
      icon: ShoppingCart,
      color: 'bg-success-500 hover:bg-success-600',
      action: 'browse_marketplace',
    },
    {
      title: 'Upload Receipt',
      description: 'Track purchases automatically',
      icon: Upload,
      color: 'bg-warning-500 hover:bg-warning-600',
      action: 'upload_receipt',
    },
    {
      title: 'Invite Users',
      description: 'Expand your network',
      icon: Users,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: 'invite_users',
    },
  ];

  return (
    <>
      <div className="card">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <button
              key={action.title}
              data-cursor-interactive
              onClick={() => handleAction(action.action)}
              className={`group flex flex-col items-center gap-2 rounded-lg p-4 text-white transition-all hover:scale-105 ${action.color}`}
            >
              <action.icon className="h-6 w-6" />
              <div className="text-center">
                <p className="text-sm font-medium">{action.title}</p>
                <p className="text-xs opacity-90">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <AddInventoryModal
        isOpen={showAddInventory}
        onClose={() => setShowAddInventory(false)}
        onSuccess={handleAddInventory}
      />

      <LogWasteModal
        isOpen={showLogWaste}
        onClose={() => setShowLogWaste(false)}
        onSuccess={handleLogWaste}
      />

      <Toast {...toast} onClose={hideToast} />
    </>
  );
};

export default QuickActions;
