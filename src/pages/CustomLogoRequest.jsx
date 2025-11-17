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
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/custom-logo-requests/pricing/packages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) setPackages(data.data);
      else toast.error('Failed to load packages');
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to load pricing');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'colorPreferences') {
      setFormData(prev => ({
        ...prev,
        colorPreferences: checked
          ? [...prev.colorPreferences, value]
          : prev.colorPreferences.filter(c => c !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const validateFile = (file) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp', 'application/pdf'];
    const maxSize = 15 * 1024 * 1024; // 15MB
    if (!allowed.includes(file.type)) {
      toast.error(`File type not allowed: ${file.name}`);
      return false;
    }
    if (file.size > maxSize) {
      toast.error(`File too large: ${file.name} (>15MB)`);
      return false;
    }
    return true;
  };

  const processFiles = (files) => {
    const newFiles = Array.from(files).filter(validateFile);
    if (uploadedImages.length + newFiles.length > 5) {
      toast.error('Maximum 5 files allowed');
      return;
    }
    newFiles.forEach(file => {
      const id = Date.now() + Math.random();
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImages(prev => [...prev, {
          id,
          file,
          preview: e.target.result,
          name: file.name,
          size: file.size,
          type: file.type
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
    setImageDescriptions(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.businessName.trim()) return toast.error('Business name is required');
    if (!formData.contactEmail.trim()) return toast.error('Email is required');

    setLoading(true);

    try {
      const fd = new FormData();

      // Append all text fields
      fd.append('businessName', formData.businessName);
      fd.append('industry', formData.industry);
      fd.append('description', formData.description);
      fd.append('logoStyle', formData.logoStyle);
      fd.append('colorPreferences', JSON.stringify(formData.colorPreferences));
      fd.append('inspirationText', formData.inspirationText);
      fd.append('selectedPackage', formData.selectedPackage);
      fd.append('rushDelivery', formData.rushDelivery);
      fd.append('contactEmail', formData.contactEmail);
      fd.append('contactPhone', formData.contactPhone || '');

      // Append files + descriptions
      uploadedImages.forEach((img, index) => {
        fd.append('images', img.file); // This must match multer array('images')
        fd.append(`imageDescriptions[${index}]`, imageDescriptions[img.id] || '');
      });

      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/custom-logo-requests`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // DO NOT set Content-Type! Let browser set it with boundary
        },
        body: fd
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Logo request submitted successfully!');
        navigate('/profile', { state: { activeTab: 'logo-requests' } });
      } else {
        toast.error(data.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Submission error:', err);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black py-12 text-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-zinc-950 border border-red-800/40 shadow-[0_0_30px_rgba(255,0,0,0.3)] rounded-2xl overflow-hidden">

          <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 px-8 py-10 text-center">
            <h1 className="text-4xl font-extrabold mb-2">Custom Logo Design Request</h1>
            <p className="text-red-100">Tell us your vision — we'll bring it to life.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">

            {/* Business Info */}
            <div>
              <h2 className="text-2xl font-semibold text-red-400 border-b border-red-900/40 pb-2 mb-6">Business Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <input required name="businessName" placeholder="Business Name *" value={formData.businessName} onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-zinc-900 border border-red-800 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" />
                <select name="industry" value={formData.industry} onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-zinc-900 border border-red-800 rounded-lg focus:ring-2 focus:ring-red-500">
                  {['Technology', 'Fashion', 'Food', 'Healthcare', 'Real Estate', 'Education', 'Other'].map(i => (
                    <option key={i} value={i.toLowerCase()}>{i}</option>
                  ))}
                </select>
              </div>
              <textarea required rows={4} name="description" placeholder="Describe your business, target audience, values..." value={formData.description} onChange={handleInputChange}
                className="w-full mt-6 px-4 py-3 bg-zinc-900 border border-red-800 rounded-lg focus:ring-2 focus:ring-red-500" />
            </div>

            {/* Design Preferences */}
            <div>
              <h2 className="text-2xl font-semibold text-red-400 border-b border-red-900/40 pb-2 mb-6">Design Preferences</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <select name="logoStyle" value={formData.logoStyle} onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-zinc-900 border border-red-800 rounded-lg focus:ring-2 focus:ring-red-500">
                  {['Modern', 'Minimalist', 'Bold', 'Elegant', 'Vintage', 'Playful', 'Professional'].map(s => (
                    <option key={s} value={s.toLowerCase()}>{s}</option>
                  ))}
                </select>
                <div className="space-y-3">
                  <p className="text-sm text-gray-400">Preferred Colors (optional)</p>
                  {['Red', 'Blue', 'Black', 'Gold', 'Green', 'Purple', 'No Preference'].map(color => (
                    <label key={color} className="flex items-center gap-3">
                      <input type="checkbox" name="colorPreferences" value={color.toLowerCase()}
                        checked={formData.colorPreferences.includes(color.toLowerCase())}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
                      <span>{color}</span>
                    </label>
                  ))}
                </div>
              </div>
              <textarea rows={3} name="inspirationText" placeholder="Any specific ideas, fonts, symbols, or examples you like..."
                value={formData.inspirationText} onChange={handleInputChange}
                className="w-full mt-6 px-4 py-3 bg-zinc-900 border border-red-800 rounded-lg focus:ring-2 focus:ring-red-500" />
            </div>

            {/* File Upload */}
            <div>
              <h2 className="text-2xl font-semibold text-red-400 border-b border-red-900/40 pb-2 mb-6">Reference Images / Sketches (Optional)</h2>
              <div
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => { e.preventDefault(); processFiles(e.dataTransfer.files); }}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-red-800 hover:border-red-600 rounded-xl p-12 text-center cursor-pointer transition bg-zinc-900/50"
              >
                <CloudArrowUpIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <p className="text-xl text-gray-300">Drop files here or click to upload</p>
                <p className="text-sm text-gray-500 mt-2">PNG, JPG, SVG, PDF • Max 15MB • Up to 5 files</p>
                <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf" onChange={(e) => processFiles(e.target.files)} className="hidden" />
              </div>

              {uploadedImages.length > 0 && (
                <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {uploadedImages.map(img => (
                    <div key={img.id} className="relative group bg-zinc-900 border border-red-800/40 rounded-lg overflow-hidden">
                      {img.type.startsWith('image/') ? (
                        <img src={img.preview} alt="preview" className="w-full h-48 object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-48 bg-zinc-800">
                          <DocumentIcon className="h-20 w-20 text-gray-500" />
                        </div>
                      )}
                      <button type="button" onClick={() => removeImage(img.id)}
                        className="absolute top-2 right-2 bg-black/70 p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
                        <XMarkIcon className="h-5 w-5 text-red-400" />
                      </button>
                      <p className="text-xs p-3 text-gray-400 truncate">{img.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Package Selection */}
            {packages && (
              <div>
                <h2 className="text-2xl font-semibold text-red-400 border-b border-red-900/40 pb-2 mb-6">Choose Your Package</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {Object.entries(packages.packages).map(([key, pkg]) => (
                    <div key={key}
                      onClick={() => setFormData(prev => ({ ...prev, selectedPackage: key }))}
                      className={`cursor-pointer rounded-2xl border-4 p-8 text-center transition-all ${formData.selectedPackage === key
                        ? 'border-red-500 bg-red-900/20 shadow-2xl scale-105'
                        : 'border-red-900/40 hover:border-red-600'
                        }`}>
                      <h3 className="text-2xl font-bold capitalize">{key}</h3>
                      <p className="text-4xl font-extrabold text-red-400 my-4">₹{pkg.price}</p>
                      <ul className="text-left text-sm space-y-2 text-gray-300">
                        <li>✓ {pkg.revisions} Revisions</li>
                        <li>✓ {pkg.concepts} Concepts</li>
                        <li>✓ Delivery in {pkg.deliveryDays} days</li>
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-zinc-900 border border-red-900/50 rounded-xl p-6">
                  <label className="flex items-center gap-4 text-lg">
                    <input type="checkbox" name="rushDelivery" checked={formData.rushDelivery} onChange={handleInputChange}
                      className="w-6 h-6 text-red-600 rounded focus:ring-red-500" />
                    <span>Rush Delivery (+₹{packages.rushDeliveryCost}) — Get it 50% faster</span>
                  </label>
                  <div className="mt-6 pt-6 border-t border-red-800/40 flex justify-between text-2xl font-bold">
                    <span>Total Amount:</span>
                    <span className="text-red-400">
                      ₹{formData.rushDelivery
                        ? packages.packages[formData.selectedPackage].price + packages.rushDeliveryCost
                        : packages.packages[formData.selectedPackage].price
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Contact */}
            <div>
              <h2 className="text-2xl font-semibold text-red-400 border-b border-red-900/40 pb-2 mb-6">Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <input required type="email" name="contactEmail" placeholder="Your Email *" value={formData.contactEmail} onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-zinc-900 border border-red-800 rounded-lg focus:ring-2 focus:ring-red-500" />
                <input type="tel" name="contactPhone" placeholder="Phone Number (optional)" value={formData.contactPhone} onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-zinc-900 border border-red-800 rounded-lg focus:ring-2 focus:ring-red-500" />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-10">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-red-600 to-red-800 text-xl font-bold rounded-xl shadow-2xl hover:shadow-red-500/50 disabled:opacity-70 transition-all"
              >
                {loading ? 'Submitting Request...' : 'Submit Logo Design Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomLogoRequest;