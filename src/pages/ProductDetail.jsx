import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StarIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ReviewSection from '../components/reviews/ReviewSection';
import ProductCustomizer from '../components/ProductCustomizer';
import axios from 'axios';
import toast from 'react-hot-toast';
import ImageZoomAmazon from '../components/ImageZoomAmazon';

// Industrial-grade option sets
const CUSTOMIZATION_OPTIONS = {
  color: ['Black', 'White', 'Red', 'Navy Blue', 'Gray', 'Charcoal', 'Maroon', 'Forest Green'],
  
  size: {
    tshirt: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    hoodie: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    cap: ['Adjustable', 'S/M', 'L/XL'],
    jacket: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    'denim-shirt': ['38', '40', '42', '44', '46'],
    default: ['S', 'M', 'L', 'XL', '2XL']
  },

  font: ['Modern', 'Classic', 'Bold', 'Script', 'Sans Serif', 'Mono', 'Handwritten']
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);

  // Dynamic customization state
  const [customization, setCustomization] = useState({
    color: '',
    size: '',
    text: '',
    font: ''
  });

  const [customDesign, setCustomDesign] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        const data = response.data.product || response.data;
        if (!data) throw new Error('Product not found');
        setProduct(data);
      } catch (error) {
        toast.error(error.message || 'Failed to load product');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  // Determine required fields based on product type
  const getRequiredFields = () => {
    const required = ['color', 'size'];
    if (supportsCustomText()) required.push('text', 'font');
    return required;
  };

  const supportsCustomText = () => {
    return ['shirt', 'cap', 'hoodie', 'jackets', 'denim-shirt'].includes(product?.subcategory);
  };

  const supportsCustomDesign = () => {
    return product?.category === 'apparels' || 
           ['cap', 'shirt', 'hoodie', 'jackets', 'denim-shirt'].includes(product?.subcategory);
  };

  // Get size options based on subcategory
  const getSizeOptions = () => {
    const sub = product?.subcategory?.toLowerCase();
    return CUSTOMIZATION_OPTIONS.size[sub] || 
           CUSTOMIZATION_OPTIONS.size[product?.category] || 
           CUSTOMIZATION_OPTIONS.size.default;
  };

  // Validation
  const validateCustomization = () => {
    const required = getRequiredFields();
    const newErrors = {};

    required.forEach(field => {
      if (!customization[field]?.trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (!validateCustomization()) {
      toast.error('Please complete all required customization options');
      return;
    }

    addToCart(product, { ...customization, customDesign, quantity });
    toast.success(`${quantity} × ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed');
      navigate('/login');
      return;
    }

    if (!validateCustomization()) {
      toast.error('Please complete all required fields');
      return;
    }

    addToCart(product, { ...customization, customDesign, quantity });
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin h-20 w-20 border-4 border-red-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
        <button onClick={() => navigate('/products')} className="px-8 py-3 bg-red-600 rounded-md hover:bg-red-700 transition">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-5 py-2 mb-8 text-sm font-medium bg-zinc-900 border border-red-900/50 rounded-lg hover:bg-red-900/20 transition"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="bg-zinc-900/70 border border-red-900/40 rounded-2xl overflow-hidden shadow-2xl">
              <ImageZoomAmazon
                src={product.images[selectedImage]?.url || product.images[selectedImage]}
                width={600}
                height={600}
                zoom={3}
              />
            </div>
            <div className="grid grid-cols-5 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`border-2 rounded-xl overflow-hidden transition-all ${
                    selectedImage === i 
                      ? 'border-red-600 ring-2 ring-red-600 ring-offset-2 ring-offset-black' 
                      : 'border-zinc-700 hover:border-red-600'
                  }`}
                >
                  <img 
                    src={img?.url || img} 
                    alt={`${product.name} ${i + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mt-3">
                {[...Array(5)].map((_, i) => (
                  <StarIconSolid
                    key={i}
                    className={`h-6 w-6 ${i < Math.round(product.rating?.average || 0) ? 'text-yellow-400' : 'text-zinc-600'}`}
                  />
                ))}
                <span className="text-gray-400 ml-2">
                  {product.rating?.average || '0.0'} ({product.rating?.count || 0} reviews)
                </span>
              </div>
            </div>

            <div className="text-4xl font-bold text-red-500">
              ₹{product.price?.base || product.price}
            </div>

            <p className="text-gray-300 leading-relaxed">{product.description}</p>

            {/* Customization Options */}
            <div className="bg-zinc-900/50 border border-red-900/30 rounded-2xl p-6 space-y-6">
              <h3 className="text-xl font-semibold text-red-500">Customize Your Product</h3>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Color <span className="text-red-500">*</span>
                </label>
                <select
                  value={customization.color}
                  onChange={(e) => setCustomization({ ...customization, color: e.target.value })}
                  className={`w-full bg-black border ${errors.color ? 'border-red-500' : 'border-red-900/50'} rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none transition`}
                >
                  <option value="">Choose Color</option>
                  {CUSTOMIZATION_OPTIONS.color.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {errors.color && <p className="text-red-400 text-xs mt-1">{errors.color}</p>}
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Size <span className="text-red-500">*</span>
                </label>
                <select
                  value={customization.size}
                  onChange={(e) => setCustomization({ ...customization, size: e.target.value })}
                  className={`w-full bg-black border ${errors.size ? 'border-red-500' : 'border-red-900/50'} rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none transition`}
                >
                  <option value="">Choose Size</option>
                  {getSizeOptions().map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                {errors.size && <p className="text-red-400 text-xs mt-1">{errors.size}</p>}
              </div>

              {/* Custom Text (Conditional) */}
              {supportsCustomText() && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Custom Text <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={30}
                      placeholder="Enter text (max 30 chars)"
                      value={customization.text}
                      onChange={(e) => setCustomization({ ...customization, text: e.target.value })}
                      className={`w-full bg-black border ${errors.text ? 'border-red-500' : 'border-red-900/50'} rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none transition`}
                    />
                    <p className="text-xs text-gray-500 mt-1">{customization.text.length}/30</p>
                    {errors.text && <p className="text-red-400 text-xs mt-1">{errors.text}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Font Style <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={customization.font}
                      onChange={(e) => setCustomization({ ...customization, font: e.target.value })}
                      className={`w-full bg-black border ${errors.font ? 'border-red-500' : 'border-red-900/50'} rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none transition`}
                    >
                      <option value="">Choose Font</option>
                      {CUSTOMIZATION_OPTIONS.font.map(font => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                    {errors.font && <p className="text-red-400 text-xs mt-1">{errors.font}</p>}
                  </div>
                </>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-lg border border-red-900/50 hover:bg-red-900/20 transition"
                  >-</button>
                  <span className="text-2xl font-semibold w-16 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-lg border border-red-900/50 hover:bg-red-900/20 transition"
                  >+</button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-800 py-4 rounded-xl font-bold text-lg hover:from-red-700 hover:to-red-900 transition shadow-lg"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 border-2 border-red-600 py-4 rounded-xl font-bold text-lg text-red-500 hover:bg-red-900/20 transition"
              >
                Buy Now
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-4 border border-red-900/50 rounded-xl hover:bg-red-900/20 transition"
              >
                {isFavorite ? <HeartIconSolid className="h-7 w-7 text-red-500" /> : <HeartIcon className="h-7 w-7 text-gray-400" />}
              </button>
            </div>

            {/* Custom Design Toggle */}
            {supportsCustomDesign() && (
              <button
                onClick={() => setShowCustomizer(!showCustomizer)}
                className="w-full py-3 border border-red-600 rounded-xl text-red-400 hover:bg-red-900/20 transition font-medium"
              >
                {showCustomizer ? 'Hide' : 'Show'} Advanced Custom Designer
              </button>
            )}

            {/* Delivery Info */}
            <div className="bg-zinc-900/70 border border-red-900/40 p-5 rounded-xl">
              <p className="text-red-400 font-medium">Delivery in {product.deliveryTime?.base || '5-7'} days</p>
              <p className="text-sm text-gray-400 mt-1">Free shipping on orders above ₹999</p>
            </div>
          </div>
        </div>

        {/* Advanced Customizer */}
        {supportsCustomDesign() && showCustomizer && (
          <div className="mt-16 bg-zinc-900/70 border border-red-900/40 rounded-2xl p-8">
            <ProductCustomizer 
              product={product} 
              initialCustomization={customization}
              onCustomizationChange={setCustomDesign} 
            />
          </div>
        )}

        {/* Reviews */}
        <div className="mt-20 border-t border-red-900/40 pt-12">
          <ReviewSection productId={product._id} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;