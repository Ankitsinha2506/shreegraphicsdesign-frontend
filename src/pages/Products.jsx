import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSubcategory, setSelectedSubcategory] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [searchParams] = useSearchParams()
  const { addToCart } = useCart()

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'apparels', label: 'Apparels' },
    { value: 'travels', label: 'Travels' },
    { value: 'leather', label: 'Leather' },
    { value: 'uniforms', label: 'Uniforms' },
    { value: 'embroidery', label: 'Embroidery' },
    { value: 'design-services', label: 'Design Services' }
  ]

  const subcategories = {
    apparels: [
      { value: 'all', label: 'All Apparels' },
      { value: 'cap', label: 'Cap' },
      { value: 'jackets', label: 'Jackets' },
      { value: 'shirt', label: 'Shirt' },
      { value: 'tshirt', label: 'T-Shirt' },
      { value: 'windcheaters', label: 'Windcheaters' }
    ],
    travels: [
      { value: 'all', label: 'All Travel Items' },
      { value: 'hand-bag', label: 'Hand Bag' },
      { value: 'strolley-bags', label: 'Strolley Bags' },
      { value: 'travel-bags', label: 'Travel Bags' },
      { value: 'back-packs', label: 'Back Packs' },
      { value: 'laptop-bags', label: 'Laptop Bags' }
    ],
    leather: [
      { value: 'all', label: 'All Leather Items' },
      { value: 'office-bags', label: 'Office Bags' },
      { value: 'wallets', label: 'Wallets' }
    ],
    uniforms: [
      { value: 'all', label: 'All Uniforms' },
      { value: 'school-uniforms', label: 'School Uniforms' },
      { value: 'corporate', label: 'Corporate' }
    ],
    embroidery: [
      { value: 'all', label: 'All Embroidery' },
      { value: 'logo-embroidery', label: 'Logo Embroidery' },
      { value: 'text-embroidery', label: 'Text Embroidery' },
      { value: 'custom-patches', label: 'Patches' },
      { value: 'monogramming', label: 'Monogramming' },
      { value: 'badge-embroidery', label: 'Badge Embroidery' },
      { value: 'custom-embroidery', label: 'Custom Embroidery' },
      { value: 'hand-embroidery', label: 'Hand Embroidery' }
    ],
    'design-services': [
      { value: 'all', label: 'All Design Services' },
      { value: 'logo-design', label: 'Logo Design' },
      { value: 'business-card', label: 'Business Card' },
      { value: 'brochure', label: 'Brochure' },
      { value: 'custom-design', label: 'Custom Design' }
    ]
  }

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-500', label: '₹0 - ₹500' },
    { value: '500-1000', label: '₹500 - ₹1000' },
    { value: '1000-2000', label: '₹1000 - ₹2000' },
    { value: '2000+', label: '₹2000+' }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' }
  ]

  useEffect(() => {
    const category = searchParams.get('category')
    const subcategory = searchParams.get('subcategory')
    setSelectedCategory(category || 'all')
    setSelectedSubcategory(subcategory || 'all')
  }, [searchParams])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const response = await axios.get('/api/products?limit=1000')
        setProducts(response.data.products || response.data)
      } catch (error) {
        toast.error('Failed to fetch products')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSubcategory = selectedSubcategory === 'all' || product.subcategory === selectedSubcategory

    let matchesPrice = true
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(p => p.replace('+', ''))
      const price = product.price?.base || product.price || 0
      matchesPrice = max ? price >= +min && price <= +max : price >= +min
    }

    return matchesSearch && matchesCategory && matchesSubcategory && matchesPrice
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.price?.base || a.price || 0
    const priceB = b.price?.base || b.price || 0
    switch (sortBy) {
      case 'price-low': return priceA - priceB
      case 'price-high': return priceB - priceA
      case 'popular': return (b.rating?.average || 0) - (a.rating?.average || 0)
      default: return 0
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-500">
        <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 mb-2">
            Our Premium Products
          </h1>
          <p className="text-gray-400">Explore exclusive designs, embroidery & branding products</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="lg:w-80 bg-zinc-900/80 border border-red-900/40 rounded-2xl shadow-[0_0_20px_rgba(255,0,0,0.2)] p-6 h-fit sticky top-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-red-500 flex items-center gap-2">
                <FunnelIcon className="h-5 w-5" /> Filters
              </h3>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  setSelectedSubcategory('all')
                  setPriceRange('all')
                  setSortBy('name')
                }}
                className="text-xs text-gray-400 hover:text-red-400 transition"
              >
                Clear
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black border border-red-900/40 text-gray-300 rounded-md pl-10 py-2 focus:border-red-500"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2 mb-6">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => { setSelectedCategory(cat.value); setSelectedSubcategory('all') }}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm transition ${
                    selectedCategory === cat.value
                      ? 'bg-gradient-to-r from-red-700 to-black text-white shadow-md'
                      : 'bg-black text-gray-400 hover:text-white hover:bg-red-900/20'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Subcategories */}
            {selectedCategory !== 'all' && subcategories[selectedCategory] && (
              <div className="mb-6">
                <h4 className="text-red-500 text-sm mb-3 font-semibold">Subcategories</h4>
                <div className="space-y-2">
                  {subcategories[selectedCategory].map(sub => (
                    <button
                      key={sub.value}
                      onClick={() => setSelectedSubcategory(sub.value)}
                      className={`w-full text-left px-4 py-2 rounded-md text-sm ${
                        selectedSubcategory === sub.value
                          ? 'bg-red-700 text-white'
                          : 'bg-black text-gray-400 hover:text-white hover:bg-red-900/20'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="text-red-500 text-sm mb-3 font-semibold">Price Range</h4>
              {priceRanges.map(range => (
                <label key={range.value} className="flex items-center text-sm cursor-pointer mb-2">
                  <input
                    type="radio"
                    name="priceRange"
                    value={range.value}
                    checked={priceRange === range.value}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="accent-red-600 mr-2"
                  />
                  <span className="text-gray-300">{range.label}</span>
                </label>
              ))}
            </div>

            {/* Sort */}
            <div>
              <h4 className="text-red-500 text-sm mb-3 font-semibold">Sort By</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-black border border-red-900/40 text-gray-300 rounded-md px-3 py-2 focus:border-red-500"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {sortedProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <FunnelIcon className="h-16 w-16 mx-auto text-red-700 mb-4" />
                <p className="text-lg">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedProducts.map(product => (
                  <Link
                    key={product._id}
                    to={`/products/${product._id}`}
                    className="bg-zinc-900/70 border border-red-900/40 rounded-xl overflow-hidden shadow-md hover:shadow-[0_0_15px_rgba(255,0,0,0.4)] transition-all group"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={product.images?.[0]?.url || 'https://via.placeholder.com/400x300'}
                        alt={product.name}
                        className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-red-600/90 text-white text-xs px-3 py-1 rounded-md font-bold">
                        ₹{product.price?.base || product.price || 0}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-1 group-hover:text-red-400">{product.name}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-3">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-1 text-yellow-400">
                          <StarIcon className="h-4 w-4" />
                          <span className="text-sm text-gray-300">{product.rating?.average || 0}</span>
                        </div>
                        <span className="text-xs text-gray-500 uppercase">{product.category}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Products
