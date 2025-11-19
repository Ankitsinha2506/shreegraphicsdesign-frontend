// components/ProfileInfo.jsx - TRUE MATERIAL FLOATING LABELS (Border-Cut Effect)
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { UserIcon, PhoneIcon, MapPinIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const ProfileInfo = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || ''
    }
  });

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Personal Information</h2>
        <p className="text-gray-600 mt-2">Update your details for faster checkout</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 space-y-10">

        {/* Full Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Full Name */}
          <div className="relative">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="peer block w-full px-4 pt-6 pb-3 text-base font-medium text-gray-900 bg-transparent border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition"
              placeholder=" "
              required
            />
            <label className="absolute top-0 left-4 -translate-y-3 px-2 bg-white text-sm font-medium text-orange-600 transition-all duration-200 
              peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:translate-y-0 
              peer-focus:top-0 peer-focus:-translate-y-3 peer-focus:text-orange-600 peer-focus:text-sm">
              <UserIcon className="inline w-4 h-4 mr-1" /> Full Name
            </label>
          </div>

          {/* Email (Disabled) */}
          <div className="relative">
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="block w-full px-4 pt-6 pb-3 text-base font-medium text-gray-600 bg-gray-50 border border-gray-300 rounded-xl cursor-not-allowed"
            />
            <label className="absolute top-0 left-4 -translate-y-3 px-2 bg-gray-50 text-sm font-medium text-gray-500">
              <EnvelopeIcon className="inline w-4 h-4 mr-1" /> Email Address
            </label>
          </div>
        </div>

        {/* Phone */}
        <div className="relative">
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="peer block w-full px-4 pt-6 pb-3 text-base font-medium text-gray-900 bg-transparent border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition"
            placeholder=" "
          />
          <label className="absolute top-0 left-4 -translate-y-3 px-2 bg-white text-sm font-medium text-orange-600 transition-all duration-200 
            peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:translate-y-0 
            peer-focus:top-0 peer-focus:-translate-y-3 peer-focus:text-orange-600 peer-focus:text-sm">
            <PhoneIcon className="inline w-4 h-4 mr-1" /> Phone Number
          </label>
        </div>

        {/* Address */}
        <div className="relative">
          <textarea
            rows={3}
            value={formData.address.street}
            onChange={(e) => handleChange('address.street', e.target.value)}
            className="peer block w-full px-4 pt-6 pb-3 text-base font-medium text-gray-900 bg-transparent border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition resize-none"
            placeholder=" "
          />
          <label className="absolute top-0 left-4 -translate-y-3 px-2 bg-white text-sm font-medium text-orange-600 transition-all duration-200 
            peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:translate-y-0 
            peer-focus:top-0 peer-focus:-translate-y-3 peer-focus:text-orange-600 peer-focus:text-sm">
            <MapPinIcon className="inline w-4 h-4 mr-1" /> Complete Address
          </label>
        </div>

        {/* City, State, Pincode */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['city', 'state', 'pincode'].map((field) => (
            <div key={field} className="relative">
              <input
                type="text"
                value={formData.address[field]}
                onChange={(e) => handleChange(`address.${field}`, e.target.value)}
                maxLength={field === 'pincode' ? 6 : undefined}
                className="peer block w-full px-4 pt-6 pb-3 text-base font-medium text-gray-900 bg-transparent border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition"
                placeholder=" "
              />
              <label className="absolute top-0 left-4 -translate-y-3 px-2 bg-white text-sm font-medium text-orange-600 transition-all duration-200 
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:translate-y-0 
                peer-focus:top-0 peer-focus:-translate-y-3 peer-focus:text-orange-600 peer-focus:text-sm">
                {field === 'pincode' ? 'Pincode' : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-70 text-white font-bold text-lg rounded-xl shadow-lg transition"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-10 py-4 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold text-lg rounded-xl transition"
          >
            Cancel
          </button>
        </div>
      </form>

      <p className="text-center text-sm text-gray-500 mt-8">
        Your data is secure and encrypted
      </p>
    </div>
  );
};

export default ProfileInfo;