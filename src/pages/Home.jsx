import { Link } from 'react-router-dom'
import { ArrowRightIcon, StarIcon } from '@heroicons/react/24/solid'
import { CheckCircleIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import ClientsCarousel from '../components/ClientsCarousel'
import embroideryMachine from "../assets/images/embroideryhero.jpg"

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

  // Brand Colors
  const brandRed = "rgb(255, 69, 0)"        // Orange-Red (your "silly red")
  const brandLight = "rgb(255, 107, 53)"     // Softer orange accent

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section - Light & Bold */}
      <section className="relative overflow-hidden h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50">
        <img
          src={embroideryMachine}
          alt="Embroidery Machine"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-600 via-red-500 to-orange-500 bg-clip-text text-transparent mb-6 leading-tight">
            Custom Embroidery & Branding That Commands Attention
          </h1>
          <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Elevate your brand with bold, precision-crafted embroidery and custom logo design.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              to="/products"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-9 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
              style={{ boxShadow: `0 10px 30px rgba(255,69,0,0.3)` }}
            >
              Browse Products
              <ArrowRightIcon className="ml-3 h-6 w-6" />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white px-9 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center"
            >
              Get Custom Quote
            </Link>
          </div>
          <p className="mt-10 text-gray-600 font-medium">
            Trusted by <span className="text-orange-600 font-bold">500+ brands</span> across India
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 bg-gray-50">
        <div className="w-full px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-4">
              Our Premium Products
            </h2>
            <p className="text-xl text-gray-600">Corporate Gifting • Uniforms • Merchandise</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin h-14 w-14 border-4 border-orange-600 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.slice(0, displayedProducts).map((product) => (
                  <div
                    key={product._id}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-100 
                               transition-all duration-500 hover:-translate-y-3 hover:border-orange-300 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      <img
                        src={product.images?.[0]?.url || 'https://via.placeholder.com/600x600'}
                        alt={product.name}
                        className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      {product.isFeatured && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                          Featured
                        </div>
                      )}
                      <div className="absolute bottom-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg text-lg font-bold">
                        ₹{product.price?.base || product.price || 0}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                          {product.description || "Premium custom embroidery & branding"}
                        </p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">
                            {product.category?.replace(/-/g, ' ') || 'Product'}
                          </span>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon key={i} className={`w-5 h-5 ${i < 4.7 ? 'text-orange-500' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                      </div>

                      <Link
                        to={`/products/${product._id}`}
                        className="mt-6 w-full text-center bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-orange-500/50"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              {products.length > displayedProducts && (
                <div className="text-center mt-16">
                  <button
                    onClick={() => setDisplayedProducts(p => p + 12)}
                    className="border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white font-bold px-12 py-4 rounded-full transition-all duration-400"
                  >
                    Load More Products
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-white">
        <div className="w-full px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-12">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: 'Custom Logo Design', desc: 'Bold, memorable logos that stand out.' },
              { title: 'Precision Embroidery', desc: 'Flawless stitching on any fabric.' },
              { title: 'Brand Merchandise', desc: 'T-shirts, bags, caps & corporate gifts.' },
            ].map((srv, i) => (
              <div key={i} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 hover:shadow-xl transition-shadow border border-orange-200">
                <h3 className="text-2xl font-bold text-orange-600 mb-3">{srv.title}</h3>
                <p className="text-gray-700">{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Carousel */}
      <ClientsCarousel />

      {/* Why Choose Us */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-12">
            Why Brands Trust Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: CheckCircleIcon, title: '100% Custom', desc: 'Every design made just for you.' },
              { icon: TruckIcon, title: 'Express Delivery', desc: 'Fast production & pan-India shipping.' },
              { icon: ShieldCheckIcon, title: 'Quality Assured', desc: 'Free revisions until you love it.' },
            ].map((f, i) => {
              const Icon = f.icon
              return (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100">
                  <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Icon className="h-10 w-10 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{f.title}</h3>
                  <p className="text-gray-600">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="w-full px-4 text-center">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-12">
            Loved by Our Clients
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Rajesh Kumar', role: 'CEO, TechCorp', comment: 'Outstanding quality and super fast delivery!' },
              { name: 'Priya Sharma', role: 'Marketing Head, FashionCo', comment: 'Best embroidery partner we’ve ever had.' },
              { name: 'Amit Patel', role: 'Founder, StartupX', comment: 'They brought our brand to life perfectly.' },
            ].map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-8 border border-orange-100 hover:border-orange-400 transition-all">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-6 w-6 text-orange-500" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-5">"{t.comment}"</p>
                <p className="font-bold text-orange-600">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-orange-500 to-red-600 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to Elevate Your Brand?
          </h2>
          <p className="text-xl text-orange-100 mb-10">
            Let’s create something extraordinary together.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center bg-white text-orange-600 hover:bg-gray-100 px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:shadow-orange-300 transition-all transform hover:scale-105"
          >
            Get Your Free Quote Today
            <ArrowRightIcon className="ml-3 h-6 w-6" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home