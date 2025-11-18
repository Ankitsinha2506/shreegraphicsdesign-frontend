import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  StarIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import {
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid,
} from "@heroicons/react/24/solid";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ReviewSection from "../components/reviews/ReviewSection";
import axios from "axios";
import toast from "react-hot-toast";
import ImageZoomAmazon from "../components/ImageZoomAmazon";

const CUSTOMIZATION_OPTIONS = {
  color: ["Black", "White", "Red", "Navy Blue", "Gray", "Charcoal", "Maroon", "Forest Green"],
  size: {
    tshirt: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
    hoodie: ["S", "M", "L", "XL", "2XL", "3XL", "4XL"],
    cap: ["Adjustable", "S/M", "L/XL"],
    jacket: ["S", "M", "L", "XL", "2XL", "3XL"],
    "denim-shirt": ["38", "40", "42", "44", "46"],
    default: ["S", "M", "L", "XL", "2XL"],
  },
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, clearCart, setCartItems } = useCart(); // Make sure setCartItems is available
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [customization, setCustomization] = useState({
    color: "",
    size: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        toast.error("Product Not Found");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const getSizeOptions = () => {
    const sub = product?.subcategory?.toLowerCase();
    return (
      CUSTOMIZATION_OPTIONS.size[sub] ||
      CUSTOMIZATION_OPTIONS.size[product?.category?.toLowerCase()] ||
      CUSTOMIZATION_OPTIONS.size.default
    );
  };

  const validateCustomization = () => {
    const newErrors = {};
    if (!customization.color) newErrors.color = "Color required";
    if (!customization.size) newErrors.size = "Size required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }
    if (!validateCustomization()) {
      toast.error("Please select color and size");
      return;
    }
    addToCart(product, { ...customization, quantity });
    toast.success("Added to cart!");
  };

  // FIXED BUY NOW FUNCTION
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error("Please login to place order");
      navigate("/login");
      return;
    }

    if (!validateCustomization()) {
      toast.error("Please select color and size");
      return;
    }

    const buyNowItem = {
      ...product,
      customization: { ...customization, quantity },
      quantity: customization.quantity || quantity,
      price: product.price?.base || product.price,
      productId: product._id,
    };

    setCartItems([buyNowItem]);   // ← This line is the key!

    // toast.success("Redirecting to checkout...");
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="h-14 w-14 border-4 border-orange-500 border-t-transparent animate-spin rounded-full"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-white text-black py-10">
      <div className="w-full px-4 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-5 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT: Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-[420px] mx-auto">
                <ImageZoomAmazon
                  src={product.images[selectedImage]?.url || product.images[selectedImage]}
                  width={420}
                  height={420}
                  zoom={2.3}
                  gap={40}
                  topOffset={30}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`h-16 rounded-lg bg-white flex items-center justify-center transition-all
                    ${selectedImage === i
                      ? "ring-2 ring-[#FF4500] shadow-md"
                      : "ring-1 ring-gray-200 hover:ring-[#FF4500]"
                    }`}
                >
                  <img src={img?.url || img} className="w-full h-full object-contain p-1" alt={`Thumbnail ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Info */}
          <div className="space-y-4 self-start pt-1">
            <h1 className="text-2xl font-bold text-gray-900 leading-snug">{product.name}</h1>

            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <StarIconSolid
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(product.rating?.average || 0) ? "text-yellow-400" : "text-gray-300"}`}
                />
              ))}
              <span className="text-gray-500 text-xs">
                {product.rating?.average || 0} ({product.rating?.count || 0} reviews)
              </span>
            </div>

            <div className="text-3xl font-bold text-[#FF4500]">
              ₹{product.price?.base || product.price}
            </div>

            <p className="text-gray-700 text-sm leading-relaxed">{product.description}</p>

            {/* Customization */}
            <div className="bg-gray-100 p-5 rounded-xl space-y-5">
              <div>
                <label className="block font-medium text-sm mb-2">Color *</label>
                <select
                  value={customization.color}
                  onChange={(e) => setCustomization({ ...customization, color: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 bg-white text-sm"
                >
                  <option value="">Select Color</option>
                  {CUSTOMIZATION_OPTIONS.color.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.color && <p className="text-red-500 text-xs mt-1">{errors.color}</p>}
              </div>

              <div>
                <label className="block font-medium text-sm mb-2">Size *</label>
                <select
                  value={customization.size}
                  onChange={(e) => setCustomization({ ...customization, size: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 bg-white text-sm"
                >
                  <option value="">Select Size</option>
                  {getSizeOptions().map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.size && <p className="text-red-500 text-xs mt-1">{errors.size}</p>}
              </div>

              <div>
                <label className="block font-medium text-sm mb-2">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border rounded-lg text-lg hover:bg-gray-100"
                  >−</button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border rounded-lg text-lg hover:bg-gray-100"
                  >+</button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gray-200 text-black py-3.5 rounded-lg text-base font-bold hover:bg-gray-300 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-[#FF4500] text-white py-3.5 rounded-lg text-base font-bold hover:bg-orange-600 transition shadow-lg"
              >
                Buy Now
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-3 border rounded-lg hover:bg-gray-50"
              >
                {isFavorite ? <HeartIconSolid className="h-6 w-6 text-red-500" /> : <HeartIcon className="h-6 w-6 text-gray-500" />}
              </button>
            </div>

            <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg text-sm">
              Delivery in {product.deliveryTime?.base || "5-7"} days • Free Shipping • COD Available
            </div>
          </div>
        </div>

        <div className="mt-20">
          <ReviewSection productId={product._id} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;