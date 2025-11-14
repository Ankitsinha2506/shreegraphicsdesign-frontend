import { Link } from 'react-router-dom'
import { ArrowRightIcon, StarIcon } from '@heroicons/react/24/solid'
import { CheckCircleIcon, TruckIcon, ShieldCheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import ClientsCarousel from '../components/ClientsCarousel'
import embroideryMachine from "../assets/images/embroideryhero.jpg";

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [displayedProducts, setDisplayedProducts] = useState(12)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products?limit=1000')
        setProducts(res.data.products || res.data)
      } catch (err) {
        toast.error('Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 🧵 Hero Section */}
      <section className="relative overflow-hidden h-screen flex items-center justify-center">
        <img
          src={embroideryMachine}
          alt="Embroidery Machine"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        {/* <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-red-950/80"></div> */}
        <div className="absolute inset-0 bg-gradient-to-b"></div>

        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 mb-6">
            Custom Embroidery & Branding That Commands Attention
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Elevate your brand with bold, precision-crafted embroidery and custom logo design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-8 py-3 rounded-md font-semibold shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all flex items-center justify-center"
            >
              Browse Products
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="border border-red-500 text-red-400 px-8 py-3 rounded-md font-semibold hover:bg-red-900/30 transition-all flex items-center justify-center"
            >
              Get Custom Quote
            </Link>
          </div>
          <p className="mt-8 text-sm text-gray-400 italic">
            Trusted by 500+ brands for premium embroidery and design services.
          </p>
        </div>
      </section>

      {/* 🛍 Products Section */}
      <section className="py-20 bg-gradient-to-b from-black via-zinc-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-red-500 mb-3">Our Products</h2>
            <p className="text-gray-400">Discover the art of stitched perfection.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-12 w-12 border-b-2 border-red-600 rounded-full"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.slice(0, displayedProducts).map((product) => (
                  <div
                    key={product._id}
                    className="bg-zinc-900 border border-red-900/40 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(255,0,0,0.15)] hover:shadow-[0_0_25px_rgba(255,0,0,0.35)] transition-all group"
                  >
                    <div className="relative">
                      <img
                        src={product.images?.[0]?.url || 'https://via.placeholder.com/400x300'}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.isFeatured && (
                        <div className="absolute top-3 left-3 bg-red-600 text-xs font-semibold px-2 py-1 rounded-md">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-red-400 font-bold">₹{product.price?.base || 0}</span>
                        <span className="text-xs text-gray-500">{product.category}</span>
                      </div>
                      <Link
                        to={`/products/${product._id}`}
                        className="block mt-4 w-full text-center bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white py-2 rounded-md font-medium transition-all"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {products.length > displayedProducts && (
                <div className="text-center mt-10">
                  <button
                    onClick={() => setDisplayedProducts((p) => p + 8)}
                    className="bg-zinc-800 border border-red-900/50 text-red-400 px-8 py-3 rounded-md hover:bg-red-900/20 transition"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* 💼 Services */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-red-500 mb-10">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Custom Logo Design', desc: 'Distinctive designs that define your brand.' },
              { title: 'Embroidery Services', desc: 'Perfect stitches. Perfect impressions.' },
              { title: 'Brand Merchandise', desc: 'Bags, apparel, and corporate uniforms.' },
            ].map((srv, i) => (
              <div
                key={i}
                className="bg-zinc-900/70 border border-red-900/40 rounded-xl p-6 hover:shadow-[0_0_20px_rgba(255,0,0,0.25)] transition-all"
              >
                <h3 className="text-xl font-semibold text-red-400 mb-2">{srv.title}</h3>
                <p className="text-gray-400">{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🧷 Clients */}
      <ClientsCarousel />

      {/* ⭐ Features */}
      <section className="py-20 bg-zinc-900/70 border-t border-red-900/40">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-red-500 mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: CheckCircleIcon,
                title: 'Custom Designs',
                desc: 'Unique embroidery tailored for your brand.',
              },
              {
                icon: TruckIcon,
                title: 'Fast Delivery',
                desc: 'Quick turnarounds with consistent quality.',
              },
              {
                icon: ShieldCheckIcon,
                title: 'Quality Guarantee',
                desc: '100% satisfaction or free revision.',
              },
            ].map((f, i) => {
              const Icon = f.icon
              return (
                <div
                  key={i}
                  className="bg-black/60 border border-red-900/30 rounded-xl p-6 hover:shadow-[0_0_15px_rgba(255,0,0,0.25)] transition"
                >
                  <div className="bg-red-600/20 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                    <Icon className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-gray-400">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 💬 Testimonials */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-red-500 mb-10">What Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Rajesh Kumar', comment: 'Fantastic quality and creativity!', rating: 5 },
              { name: 'Priya Sharma', comment: 'Loved their embroidery detail and speed.', rating: 5 },
              { name: 'Amit Patel', comment: 'Professional and perfect branding partner.', rating: 5 },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-zinc-900/70 border border-red-900/40 rounded-xl p-6 hover:shadow-[0_0_20px_rgba(255,0,0,0.3)] transition"
              >
                <div className="flex justify-center mb-3">
                  {[...Array(t.rating)].map((_, idx) => (
                    <StarIcon key={idx} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 italic mb-3">"{t.comment}"</p>
                <p className="text-red-400 font-semibold">- {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 CTA */}
      <section className="py-20 bg-gradient-to-r from-red-700 to-red-500 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Brand?</h2>
        <p className="text-lg text-red-100 mb-6">Let’s bring your logo and products to life.</p>
        <Link
          to="/contact"
          className="bg-black text-red-400 px-8 py-3 rounded-md font-semibold hover:bg-zinc-900 transition"
        >
          Get Started
          <ArrowRightIcon className="ml-2 h-5 w-5 inline-block" />
        </Link>
      </section>
    </div>
  )
}

export default Home
