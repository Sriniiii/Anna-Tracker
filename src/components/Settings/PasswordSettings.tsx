import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../hooks/useToast';
import Toast from '../UI/Toast';

const PasswordSettings: React.FC = () => {
  const { toast, showToast, hideToast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast('error', 'Password Mismatch', 'The passwords do not match.');
      return;
    }
    if (password.length < 6) {
      showToast('error', 'Weak Password', 'Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      showToast('error', 'Update Failed', error.message);
    } else {
      showToast('success', 'Password Updated', 'Your password has been changed successfully.');
      setPassword('');
      setConfirmPassword('');
    }
    setLoading(false);
  };

  return (
    <>
      <div className="card">
        <h2 className="text-xl font-semibold text-text-primary mb-1">Change Password</h2>
        <p className="text-text-secondary mb-6">Update your password. Make sure it's a strong one!</p>
        
        <form onSubmit={handlePasswordUpdate} className="space-y-6">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-text-secondary mb-1">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Enter new password"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-1">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              placeholder="Confirm new password"
              required
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-surface-border">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
      <Toast {...toast} onClose={hideToast} />
    </>
  );
};

export default PasswordSettings;
