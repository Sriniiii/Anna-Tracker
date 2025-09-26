import React from 'react';

const NotificationSettings: React.FC = () => {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-neutral-900 mb-1">Notification Settings</h2>
      <p className="text-neutral-600 mb-6">Manage how you receive notifications.</p>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-neutral-800">Email Notifications</h3>
            <p className="text-sm text-neutral-500">Receive notifications via email for important updates.</p>
          </div>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-neutral-800">Push Notifications</h3>
            <p className="text-sm text-neutral-500">Get real-time alerts on your device.</p>
          </div>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-neutral-800">Weekly Summary</h3>
            <p className="text-sm text-neutral-500">Receive a weekly summary of your activity.</p>
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
          background-color: #2563eb;
        }
        input:focus + .slider {
          box-shadow: 0 0 1px #2563eb;
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
