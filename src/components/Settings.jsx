// 7. Settings.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config/api';

const Settings = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await axios.put(`${API_URL}/api/auth/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const inputBase = 'w-full px-3 py-2 bg-zinc-900 border border-red-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition';
  const btnPrimary = 'inline-flex items-center justify-center bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 hover:to-red-600 text-white font-medium py-2 px-4 rounded-lg shadow-[0_6px_25px_rgba(255,0,0,0.25)]';
  const btnSecondary = 'inline-flex items-center justify-center bg-transparent border border-red-800 text-red-300 py-2 px-4 rounded-lg hover:bg-red-900/20 transition';

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-red-300 mb-6">Account Settings</h2>

      {/* Change Password */}
      <div className="mb-8 bg-zinc-900 border border-red-900/20 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-100 mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Current Password</label>
            <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))} className={inputBase} required />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">New Password</label>
            <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))} className={inputBase} required />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Confirm New Password</label>
            <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))} className={inputBase} required />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className={btnPrimary}>
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Account Actions */}
      <div className="bg-zinc-900 border border-red-900/20 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-100 mb-4">Account Actions</h3>
        <div className="space-y-3">
          <button onClick={logout} className={`${btnSecondary} w-full text-left`}>Sign Out</button>
          <button className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-900/20 rounded-lg border border-red-900/20">Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;