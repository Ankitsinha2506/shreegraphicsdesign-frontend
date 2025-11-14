import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { CloudArrowUpIcon, XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { API_URL } from '../config/api';

const CustomLogoRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState(null);
  const [formData, setFormData] = useState({
    businessName: '',
    industry: 'technology',
    description: '',
    logoStyle: 'modern',
    colorPreferences: [],
    inspirationText: '',
    selectedPackage: 'basic',
    rushDelivery: false,
    contactEmail: user?.email || '',
    contactPhone: ''
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageDescriptions, setImageDescriptions] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user) {
      toast.error('Please login to submit a custom logo request');
      navigate('/login');
      return;
    }
    fetchPackagePricing();
  }, [user, navigate]);

  const fetchPackagePricing = async () => {
    try {
      const response = await fetch(`${API_URL}/api/custom-logo-requests/pricing/packages`);
      const data = await response.json();
      if (data.success) setPackages(data.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'colorPreferences') {
      const colors = formData.colorPreferences;
      setFormData(prev => ({
        ...prev,
        colorPreferences: checked ? [...colors, value] : colors.filter(c => c !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const validateFile = (file) => {
    const allowed = ['image/jpeg', 'image/png', 'image/svg+xml', 'application/pdf', 'image/webp'];
    return allowed.includes(file.type) && file.size <= 15 * 1024 * 1024;
  };

  const processFiles = (files) => {
    const validFiles = Array.from(files).filter(validateFile);
    if (uploadedImages.length + validFiles.length > 5) return toast.error('Maximum 5 files allowed');
    validFiles.forEach(file => {
      const id = Date.now() + Math.random();
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImages(prev => [...prev, { id, file, preview: e.target.result, name: file.name, size: file.size, type: file.type }]);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, Array.isArray(v) ? JSON.stringify(v) : v));
      uploadedImages.forEach((img, i) => {
        fd.append('images', img.file);
        fd.append(`desc${i}`, imageDescriptions[img.id] || '');
      });
      const res = await fetch(`${API_URL}/api/custom-logo-requests`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: fd
      });
      const data = await res.json();
      data.success ? (toast.success('Submitted successfully!'), navigate('/profile')) : toast.error(data.message);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <h2>Please log in to continue</h2>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black py-12 text-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-zinc-950 border border-red-800/40 shadow-[0_0_30px_rgba(255,0,0,0.3)] rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 px-8 py-10 text-center">
            <h1 className="text-4xl font-extrabold mb-2">Custom Logo Design Request</h1>
            <p className="text-red-100">Tell us your vision — we'll stitch your imagination into reality.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {/* Business Info */}
            <div>
              <h2 className="text-2xl font-semibold text-red-400 border-b border-red-900/40 pb-2 mb-4">Business Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  name="businessName"
                  placeholder="Business Name *"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-zinc-900 border border-red-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                />
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-zinc-900 border border-red-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                >
                  <option>Technology</option>
                  <option>Fashion</option>
                  <option>Food</option>
                  <option>Healthcare</option>
                  <option>Other</option>
                </select>
              </div>
              <textarea
                name="description"
                rows={4}
                placeholder="Describe your business..."
                value={formData.description}
                onChange={handleInputChange}
                className="w-full mt-4 px-3 py-2 bg-zinc-900 border border-red-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              />
            </div>

            {/* Design Preferences */}
            <div>
              <h2 className="text-2xl font-semibold text-red-400 border-b border-red-900/40 pb-2 mb-4">Design Preferences</h2>
              <select
                name="logoStyle"
                value={formData.logoStyle}
                onChange={handleInputChange}
                className="w-full mb-4 px-3 py-2 bg-zinc-900 border border-red-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              >
                <option>Modern</option>
                <option>Minimalist</option>
                <option>Bold</option>
                <option>Elegant</option>
                <option>Vintage</option>
              </select>
              <textarea
                name="inspirationText"
                rows={3}
                placeholder="Any inspiration or requirements..."
                value={formData.inspirationText}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-zinc-900 border border-red-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              />
            </div>

            {/* File Upload */}
            <div>
              <h2 className="text-2xl font-semibold text-red-400 border-b border-red-900/40 pb-2 mb-4">Upload Reference Files</h2>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                  dragActive ? 'border-red-500 bg-red-900/20' : 'border-red-800 hover:border-red-600'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
              >
                <CloudArrowUpIcon className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <p className="text-gray-300">Drag & Drop or Click to Upload</p>
                <input ref={fileInputRef} type="file" multiple onChange={(e) => processFiles(e.target.files)} className="hidden" />
              </div>

              {/* Preview */}
              {uploadedImages.length > 0 && (
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  {uploadedImages.map((img) => (
                    <div key={img.id} className="relative bg-zinc-900 border border-red-800/30 rounded-lg p-3">
                      {img.type.startsWith('image/') ? (
                        <img src={img.preview} alt="" className="w-full h-40 object-cover rounded-md" />
                      ) : (
                        <DocumentIcon className="h-12 w-12 text-gray-400 mx-auto" />
                      )}
                      <button
                        type="button"
                        onClick={() => setUploadedImages(prev => prev.filter(i => i.id !== img.id))}
                        className="absolute top-2 right-2 bg-black/60 p-1 rounded-full text-red-500 hover:bg-red-600 hover:text-white"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                      <p className="text-sm text-gray-400 mt-2">{img.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Package Selection */}
            {packages && (
              <div>
                <h2 className="text-2xl font-semibold text-red-400 border-b border-red-900/40 pb-2 mb-4">Package Selection</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(packages.packages).map(([name, info]) => {
                    const selected = formData.selectedPackage === name;
                    return (
                      <div
                        key={name}
                        onClick={() => setFormData(prev => ({ ...prev, selectedPackage: name }))}
                        className={`relative cursor-pointer rounded-xl border-2 transition-all duration-300 p-6 backdrop-blur-sm ${
                          selected
                            ? 'border-red-500 bg-gradient-to-br from-red-900/40 to-black shadow-[0_0_30px_rgba(255,0,0,0.5)] scale-105'
                            : 'border-red-900/40 bg-zinc-950 hover:border-red-600 hover:shadow-[0_0_15px_rgba(255,0,0,0.3)]'
                        }`}
                      >
                        <h3 className="text-xl font-bold mb-2 capitalize">{name}</h3>
                        <p className="text-3xl font-extrabold text-red-400 mb-3">₹{info.price}</p>
                        <p className="text-sm text-gray-400">Delivery: {info.deliveryDays} days</p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center mt-4 space-x-2">
                  <input
                    type="checkbox"
                    name="rushDelivery"
                    checked={formData.rushDelivery}
                    onChange={handleInputChange}
                    className="rounded border-gray-500 text-red-600 focus:ring-red-500"
                  />
                  <label className="text-sm text-gray-400">
                    Rush Delivery (+₹{packages.rushDeliveryCost}) — 50% faster delivery
                  </label>
                </div>

                <div className="bg-zinc-900 border border-red-900/40 p-4 rounded-lg mt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Price:</span>
                    <span className="text-red-400">₹{packages ? packages.packages[formData.selectedPackage]?.price : 0}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Contact */}
            <div>
              <h2 className="text-2xl font-semibold text-red-400 border-b border-red-900/40 pb-2 mb-4">Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  name="contactEmail"
                  type="email"
                  placeholder="Email *"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-zinc-900 border border-red-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                />
                <input
                  name="contactPhone"
                  type="tel"
                  placeholder="Phone (optional)"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-zinc-900 border border-red-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-red-900/40">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-700 to-red-500 py-3 rounded-lg font-semibold text-white shadow-[0_0_20px_rgba(255,0,0,0.4)] hover:shadow-[0_0_30px_rgba(255,0,0,0.6)] transition-all"
              >
                {loading ? 'Submitting...' : 'Submit Custom Logo Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomLogoRequest;
