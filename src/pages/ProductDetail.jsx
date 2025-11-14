import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { StarIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import ReviewSection from '../components/reviews/ReviewSection'
import ProductCustomizer from '../components/ProductCustomizer'
import axios from 'axios'
import toast from 'react-hot-toast'
import ImageZoomAmazon from '../components/ImageZoomAmazon'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [customization, setCustomization] = useState({ color: '', size: '', text: '', font: '' })
  const [customDesign, setCustomDesign] = useState(null)
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`)
        const data = response.data.product || response.data
        if (!data) {
          toast.error('Product not found')
          navigate('/products')
          return
        }
        setProduct(data)
      } catch (error) {
        toast.error('Failed to load product')
        navigate('/products')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id, navigate])

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      navigate('/login')
      return
    }
    addToCart(product, { ...customization, customDesign, quantity })
    toast.success('Added to cart!')
  }

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed')
      navigate('/login')
      return
    }
    addToCart(product, customization)
    navigate('/checkout')
  }

  const supportsCustomDesign = () =>
    product?.category === 'apparels' ||
    ['cap', 'shirt', 'jackets', 'denim-shirt'].includes(product?.subcategory)

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-500">
        <div className="animate-spin h-24 w-24 border-4 border-red-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <button onClick={() => navigate('/products')} className="px-6 py-2 rounded-md bg-red-600 hover:bg-red-700">
          Back to Products
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium bg-zinc-900 border border-red-900/50 rounded-md hover:bg-red-900/20 transition"
        >
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Images */}
          <div>
            <div className="bg-zinc-900/70 border border-red-900/40 rounded-xl overflow-hidden mb-4 shadow-[0_0_20px_rgba(255,0,0,0.2)]">
              <ImageZoomAmazon
                src={product.images[selectedImage]?.url}
                width={500}
                height={500}
                zoom={3}
                zoomWidth={600}
                zoomHeight={600}
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`border-2 rounded-lg overflow-hidden transition ${
                    selectedImage === i ? 'border-red-600 shadow-[0_0_10px_rgba(255,0,0,0.5)]' : 'border-zinc-800 hover:border-red-600'
                  }`}
                >
                  <img src={img?.url || img} alt={product.name} className="w-full h-24 object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">
                {product.name}
              </h1>
              <div className="flex items-center space-x-3 mt-2">
                {[...Array(5)].map((_, i) => (
                  <StarIconSolid
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(product.rating?.average || 0) ? 'text-yellow-400' : 'text-zinc-700'}`}
                  />
                ))}
                <span className="text-sm text-gray-400">
                  {product.rating?.average || 0} ({product.rating?.count || 0})
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-red-500">
                ₹{product.price?.base || product.price}
              </span>
              {product.price?.premium && (
                <div className="text-sm text-gray-400">
                  <p>Premium: ₹{product.price.premium}</p>
                  {product.price.enterprise && <p>Enterprise: ₹{product.price.enterprise}</p>}
                </div>
              )}
            </div>

            <p className="text-gray-400">{product.description}</p>

            {/* Customization */}
            <div className="border-t border-red-900/40 pt-4">
              <h3 className="text-lg font-semibold text-red-500 mb-3">Customization Options</h3>
              <div className="space-y-3">
                {['color', 'size', 'text', 'font'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm mb-1 text-gray-400 capitalize">{field}</label>
                    {field === 'text' ? (
                      <input
                        type="text"
                        value={customization[field]}
                        onChange={(e) => setCustomization({ ...customization, [field]: e.target.value })}
                        placeholder={`Enter ${field}`}
                        className="w-full bg-black border border-red-900/40 rounded-md px-3 py-2 text-gray-300 focus:border-red-600"
                      />
                    ) : (
                      <select
                        value={customization[field]}
                        onChange={(e) => setCustomization({ ...customization, [field]: e.target.value })}
                        className="w-full bg-black border border-red-900/40 rounded-md px-3 py-2 text-gray-300 focus:border-red-600"
                      >
                        <option value="">Select {field}</option>
                        {['color', 'size'].includes(field)
                          ? ['Black', 'White', 'Red', 'Blue', 'Gray'].map((opt) => (
                              <option key={opt}>{opt}</option>
                            ))
                          : ['Modern', 'Classic', 'Bold'].map((opt) => (
                              <option key={opt}>{opt}</option>
                            ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="pt-3">
              <label className="text-sm text-gray-400">Quantity</label>
              <div className="flex items-center gap-3 mt-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 border border-red-900/40 rounded-full flex items-center justify-center hover:bg-red-900/30"
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 border border-red-900/40 rounded-full flex items-center justify-center hover:bg-red-900/30"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center space-x-4 pt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-800 py-3 rounded-md text-white font-semibold hover:from-red-700 hover:to-red-900 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 border border-red-600 py-3 rounded-md text-red-500 hover:bg-red-900/30 transition font-semibold"
              >
                Buy Now
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-3 border border-red-900/40 rounded-md hover:bg-red-900/30"
              >
                {isFavorite ? (
                  <HeartIconSolid className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-gray-400" />
                )}
              </button>
              <button className="p-3 border border-red-900/40 rounded-md hover:bg-red-900/30">
                <ShareIcon className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            {/* Delivery Info */}
            <div className="bg-zinc-900/70 border border-red-900/40 p-4 rounded-lg mt-6">
              <h4 className="text-red-400 font-medium mb-1">Delivery Information</h4>
              <p className="text-sm text-gray-400">
                Expected delivery: {product.deliveryTime?.base || product.deliveryTime} days
              </p>
            </div>
          </div>
        </div>

        {/* Customizer */}
        {supportsCustomDesign() && showCustomizer && (
          <div className="mt-10 bg-zinc-900/70 border border-red-900/40 rounded-xl p-6">
            <ProductCustomizer product={product} onCustomizationChange={setCustomDesign} />
          </div>
        )}

        {/* Reviews */}
        <div className="mt-12 border-t border-red-900/40 pt-8">
          <ReviewSection productId={product._id} />
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
