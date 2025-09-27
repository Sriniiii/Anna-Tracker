import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../hooks/useToast';
import Toast from '../UI/Toast';

const ProfileSettings: React.FC = () => {
  const { profile, user } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setUsername(profile.username || '');
      setWebsite(profile.website || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const updates = {
      id: user.id,
      full_name: fullName,
      username,
      website,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      showToast('error', 'Update Failed', error.message);
    } else {
      showToast('success', 'Profile Updated', 'Your profile has been updated successfully.');
    }
    setLoading(false);
  };

  return (
    <>
      <div className="card">
        <h2 className="text-xl font-semibold text-text-primary mb-1">Profile Information</h2>
        <p className="text-text-secondary mb-6">Update your personal details here.</p>
        
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="flex items-center gap-4">
            <img 
              src={avatarUrl || `https://ui-avatars.com/api/?name=${fullName || user?.email}&background=random`} 
              alt="Avatar"
              className="h-16 w-16 rounded-full"
            />
            <input
              type="text"
              id="avatar_url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="input"
              placeholder="Avatar URL"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={user?.email || ''}
              disabled
              className="input bg-slate-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-1">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-text-secondary mb-1">Website</label>
            <input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="input"
              placeholder="https://your-website.com"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-surface-border">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
      <Toast {...toast} onClose={hideToast} />
    </>
  );
};

export default ProfileSettings;
