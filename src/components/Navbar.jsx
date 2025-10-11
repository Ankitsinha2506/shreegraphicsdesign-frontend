import { useState, useCallback, memo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom' // 🟢 UPDATED
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import {
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import Logo from '../assets/shreegraphics.png'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null) // 🟢 NEW (mobile dropdown handling)
  const { user, logout, isAuthenticated } = useAuth()
  const { getCartItemsCount, toggleCart } = useCart()
  const navigate = useNavigate()
  const location = useLocation() // 🟢 NEW (for active link highlighting)

  const handleLogout = useCallback(async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }, [logout, navigate])

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen((prev) => !prev)
  }, [])

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false)
    setOpenDropdown(null) // 🟢 NEW
  }, [])

  const toggleDropdown = (name) => {
    // 🟢 NEW: Mobile dropdown toggle
    setOpenDropdown((prev) => (prev === name ? null : name))
  }

  const navigation = [
    { name: 'Home', href: '/' },
    {
      name: 'Products',
      href: '/products',
      dropdown: [
        {
          name: 'Apparels',
          href: '/products?category=apparels',
          submenu: [
            { name: 'All Apparels', href: '/products?category=apparels' },
            { name: 'Cap', href: '/products?category=apparels&subcategory=cap' },
            { name: 'Jackets', href: '/products?category=apparels&subcategory=jackets' },
            { name: 'Sweatshirt', href: '/products?category=apparels&subcategory=sweatshirt' },
            { name: 'Denim Shirt', href: '/products?category=apparels&subcategory=denim-shirt' },
            { name: 'Windcheaters', href: '/products?category=apparels&subcategory=windcheaters' },
          ],
        },
        {
          name: 'Embroidery',
          href: '/products?category=embroidery',
          submenu: [
            { name: 'All Embroidery', href: '/products?category=embroidery' },
            { name: 'Logo Embroidery', href: '/products?category=embroidery&subcategory=logo-embroidery' },
            { name: 'Text Embroidery', href: '/products?category=embroidery&subcategory=text-embroidery' },
            { name: 'Patches', href: '/products?category=embroidery&subcategory=patches' },
            { name: 'Custom Embroidery', href: '/products?category=embroidery&subcategory=custom-embroidery' },
            { name: 'Monogramming', href: '/products?category=embroidery&subcategory=monogramming' },
            { name: 'Badge Embroidery', href: '/products?category=embroidery&subcategory=badge-embroidery' },
          ],
        },
      ],
    },
    {
      name: 'Services',
      href: '#',
      dropdown: [
        { name: 'Embroidery Services', href: '/embroidery' },
        { name: 'Custom Logo Design', href: '/custom-logo-design' },
        { name: 'Custom Design Orders', href: '/custom-design-order' },
      ],
    },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
      {/* 🔵 NEW Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm md:hidden z-40"
          onClick={handleMenuClose}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-50">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src={Logo}
              alt="Shree Graphics Logo"
              className="h-12 sm:h-14 w-auto object-contain transition-all duration-300 hover:scale-105" // 🟢 UPDATED
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                Graphics Design
              </span>
              <span className="text-[10px] sm:text-xs text-gray-500 font-medium tracking-wide">
                Your Imagination, Our Embroidery Stitches.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) =>
              item.dropdown ? (
                <div key={item.name} className="relative group">
                  <button
                    className={`flex items-center text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-primary-50 transition-all ${
                      location.pathname === item.href ? 'text-primary-700' : ''
                    }`} // 🟢 UPDATED
                  >
                    {item.name}
                    <ChevronDownIcon className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                  </button>
                  <div className="absolute left-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="py-2">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-all"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-primary-50 transition-all ${
                    location.pathname === item.href ? 'text-primary-700' : ''
                  }`} // 🟢 UPDATED
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-3 text-gray-700 hover:text-primary-600 rounded-xl hover:bg-primary-50 transition-all"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {getCartItemsCount()}
                </span>
              )}
            </button>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary-50">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <span className="hidden sm:block text-sm font-semibold text-gray-700">
                    {user?.name}
                  </span>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="py-2">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-primary-50">
                      👤 Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 hover:bg-primary-50">
                      📦 Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-5 py-2 rounded-lg shadow hover:scale-105 transition-all"
              >
                Login
              </Link>
            )}

            {/* Mobile Button */}
            <button
              onClick={handleMenuToggle}
              className="md:hidden p-3 rounded-lg hover:bg-primary-50"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6 text-gray-700" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* 🔵 Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-500 overflow-hidden ${
            isMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white rounded-xl shadow-xl mt-2 p-4 space-y-2">
            {navigation.map((item) => (
              <div key={item.name}>
                <button
                  onClick={() => (item.dropdown ? toggleDropdown(item.name) : handleMenuClose())}
                  className="w-full text-left flex justify-between items-center px-3 py-2 font-semibold text-gray-700 hover:bg-primary-50 rounded-lg"
                >
                  {item.name}
                  {item.dropdown && (
                    <ChevronDownIcon
                      className={`h-4 w-4 transform transition-transform duration-300 ${
                        openDropdown === item.name ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {item.dropdown && openDropdown === item.name && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.href}
                        onClick={handleMenuClose}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default memo(Navbar)
