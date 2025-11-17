import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CloudArrowUpIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../config/api'

const CustomDesignOrder = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [formData, setFormData] = useState({
    product: '',
    productName: '',
    productCategory: '',
    productSubcategory: '',
    quantity: 1,
    designType: 'custom-design',
    productOptions: {
      color: '',
      size: '',
      material: '',
      style: ''
    },
    designPlacements: [{
      position: 'front-center',
      dimensions: { width: 10, height: 10, unit: 'cm' },
      rotation: 0
    }],
    specialInstructions: '',
    designNotes: '',
    deliveryOptions: {
      type: 'standard',
      estimatedDays: 7,
      address: { street: '', city: '', state: '', zipCode: '', country: 'India' }
    }
  })
  const [designFile, setDesignFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')

  useEffect(() => {
    if (!user) return navigate('/login')
    fetchProducts()
  }, [user, navigate])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products`)
      setProducts(response.data.products || [])
    } catch (error) {
      toast.error('Failed to fetch products')
    }
  }

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      setDesignFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleProductSelect = (e) => {
    const productId = e.target.value
    const selectedProduct = products.find(p => p._id === productId)
    if (selectedProduct) {
      setFormData(prev => ({
        ...prev,
        product: productId,
        productName: selectedProduct.name,
        productCategory: selectedProduct.category,
        productSubcategory: selectedProduct.subcategory
      }))
    }
  }

  const addPlacement = () => {
    setFormData(prev => ({
      ...prev,
      designPlacements: [...prev.designPlacements, {
        position: 'front-center',
        dimensions: { width: 10, height: 10, unit: 'cm' },
        rotation: 0
      }]
    }))
  }

  const removePlacement = (index) => {
    setFormData(prev => ({
      ...prev,
      designPlacements: prev.designPlacements.filter((_, i) => i !== index)
    }))
  }

  const updatePlacement = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      designPlacements: prev.designPlacements.map((placement, i) =>
        i === index ? { ...placement, [field]: value } : placement
      )
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!designFile) return toast.error("Please upload a design file");
    if (!formData.product) return toast.error("Please select a product");

    setLoading(true);

    try {
      const submitData = new FormData();

      submitData.append("designFile", designFile);
      submitData.append("productId", formData.product);           // ← Keep this
      submitData.append("quantity", formData.quantity);
      submitData.append("designType", formData.designType);

      // Product info
      submitData.append("productName", formData.productName || "");
      submitData.append("productCategory", formData.productCategory || "");
      submitData.append("productSubcategory", formData.productSubcategory || "");

      // Options & placements
      submitData.append("productOptions", JSON.stringify({
        color: formData.productOptions.color || "",
        size: formData.productOptions.size || "",
        material: formData.productOptions.material || "",
      }));
      submitData.append("designPlacements", JSON.stringify(formData.designPlacements));

      // Instructions
      submitData.append("specialInstructions", formData.specialInstructions || "");
      submitData.append("designNotes", formData.designNotes || "");

      // Delivery — flat as backend expects
      submitData.append("deliveryType", formData.deliveryOptions.type);
      submitData.append("deliveryAddress", JSON.stringify(formData.deliveryOptions.address));
      submitData.append("estimatedDays", formData.deliveryOptions.estimatedDays);

      // Optional but safe
      submitData.append("customer", user._id);

      const response = await axios.post(
        `${API_URL}/api/custom-design-orders`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Custom design order submitted successfully!");
        // navigate("/profile");
        navigate("/profile", {
          state: { activeTab: "custom-design-orders" }
        });
      }

    } catch (error) {
      console.log("Error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to submit order");
    } finally {
      setLoading(false);
    }
  };


  const placementOptions = [
    { value: 'front-center', label: 'Front Center' },
    { value: 'back-center', label: 'Back Center' },
    { value: 'sleeve-left', label: 'Left Sleeve' },
    { value: 'sleeve-right', label: 'Right Sleeve' },
    { value: 'collar', label: 'Collar' },
    { value: 'custom', label: 'Custom Position' }
  ]

  return (
    <div className="min-h-screen bg-black text-white py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(255,0,0,0.3)] border border-red-900/40">

          {/* Header */}
          <div className="bg-gradient-to-r from-red-700 via-red-800 to-black px-6 py-8">
            <h1 className="text-3xl font-bold text-white">Custom Design Order</h1>
            <p className="text-gray-300 mt-2">Upload your design and personalize your product</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8 bg-zinc-900/60 backdrop-blur-md">

            {/* Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Upload Design File *</label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${isDragActive
                  ? 'border-red-500 bg-red-900/20'
                  : 'border-red-900/40 hover:border-red-600 hover:bg-red-900/10'
                  }`}
              >
                <input {...getInputProps()} />
                {previewUrl ? (
                  <div className="space-y-4">
                    <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                    <p className="text-sm text-gray-400">{designFile?.name}</p>
                    <button
                      type="button"
                      onClick={() => { setDesignFile(null); setPreviewUrl('') }}
                      className="text-red-400 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <CloudArrowUpIcon className="h-12 w-12 text-red-500 mx-auto" />
                    <p className="text-gray-400">Drop your design file here or click to browse</p>
                    <p className="text-xs text-gray-500">PNG, JPG, SVG, PDF up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Product *</label>
              <select
                name="product"
                value={formData.product}
                onChange={handleProductSelect}
                className="w-full bg-black border border-red-900/40 text-gray-200 rounded-md px-3 py-2 focus:border-red-500"
              >
                <option value="">Choose a product...</option>
                {products.map(product => (
                  <option key={product._id} value={product._id}>{product.name} - {product.category}</option>
                ))}
              </select>
            </div>

            {/* Product Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['color', 'size', 'material'].map(opt => (
                <div key={opt}>
                  <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">{opt}</label>
                  <input
                    type="text"
                    name={`productOptions.${opt}`}
                    value={formData.productOptions[opt]}
                    onChange={handleInputChange}
                    placeholder={`Enter ${opt}`}
                    className="w-full bg-black border border-red-900/40 text-gray-200 rounded-md px-3 py-2 focus:border-red-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full bg-black border border-red-900/40 text-gray-200 rounded-md px-3 py-2 focus:border-red-500"
                />
              </div>
            </div>

            {/* Design Placements */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-300">Design Placements</label>
                <button
                  type="button"
                  onClick={addPlacement}
                  className="flex items-center text-red-400 hover:text-red-600"
                >
                  <PlusIcon className="h-4 w-4 mr-1" /> Add
                </button>
              </div>
              {formData.designPlacements.map((placement, i) => (
                <div key={i} className="bg-black/40 border border-red-900/40 rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-200">Placement {i + 1}</h4>
                    {formData.designPlacements.length > 1 && (
                      <button onClick={() => removePlacement(i)} className="text-red-500 hover:text-red-700">
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                      value={placement.position}
                      onChange={(e) => updatePlacement(i, 'position', e.target.value)}
                      className="bg-black border border-red-900/40 text-gray-200 rounded-md px-3 py-2 focus:border-red-500"
                    >
                      {placementOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <input
                      type="number"
                      value={placement.dimensions.width}
                      onChange={(e) => updatePlacement(i, 'dimensions', { ...placement.dimensions, width: e.target.value })}
                      className="bg-black border border-red-900/40 text-gray-200 rounded-md px-3 py-2 focus:border-red-500"
                      placeholder="Width (cm)"
                    />
                    <input
                      type="number"
                      value={placement.dimensions.height}
                      onChange={(e) => updatePlacement(i, 'dimensions', { ...placement.dimensions, height: e.target.value })}
                      className="bg-black border border-red-900/40 text-gray-200 rounded-md px-3 py-2 focus:border-red-500"
                      placeholder="Height (cm)"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Special Instructions</label>
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-black border border-red-900/40 text-gray-200 rounded-md px-3 py-2 focus:border-red-500"
                placeholder="Any custom requests or notes..."
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-red-900/20 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-red-600 to-black text-white font-medium rounded-md hover:from-red-700 hover:to-red-900 shadow-[0_0_10px_rgba(255,0,0,0.4)] transition disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CustomDesignOrder
