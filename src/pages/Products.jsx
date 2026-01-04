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
  const [sortBy, setSortBy] = useState('newest')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchParams] = useSearchParams()
  const { addToCart } = useCart()

  // ==================== FILTER OPTIONS ====================
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
      { value: 'cap', label: 'Caps' },
      { value: 'jackets', label: 'Jackets' },
      { value: 'shirt', label: 'Shirts' },
      { value: 'denim-shirt', label: 'T-Shirts' },
      // { value: 'windcheaters', label: 'Windcheaters' }
    ],
    travels: [
      { value: 'all', label: 'All Travel Items' },
      { value: 'hand-bag', label: 'Hand Bags' },
      { value: 'strolley-bags', label: 'Trolley Bags' },
      { value: 'travel-bags', label: 'Travel Bags' },
      { value: 'back-packs', label: 'Backpacks' },
      { value: 'laptop-bags', label: 'Laptop Bags' }
    ],
    leather: [
      { value: 'all', label: 'All Leather' },
      { value: 'office-bags', label: 'Office Bags' },
      { value: 'wallets', label: 'Wallets' }
    ],
    uniforms: [
      { value: 'all', label: 'All Uniforms' },
      { value: 'school-uniforms', label: 'School Uniforms' },
      { value: 'corporate', label: 'Corporate Uniforms' }
    ],
    embroidery: [
      { value: 'all', label: 'All Embroidery' },
      { value: 'logo-embroidery', label: 'Logo Embroidery' },
      { value: 'text-embroidery', label: 'Text Embroidery' },
      { value: 'custom-patches', label: 'Patches' },
      { value: 'monogramming', label: 'Monogramming' },
      { value: 'custom-embroidery', label: 'Custom Embroidery' }
    ],
    'design-services': [
      { value: 'all', label: 'All Services' },
      { value: 'logo-design', label: 'Logo Design' },
      { value: 'business-card', label: 'Business Cards' },
      { value: 'brochure', label: 'Brochures' },
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

  // ==================== EFFECTS ====================
  useEffect(() => {
    const category = searchParams.get('category')
    const subcategory = searchParams.get('subcategory')
    if (category) setSelectedCategory(category)
    if (subcategory) setSelectedSubcategory(subcategory)
  }, [searchParams])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const response = await axios.get('/api/products?limit=1000')
        setProducts(response.data.products || response.data)
      } catch (error) {
        toast.error('Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])


  const SUBCATEGORY_ALIASES = {
    cap: ['cap', 'caps'],
    shirt: ['shirt', 'shirts'],
    'denim-shirt': ['tshirt', 't-shirt', 't shirt', 'tee', 'tee shirt'],
    jackets: ['jacket', 'jackets'],
    windcheaters: ['windcheater', 'wind cheater'],

    'hand-bag': ['handbag', 'hand bag'],
    'strolley-bags': ['strolley', 'trolley', 'trolley bag'],
    'travel-bags': ['travel bag'],
    'back-packs': ['backpack', 'back pack'],
    'laptop-bags': ['laptop bag'],

    'office-bags': ['office bag'],
    wallets: ['wallet', 'wallets'],

    'school-uniforms': ['school uniform'],
    corporate: ['corporate uniform']
  }

  const normalize = (str = '') =>
    str
      .toLowerCase()
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()


  const resolveCanonicalSubcategory = (value = '') => {
    const normalized = normalize(value)

    for (const [canonical, aliases] of Object.entries(SUBCATEGORY_ALIASES)) {
      if (
        normalize(canonical) === normalized ||
        aliases.some(alias => normalize(alias) === normalized)
      ) {
        return canonical
      }
    }

    return normalized
  }

  // ==================== FILTERING & SORTING ====================
  const filteredProducts = products.filter(product => {
    /* ================= SEARCH (ALIAS + NAME) ================= */
    let matchesSearch = true

    if (searchTerm) {
      const search = normalize(searchTerm)
      const name = normalize(product.name)
      const subcategory = normalize(product.subcategory)

      matchesSearch = false

      // 1️⃣ Exact subcategory match
      if (subcategory === search) {
        matchesSearch = true
      }

      // 2️⃣ Alias match (tshirt → denim-shirt)
      if (!matchesSearch) {
        const aliases = SUBCATEGORY_ALIASES[product.subcategory] || []
        if (aliases.some(a => normalize(a) === search)) {
          matchesSearch = true
        }
      }

      // 3️⃣ Product name contains search
      if (!matchesSearch && name.includes(search)) {
        matchesSearch = true
      }
    }

    /* ================= CATEGORY ================= */
    const matchesCategory =
      selectedCategory === 'all' ||
      product.category === selectedCategory

    /* ================= SUBCATEGORY (ALIAS AWARE) ================= */
    let matchesSubcategory = true

    if (selectedSubcategory !== 'all') {
      const selectedKey = resolveCanonicalSubcategory(selectedSubcategory)
      const productKey = resolveCanonicalSubcategory(product.subcategory)

      matchesSubcategory = selectedKey === productKey
    }


    /* ================= PRICE ================= */
    let matchesPrice = true

    if (priceRange !== 'all') {
      const price = product.price?.base || product.price || 0
      const [min, max] =
        priceRange === '2000+'
          ? [2000, Infinity]
          : priceRange.split('-').map(Number)

      matchesPrice = price >= min && price <= max
    }

    return (
      matchesSearch &&
      matchesCategory &&
      matchesSubcategory &&
      matchesPrice
    )
  })


  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.price?.base || a.price || 0
    const priceB = b.price?.base || b.price || 0
    switch (sortBy) {
      case 'price-low': return priceA - priceB
      case 'price-high': return priceB - priceA
      case 'popular': return (b.rating?.average || 0) - (a.rating?.average || 0)
      case 'newest': return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      default: return 0
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-orange-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="w-full px-4 lg:px-8 py-10">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 uppercase tracking-tight">
            Premium Industrial Collection
          </h1>
          <p className="text-lg text-gray-600 mt-3">Corporate Uniforms • Custom Branding • Bulk Orders</p>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-8">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full bg-gray-50 border border-orange-300 rounded-xl py-4 flex items-center justify-center gap-3 text-base font-semibold text-gray-700 hover:bg-orange-50 transition"
          >
            <FunnelIcon className="h-5 w-5" />
            Filters {isFilterOpen ? 'Close' : 'Open'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ==================== FULL FILTER SIDEBAR (NOW VISIBLE) ==================== */}
          <aside className={`${isFilterOpen ? 'block' : 'hidden lg:block'} lg:w-72 bg-white/95 backdrop-blur-md border border-orange-300 rounded-xl p-6 space-y-6 sticky top-24 h-fit shadow-lg`}>
            <div className="flex justify-between items-center pb-4 border-b border-orange-200">
              <h3 className="text-lg font-bold text-orange-600 flex items-center gap-2">
                <FunnelIcon className="h-6 w-6" /> FILTERS
              </h3>
              <button onClick={() => setIsFilterOpen(false)} className="lg:hidden">
                <XMarkIcon className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-900"
              />
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider">Category</h4>
              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => { setSelectedCategory(cat.value); setSelectedSubcategory('all') }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition ${selectedCategory === cat.value
                    ? 'bg-orange-600 text-white font-medium'
                    : 'text-gray-700 hover:bg-orange-50'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Subcategories */}
            {selectedCategory !== 'all' && subcategories[selectedCategory] && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-orange-600 uppercase">Type</h4>
                {subcategories[selectedCategory].map(sub => (
                  <button
                    key={sub.value}
                    onClick={() => setSelectedSubcategory(sub.value)}
                    className={`block w-full text-left px-4 py-2 text-xs ${selectedSubcategory === sub.value ? 'text-orange-600 font-medium' : 'text-gray-500'}`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}

            {/* Price & Sort */}
            <div className="space-y-4 pt-4 border-t border-orange-200">
              <div>
                <h4 className="text-xs font-bold text-orange-600 uppercase mb-2">Price Range</h4>
                <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-900">
                  {priceRanges.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div>
                <h4 className="text-xs font-bold text-orange-600 uppercase mb-2">Sort By</h4>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-900">
                  {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setSelectedSubcategory('all')
                setPriceRange('all')
                setSortBy('newest')
              }}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium py-3 rounded-lg text-sm transition"
            >
              Clear All Filters
            </button>
          </aside>

          {/* ==================== PRODUCT GRID (3 CARDS + FULL IMAGES) ==================== */}
          <main className="flex-1">
            {sortedProducts.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-3xl font-bold text-gray-600">No Products Found</p>
                <p className="text-gray-500 mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedProducts.map(product => (
                  <div
                    key={product._id}
                    className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-orange-300 shadow-lg hover:shadow-2xl hover:shadow-orange-200/50 transition-all duration-500 flex flex-col"
                  >
                    <Link to={`/products/${product._id}`} className="block relative">
                      <div className="aspect-square bg-gray-50">
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                          <img
                            src={product.images?.[0]?.url || '/placeholder.jpg'}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      </div>

                      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-white px-5 py-3 rounded-xl text-xl font-bold shadow-2xl">
                        ₹{product.price?.base || product.price || 0}
                      </div>

                      {product.isNew && (
                        <div className="absolute top-4 left-4 bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-xl">
                          New
                        </div>
                      )}
                    </Link>

                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between bg-white">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-2 leading-tight">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-3">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className={`w-5 h-5 ${i < 4.7 ? 'text-orange-500 fill-current' : 'text-gray-300'}`} />
                          ))}
                          <span className="text-sm text-gray-500 ml-2">({product.rating?.count || 0})</span>
                        </div>
                      </div>

                      <div className="text-sm font-semibold text-orange-600 uppercase tracking-wider">
                        {product.category?.replace(/-/g, ' ') || 'Corporate'}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        addToCart(product)
                        toast.success('Added to cart!')
                      }}
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 text-base uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-orange-500/50"
                    >
                      Add to Cart
                    </button>
                  </div>
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
