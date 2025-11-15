// 1. ProfileInfo.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfileInfo = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || ''
    }
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(profileData);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const inputBase = 'w-full px-3 py-2 bg-zinc-900 border border-red-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition';
  const btnPrimary = 'inline-flex items-center justify-center bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 hover:to-red-600 text-white font-medium py-2 px-4 rounded-lg shadow-[0_6px_25px_rgba(255,0,0,0.25)]';
  const btnSecondary = 'inline-flex items-center justify-center bg-transparent border border-red-800 text-red-300 py-2 px-4 rounded-lg hover:bg-red-900/20 transition';

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-red-300 mb-6">Profile Information</h2>
      <form onSubmit={handleProfileUpdate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-300 block mb-1">Full Name</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
              className={inputBase}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-1">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              className={`${inputBase} bg-zinc-900/60 cursor-not-allowed`}
              disabled
              title="Email cannot be changed"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-300 block mb-1">Phone Number</label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
            className={inputBase}
          />
        </div>

        <div>
          <label className="text-sm text-gray-300 block mb-1">Street Address</label>
          <textarea
            value={profileData.address.street}
            onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, street: e.target.value } }))}
            className={`${inputBase} min-h-[80px]`}
            rows={3}
            placeholder="Enter your street address"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-300 block mb-1">City</label>
            <input
              type="text"
              value={profileData.address.city}
              onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, city: e.target.value } }))}
              className={inputBase}
              placeholder="City"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 block mb-1">State</label>
            <input
              type="text"
              value={profileData.address.state}
              onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, state: e.target.value } }))}
              className={inputBase}
              placeholder="State"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 block mb-1">Pincode</label>
            <input
              type="text"
              value={profileData.address.pincode}
              onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, pincode: e.target.value } }))}
              className={inputBase}
              placeholder="Pincode"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className={btnPrimary}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
          <button type="button" onClick={() => setProfileData({
            name: user?.name || '',
            phone: user?.phone || '',
            address: {
              street: user?.address?.street || '',
              city: user?.address?.city || '',
              state: user?.address?.state || '',
              pincode: user?.address?.pincode || ''
            }
          })} className={btnSecondary}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfo;