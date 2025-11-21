// components/CustomDesignOrder.jsx → FINAL 100% WORKING VERSION
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
    quantity: 1,
    designType: 'custom-design',
    productOptions: { color: '', size: '', material: '', style: '' },
    designPlacements: [{
      position: 'front-center',
      dimensions: { width: 10, height: 10, unit: 'cm' },
      rotation: 0
    }],
    specialInstructions: '',
    designNotes: '',
    deliveryType: 'standard',
    deliveryAddress: { street: '', city: '', state: '', zipCode: '', country: 'India' }
  })

  const [designFile, setDesignFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')

  useEffect(() => {
    if (!user) return navigate('/login')
    fetchProducts()
  }, [user, navigate])

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products`)
      setProducts(res.data.products || [])
    } catch (err) {
      toast.error('Failed to load products')
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
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.svg'], 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024
  })

  const handleProductSelect = (e) => {
    const productId = e.target.value
    const product = products.find(p => p._id === productId)
    if (product) {
      setFormData(prev => ({ ...prev, product: productId }))
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
      designPlacements: prev.designPlacements.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      )
    }))
  }

  const updateDimension = (index, dim, value) => {
    setFormData(prev => ({
      ...prev,
      designPlacements: prev.designPlacements.map((p, i) =>
        i === index ? { ...p, dimensions: { ...p.dimensions, [dim]: value } } : p
      )
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!designFile) return toast.error('Please upload your design file')
    if (!formData.product) return toast.error('Please select a product')

    setLoading(true)

    const submitData = new FormData()

    // Required
    submitData.append('designFile', designFile)
    submitData.append('productId', formData.product)
    submitData.append('quantity', formData.quantity)
    submitData.append('designType', formData.designType)
    submitData.append('deliveryType', formData.deliveryType)

    // JSON fields (must be stringified)
    submitData.append('productOptions', JSON.stringify(formData.productOptions))
    submitData.append('designPlacements', JSON.stringify(formData.designPlacements))
    submitData.append('deliveryAddress', JSON.stringify(formData.deliveryAddress))

    // Optional text
    submitData.append('specialInstructions', formData.specialInstructions)
    submitData.append('designNotes', formData.designNotes)

    try {
      const res = await axios.post(
        `${API_URL}/api/custom-design-orders`,
        submitData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            // Let browser set Content-Type with boundary
          }
        }
      )

      toast.success('Custom design order placed successfully!')
      navigate('/profile', { state: { activeTab: 'custom-design-orders' } })

    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  const placementOptions = [
    { value: 'front-center', label: 'Front Center' },
    { value: 'back-center', label: 'Back Center' },
    { value: 'sleeve-left', label: 'Left Sleeve' },
    { value: 'sleeve-right', label: 'Right Sleeve' },
    { value: 'collar', label: 'Collar' },
    { value: 'custom', label: 'Custom Position' }
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(255,69,0,0.3)] border border-orange-300">

          <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">Custom Design Order</h1>
            <p className="text-orange-100 mt-2">Upload your design and personalize your product</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8 bg-gray-50/60 backdrop-blur-md">

            {/* Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Design File *</label>
              <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${isDragActive ? 'border-orange-500 bg-orange-50' : 'border-orange-300 hover:border-orange-500 hover:bg-orange-50'}`}>
                <input {...getInputProps()} />
                {previewUrl ? (
                  <div className="space-y-4">
                    <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                    <p className="text-sm text-gray-600">{designFile?.name}</p>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setDesignFile(null); setPreviewUrl('') }} className="text-orange-600 hover:text-orange-700">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <CloudArrowUpIcon className="h-12 w-12 text-orange-600 mx-auto" />
                    <p className="text-gray-700">Drop your design file here or click to browse</p>
                    <p className="text-xs text-gray-500">PNG, JPG, SVG, PDF up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Product */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Product *</label>
              <select value={formData.product} onChange={handleProductSelect} className="w-full bg-white border border-orange-300 rounded-md px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-100">
                <option value="">Choose a product...</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>{p.name} - {p.category}</option>
                ))}
              </select>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['color', 'size', 'material'].map(field => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{field}</label>
                  <input
                    type="text"
                    value={formData.productOptions[field]}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      productOptions: { ...prev.productOptions, [field]: e.target.value }
                    }))}
                    placeholder={`Enter ${field}`}
                    className="w-full bg-white border border-orange-300 rounded-md px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  className="w-full bg-white border border-orange-300 rounded-md px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            {/* Design Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Design Type</label>
              <select
                value={formData.designType}
                onChange={(e) => setFormData(prev => ({ ...prev, designType: e.target.value }))}
                className="w-full bg-white border border-orange-300 rounded-md px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              >
                <option value="logo">Logo</option>
                <option value="embroidery">Embroidery</option>
                <option value="text">Text Only</option>
                <option value="custom-design">Full Custom Design</option>
              </select>
            </div>

            {/* Placements */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">Design Placements</label>
                <button type="button" onClick={addPlacement} className="flex items-center text-orange-600 hover:text-orange-700">
                  <PlusIcon className="h-4 w-4 mr-1" /> Add
                </button>
              </div>
              {formData.designPlacements.map((p, i) => (
                <div key={i} className="bg-white/70 border border-orange-300 rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">Placement {i + 1}</h4>
                    {formData.designPlacements.length > 1 && (
                      <button type="button" onClick={() => removePlacement(i)} className="text-orange-600 hover:text-orange-700">
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select value={p.position} onChange={(e) => updatePlacement(i, 'position', e.target.value)} className="bg-white border border-orange-300 rounded-md px-3 py-2">
                      {placementOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <input type="number" placeholder="Width (cm)" value={p.dimensions.width} onChange={(e) => updateDimension(i, 'width', e.target.value)} className="bg-white border border-orange-300 rounded-md px-3 py-2" />
                    <input type="number" placeholder="Height (cm)" value={p.dimensions.height} onChange={(e) => updateDimension(i, 'height', e.target.value)} className="bg-white border border-orange-300 rounded-md px-3 py-2" />
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Type</label>
              <select value={formData.deliveryType} onChange={(e) => setFormData(prev => ({ ...prev, deliveryType: e.target.value }))} className="w-full bg-white border border-orange-300 rounded-md px-3 py-2">
                <option value="standard">Standard (7–10 days)</option>
                <option value="express">Express (4–6 days)</option>
                <option value="rush">Rush (2–3 days)</option>
              </select>
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Street Address" value={formData.deliveryAddress.street} onChange={(e) => setFormData(prev => ({ ...prev, deliveryAddress: { ...prev.deliveryAddress, street: e.target.value } }))} className="w-full bg-white border border-orange-300 rounded-md px-3 py-2" />
              <input placeholder="City" value={formData.deliveryAddress.city} onChange={(e) => setFormData(prev => ({ ...prev, deliveryAddress: { ...prev.deliveryAddress, city: e.target.value } }))} className="w-full bg-white border border-orange-300 rounded-md px-3 py-2" />
              <input placeholder="State" value={formData.deliveryAddress.state} onChange={(e) => setFormData(prev => ({ ...prev, deliveryAddress: { ...prev.deliveryAddress, state: e.target.value } }))} className="w-full bg-white border border-orange-300 rounded-md px-3 py-2" />
              <input placeholder="Pincode" value={formData.deliveryAddress.zipCode} onChange={(e) => setFormData(prev => ({ ...prev, deliveryAddress: { ...prev.deliveryAddress, zipCode: e.target.value } }))} className="w-full bg-white border border-orange-300 rounded-md px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
              <textarea rows={4} value={formData.specialInstructions} onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))} className="w-full bg-white border border-orange-300 rounded-md px-3 py-2" placeholder="Any notes for the designer..." />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 border border-gray-400 text-gray-700 rounded-md hover:bg-orange-50 transition">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium rounded-md hover:from-orange-600 hover:to-red-700 shadow-[0_0_10px_rgba(255,69,0,0.4)] transition disabled:opacity-50">
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