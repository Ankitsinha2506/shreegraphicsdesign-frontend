import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  EyeIcon,
  ShoppingCartIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import { HeartIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { API_URL } from '../config/api'

const CustomLogoDesign = () => {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedIndustry, setSelectedIndustry] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [showReferenceUpload, setShowReferenceUpload] = useState(false)
  const [referenceImages, setReferenceImages] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const { addToCart } = useCart()

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'modern', label: 'Modern' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'creative', label: 'Creative' },
    { value: 'bold', label: 'Bold' },
    { value: 'typography', label: 'Typography' },
    { value: 'other', label: 'Other' }
  ]

  const industries = [
    { value: 'all', label: 'All Industries' },
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'other', label: 'Other' }
  ]

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-1000', label: '₹0 - ₹1,000' },
    { value: '1000-2500', label: '₹1,000 - ₹2,500' },
    { value: '2500-5000', label: '₹2,500 - ₹5,000' },
    { value: '5000-10000', label: '₹5,000 - ₹10,000' },
    { value: '10000+', label: '₹10,000+' }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ]

  useEffect(() => {
    const fetchDesigns = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (searchTerm) params.append('search', searchTerm)
        if (selectedCategory !== 'all') params.append('category', selectedCategory)
        if (selectedIndustry !== 'all') params.append('industry', selectedIndustry)
        if (sortBy) params.append('sortBy', sortBy)

        if (priceRange !== 'all') {
          const [min, max] = priceRange.split('-').map(p => p.replace('+', ''))
          if (min) params.append('minPrice', min)
          if (max) params.append('maxPrice', max)
        }

        const response = await axios.get(`${API_URL}/api/custom-logo-designs?${params.toString()}`)
        setDesigns(response.data.data || [])
      } catch (error) {
        console.error('Error fetching designs:', error)
        toast.error('Failed to fetch designs')
        setDesigns([])
      } finally {
        setLoading(false)
      }
    }

    fetchDesigns()
  }, [searchTerm, selectedCategory, selectedIndustry, priceRange, sortBy])

  const handleAddToCart = (design) => {
    const cartItem = {
      id: design._id,
      name: design.title,
      price: design.pricing.basePrice,
      image: design.images[0]?.url,
      category: 'custom-logo-design'
    }
    addToCart(cartItem)
    toast.success('Added to cart!')
  }

  // Upload
  const handleFiles = (files) => {
    const valid = files.filter(f => f.type.startsWith('image/') && f.size < 10 * 1024 * 1024)
    if (referenceImages.length + valid.length > 3) return toast.error('Max 3 images allowed')
    valid.forEach(f => {
      const r = new FileReader()
      r.onload = e => setReferenceImages(p => [...p, { id: Date.now(), preview: e.target.result, name: f.name }])
      r.readAsDataURL(f)
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    handleFiles(Array.from(e.dataTransfer.files))
  }

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-black">
        <div className="animate-spin h-16 w-16 border-4 border-red-600 border-t-transparent rounded-full"></div>
      </div>
    )

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-8">

        {/* Sidebar */}
        <aside className="lg:w-80 bg-zinc-900/70 border border-red-900/40 rounded-2xl p-6 shadow-[0_0_20px_rgba(255,0,0,0.15)] sticky top-8">
          <h3 className="text-xl font-bold mb-6 text-red-500">Filters</h3>

          {/* Search */}
          <div className="mb-6">
            <label className="text-sm text-gray-400 mb-2 block">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search designs..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-black border border-red-900/40 text-gray-200 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Selects */}
          {[['Category', categories, selectedCategory, setSelectedCategory],
          ['Industry', industries, selectedIndustry, setSelectedIndustry],
          ['Price Range', priceRanges, priceRange, setPriceRange],
          ['Sort By', sortOptions, sortBy, setSortBy]].map(([label, opts, val, setVal], i) => (
            <div key={i} className="mb-6">
              <label className="text-sm text-gray-400 mb-2 block">{label}</label>
              <select
                value={val}
                onChange={e => setVal(e.target.value)}
                className="w-full bg-black border border-red-900/40 text-gray-200 rounded-lg px-3 py-2 focus:border-red-500"
              >
                {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          ))}
        </aside>

        {/* Main */}
        <main className="flex-1">
          {/* Upload */}
          <section className="bg-zinc-900/70 rounded-2xl border border-red-900/40 p-6 mb-10 shadow-[0_0_25px_rgba(255,0,0,0.15)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-500">Upload Reference Images</h3>
              <button
                onClick={() => setShowReferenceUpload(!showReferenceUpload)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition"
              >
                {showReferenceUpload ? 'Hide' : 'Upload'}
              </button>
            </div>

            {showReferenceUpload && (
              <div
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                className={`p-8 border-2 border-dashed rounded-lg text-center transition-colors ${dragActive
                  ? 'border-red-500 bg-red-900/20'
                  : 'border-red-900/40 hover:border-red-500 hover:bg-red-900/10'
                  }`}
              >
                <CloudArrowUpIcon className="h-10 w-10 text-red-500 mx-auto mb-3" />
                <p className="text-gray-300">Drag & drop reference images or click below</p>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-medium"
                >
                  Browse Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={e => handleFiles(Array.from(e.target.files))}
                  className="hidden"
                />
              </div>
            )}

            {referenceImages.length > 0 && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {referenceImages.map(img => (
                  <div key={img.id} className="relative group">
                    <img src={img.preview} alt={img.name} className="rounded-lg object-cover h-40 w-full" />
                    <button
                      onClick={() =>
                        setReferenceImages(prev => prev.filter(i => i.id !== img.id))
                      }
                      className="absolute top-2 right-2 bg-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <XMarkIcon className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {designs.map(design => (
              <div
                key={design._id}
                className="bg-zinc-900/70 border border-red-900/40 rounded-xl overflow-hidden hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(255,0,0,0.25)] transition-all"
              >
                <div className="relative">
                  <img
                    src={design.images[0]?.url}
                    alt={design.title}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 right-2 bg-red-600 text-xs px-2 py-1 rounded-full">₹{design.pricing.basePrice}</span>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-2 line-clamp-1">{design.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-3">{design.description}</p>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center text-sm text-gray-400">
                      <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                      {design.rating?.average || 0}
                    </div>
                    <span className="text-xs text-gray-500">{design.pricing.deliveryTime} days</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/custom-logo-designs/${design._id}`}
                      className="flex-1 bg-transparent border border-red-600 text-red-500 hover:bg-red-600 hover:text-white text-center rounded-lg py-2 text-sm transition"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleAddToCart(design)}
                      className="bg-red-600 hover:bg-red-500 rounded-lg p-2 transition"
                    >
                      <ShoppingCartIcon className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {designs.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FunnelIcon className="h-10 w-10 mx-auto mb-2 text-red-500" />
              No designs found.
              <p className="text-gray-600">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}

          {/* 🚀 Call to Action */}
          <div className="mt-16 bg-gradient-to-r from-red-700 via-red-800 to-black rounded-2xl p-10 text-center text-white shadow-[0_0_30px_rgba(255,0,0,0.3)]">
            <h2 className="text-3xl font-bold mb-4">Need a Custom Logo Design?</h2>
            <p className="text-lg mb-6 text-gray-200 max-w-2xl mx-auto">
              Can’t find what you’re looking for? Let our expert designers craft a unique logo that defines your brand identity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/custom-logo-request"
                className="inline-block bg-white text-red-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 shadow-[0_0_10px_rgba(255,0,0,0.4)] transition-all"
              >
                Submit Custom Request
              </Link>
              <Link
                to="/contact"
                className="inline-block border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-red-700 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>


        </main>
      </div>
    </div>
  )
}

export default CustomLogoDesign
