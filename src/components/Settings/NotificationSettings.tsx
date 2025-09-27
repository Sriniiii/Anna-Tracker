import React from 'react';

const NotificationSettings: React.FC = () => {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-text-primary mb-1">Notification Settings</h2>
      <p className="text-text-secondary mb-6">Manage how you receive notifications.</p>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-text-primary">Email Notifications</h3>
            <p className="text-sm text-text-secondary">Receive notifications via email for important updates.</p>
          </div>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-text-primary">Push Notifications</h3>
            <p className="text-sm text-text-secondary">Get real-time alerts on your device.</p>
          </div>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-text-primary">Weekly Summary</h3>
            <p className="text-sm text-text-secondary">Receive a weekly summary of your activity.</p>
          </div>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <style>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 24px;
        }
        .switch input { 
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
        }
        input:checked + .slider {
          background-color: #3b82f6;
        }
        input:focus + .slider {
          box-shadow: 0 0 1px #3b82f6;
        }
        input:checked + .slider:before {
          transform: translateX(16px);
        }
        .slider.round {
          border-radius: 34px;
        }
        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default NotificationSettings;
