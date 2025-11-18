import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { CloudArrowUpIcon, XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { API_URL } from '../config/api';

const CustomEmbroideryRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    embroideryType: '',
    garmentType: '',
    customGarmentType: '',
    quantity: '',
    threadColors: '',
    placement: '',
    customPlacement: '',
    size: '',
    designDescription: '',
    specialRequirements: '',
    budget: '',
    deadline: '',
    rushDelivery: false
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageDescriptions, setImageDescriptions] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [packages] = useState({
    basic: {
      price: 299,
      deliveryDays: 7,
      features: [
        'Basic embroidery design',
        'Standard thread colors',
        'Single placement',
        'Digital preview'
      ]
    },
    premium: {
      price: 599,
      deliveryDays: 5,
      features: [
        'Custom embroidery design',
        'Premium thread colors',
        'Multiple placements',
        'Digital preview',
        '2 revisions'
      ]
    },
    enterprise: {
      price: 999,
      deliveryDays: 3,
      features: [
        'Premium embroidery design',
        'Luxury thread colors',
        'Complex placements',
        'Digital preview',
        'Unlimited revisions',
        'Priority support'
      ]
    }
  });

  const [selectedPackage, setSelectedPackage] = useState('basic');

  const embroideryTypes = [
    'Logo Embroidery',
    'Text Embroidery',
    'Custom Patches',
    'Monogramming',
    'Appliqué Work',
    'Thread Work',
    'Beadwork',
    'Sequin Work',
    'Machine Embroidery',
    'Hand Embroidery'
  ];

  const garmentTypes = [
    'T-Shirts',
    'Polo Shirts',
    'Hoodies',
    'Jackets',
    'Caps/Hats',
    'Bags',
    'Towels',
    'Uniforms',
    'Aprons',
    'Other'
  ];

  const placementOptions = [
    'Left Chest',
    'Right Chest',
    'Center Chest',
    'Back',
    'Sleeve',
    'Collar',
    'Pocket',
    'Custom Placement'
  ];

  const budgetRanges = [
    'Under ₹5,000',
    '₹5,000 - ₹10,000',
    '₹10,000 - ₹25,000',
    '₹25,000 - ₹50,000',
    'Above ₹50,000'
  ];

  useEffect(() => {
    if (!user) {
      toast.error('Please login to submit a custom embroidery request');
      navigate('/login');
    } else {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        contactPerson: user.name || ''
      }));
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const processFiles = (files) => {
    if (uploadedImages.length + files.length > 5) {
      toast.error('Maximum 5 files allowed');
      return;
    }

    Array.from(files).forEach(file => {
      const fileId = Date.now() + Math.random();
      const preview = file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : null;

      setUploadedImages(prev => [
        ...prev,
        {
          id: fileId,
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview
        }
      ]);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();

      const {
        businessName,
        contactPerson,
        email,
        phone,
        embroideryType,
        garmentType,
        customGarmentType,
        quantity,
        threadColors,
        placement,
        customPlacement,
        size,
        designDescription,
        specialRequirements,
        budget,
        deadline,
        rushDelivery
      } = formData;

      const garmentTypeToSend =
        garmentType === 'Other' && customGarmentType
          ? customGarmentType
          : garmentType;

      const placementToSend =
        placement === 'Custom Placement' && customPlacement
          ? customPlacement
          : placement;

      submitData.append('businessName', businessName);
      submitData.append('contactPerson', contactPerson);
      submitData.append('embroideryType', embroideryType);
      submitData.append('garmentType', garmentTypeToSend);
      submitData.append('quantity', quantity || '1');
      submitData.append('threadColors', threadColors);
      submitData.append('placement', placementToSend);
      submitData.append('size', size);
      submitData.append('designDescription', designDescription);
      submitData.append('specialRequirements', specialRequirements);
      submitData.append('budget', budget);
      submitData.append(
        'deadline',
        deadline ? new Date(deadline).toISOString() : new Date().toISOString()
      );
      submitData.append('selectedPackage', selectedPackage);
      submitData.append('contactEmail', email);
      submitData.append('contactPhone', phone);
      submitData.append('rushDelivery', rushDelivery ? 'true' : 'false');

      uploadedImages.forEach((img, i) => {
        submitData.append('images', img.file);
        // Match backend: imageDescription0, imageDescription1, ...
        submitData.append(`imageDescription${i}`, imageDescriptions[img.id] || '');
      });

      const response = await fetch(`${API_URL}/api/custom-embroidery-requests`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: submitData
      });

      const data = await response.json();
      console.log('🔍 SERVER RESPONSE:', data);

      if (!response.ok) {
        console.log('❌ VALIDATION ERRORS:', data.errors);
        toast.error(
          data.errors?.[0]?.msg ||
          data.message ||
          'Failed to submit request'
        );
        setIsSubmitting(false);
        return;
      }

      toast.success('Embroidery request submitted successfully!');
      navigate('/profile', {
        state: { activeTab: 'embroidery-requests' }
      });
    } catch (error) {
      console.error('❌ SUBMIT ERROR:', error);
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
         <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-3">
            Custom Embroidery Request
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tell us about your embroidery requirements and we’ll bring your design to life.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-10 bg-gray-50/60 p-8 rounded-2xl border border-orange-300/40 shadow-[0_0_25px_rgba(255,69,0,0.15)] backdrop-blur-md"
        >
          {/* Business Info */}
          <section>
            <h2 className="text-xl font-semibold text-orange-600 mb-4 border-b border-orange-300 pb-2">
              Business Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['businessName', 'contactPerson', 'email', 'phone'].map((field, idx) => (
                <input
                  key={idx}
                  type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  required
                  placeholder={field.replace(/([A-Z])/g, ' $1')}
                  className="bg-white border border-orange-300/40 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-orange-600"
                />
              ))}
            </div>
          </section>

                   {/* Embroidery Details */}
          <section>
            <h2 className="text-xl font-semibold text-orange-600 mb-4 border-b border-orange-300 pb-2">
              Embroidery Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Embroidery type */}
              <select
                name="embroideryType"
                value={formData.embroideryType}
                onChange={handleInputChange}
                required
                className="bg-white border border-orange-300/40 rounded-md px-3 py-2 text-gray-900 focus:border-orange-600"
              >
                <option value="">Select Embroidery Type</option>
                {embroideryTypes.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>

              {/* Garment type */}
              <div className="space-y-2">
                <select
                  name="garmentType"
                  value={formData.garmentType}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white border border-orange-300/40 rounded-md px-3 py-2 text-gray-900 focus:border-orange-600"
                >
                  <option value="">Select Garment Type</option>
                  {garmentTypes.map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                {formData.garmentType === 'Other' && (
                  <input
                    type="text"
                    name="customGarmentType"
                    value={formData.customGarmentType}
                    onChange={handleInputChange}
                    placeholder="Enter custom garment type"
                    className="w-full bg-white border border-orange-300/40 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-orange-600"
                  />
                )}
              </div>

              {/* Placement */}
              <div className="space-y-2">
                <select
                  name="placement"
                  value={formData.placement}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white border border-orange-300/40 rounded-md px-3 py-2 text-gray-900 focus:border-orange-600"
                >
                  <option value="">Select Placement</option>
                  {placementOptions.map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                {formData.placement === 'Custom Placement' && (
                  <input
                    type="text"
                    name="customPlacement"
                    value={formData.customPlacement}
                    onChange={handleInputChange}
                    placeholder="Describe custom placement"
                    className="w-full bg-white border border-orange-300/40 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-orange-600"
                  />
                )}
              </div>

              {/* Budget */}
              <select
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                required
                className="bg-white border border-orange-300/40 rounded-md px-3 py-2 text-gray-900 focus:border-orange-600"
              >
                <option value="">Select Budget</option>
                {budgetRanges.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>

              {/* Quantity */}
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                placeholder="Quantity"
                className="bg-white border border-orange-300/40 rounded-md px-3 py-2 text-gray-900 focus:border-orange-600"
              />

              {/* Size */}
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                required
                placeholder="Size (e.g., 3x3 in)"
                className="bg-white border border-orange-300/40 rounded-md px-3 py-2 text-gray-900 focus:border-orange-600"
              />

              {/* Thread colors */}
              <input
                type="text"
                name="threadColors"
                value={formData.threadColors}
                onChange={handleInputChange}
                required
                placeholder="Thread colors (e.g., Red, White, Black)"
                className="bg-white border border-orange-300/40 rounded-md px-3 py-2 text-gray-900 focus:border-orange-600"
              />

              {/* Deadline */}
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                required
                className="bg-white border border-orange-300/40 rounded-md px-3 py-2 text-gray-900 focus:border-orange-600"
              />
            </div>

            {/* Design description */}
            <textarea
              name="designDescription"
              value={formData.designDescription}
              onChange={handleInputChange}
              placeholder="Describe your design..."
              rows={4}
              required
              className="w-full mt-6 bg-white border border-orange-300/40 rounded-md px-3 py-2 text-gray-900 focus:border-orange-600"
            />

            {/* Special requirements */}
            <textarea
              name="specialRequirements"
              value={formData.specialRequirements}
              onChange={handleInputChange}
              placeholder="Any special requirements (optional)..."
              rows={3}
              className="w-full mt-4 bg-white border border-orange-300/40 rounded-md px-3 py-2 text-gray-900 focus:border-orange-600"
            />

            {/* Rush delivery */}
            <label className="mt-4 inline-flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                name="rushDelivery"
                checked={formData.rushDelivery}
                onChange={handleInputChange}
                className="rounded border-orange-300/60 bg-white text-orange-600 focus:ring-orange-600"
              />
              <span>Rush delivery (+₹200, higher priority)</span>
            </label>
          </section>

          {/* Upload Files */}
          <section>
            <h2 className="text-xl font-semibold text-orange-600 mb-4 border-b border-orange-300 pb-2">
              Upload Reference Files
            </h2>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`p-10 border-2 border-dashed rounded-xl text-center transition-all cursor-pointer ${dragActive
                ? 'border-orange-600 bg-orange-50'
                : 'border-orange-300/40 hover:border-orange-600 hover:bg-orange-50'
                }`}
            >
              <CloudArrowUpIcon className="h-10 w-10 text-orange-600 mx-auto mb-3" />
              <p className="text-gray-600">Drag & drop files here or click to browse</p>
              <p className="text-xs text-gray-500 mt-1">
                Max 5 files | Images, PDFs, design files (AI, PSD)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => processFiles(e.target.files)}
              />
            </div>

            {uploadedImages.length > 0 && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {uploadedImages.map(img => (
                  <div
                    key={img.id}
                    className="bg-white/70 border border-orange-300/40 rounded-lg p-3 flex items-start gap-3"
                  >
                    {img.preview ? (
                      <img
                        src={img.preview}
                        alt=""
                        className="w-16 h-16 rounded-md object-cover"
                      />
                    ) : (
                      <DocumentIcon className="h-10 w-10 text-orange-600" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{img.name}</p>
                      <input
                        type="text"
                        placeholder="Add description..."
                        value={imageDescriptions[img.id] || ''}
                        onChange={(e) =>
                          setImageDescriptions(prev => ({
                            ...prev,
                            [img.id]: e.target.value
                          }))
                        }
                        className="mt-1 w-full bg-white border border-orange-300/40 rounded-md px-2 py-1 text-sm text-gray-700 focus:border-orange-600"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setUploadedImages(prev =>
                          prev.filter(i => i.id !== img.id)
                        )
                      }
                      className="text-orange-600 hover:text-red-600"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Package Selection */}
          <section>
            <h2 className="text-xl font-semibold text-orange-600 mb-4 border-b border-orange-300 pb-2">
              Select Package
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(packages).map(([type, details]) => (
                <div
                  key={type}
                  onClick={() => setSelectedPackage(type)}
                  className={`p-6 rounded-xl text-center cursor-pointer transition-all border-2 ${selectedPackage === type
                    ? 'border-orange-600 bg-orange-50 shadow-[0_0_15px_rgba(255,69,0,0.3)]'
                    : 'border-orange-300/40 hover:border-orange-600 hover:bg-orange-50'
                    }`}
                >
                  <h3 className="capitalize text-lg font-semibold text-gray-900 mb-2">
                    {type}
                  </h3>
                  <p className="text-3xl font-bold text-orange-600 mb-1">
                    ₹{details.price}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    {details.deliveryDays} days delivery
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1 text-left">
                    {details.features.map((f, idx) => (
                      <li key={idx}>• {f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Submit */}
          <div className="text-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-10 py-3 rounded-md font-semibold bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 transition-all shadow-[0_0_15px_rgba(255,69,0,0.4)] disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CustomEmbroideryRequest;