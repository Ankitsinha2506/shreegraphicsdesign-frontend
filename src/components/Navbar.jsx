import { useState, useCallback, memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
import Shreegraphicslogo from '../assets/shreegraphicsnavimage.png'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [openSubmenu, setOpenSubmenu] = useState(null)

  const { user, logout, isAuthenticated } = useAuth()
  const { getCartItemsCount, toggleCart } = useCart()
  const navigate = useNavigate()

  const handleLogout = useCallback(async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }, [logout, navigate])

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false)
    setOpenDropdown(null)
    setOpenSubmenu(null)
  }, [])

  const toggleDropdown = name => {
    setOpenDropdown(openDropdown === name ? null : name)
    setOpenSubmenu(null)
  }

  const toggleSubmenu = name => {
    setOpenSubmenu(openSubmenu === name ? null : name)
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
            { name: 'Shirt', href: '/products?category=apparels&subcategory=Shirt' },
            { name: 'T-Shirt', href: '/products?category=apparels&subcategory=denim-shirt' },
            // { name: 'Windcheaters', href: '/products?category=apparels&subcategory=windcheaters' }
            // Shirt
          ]
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
            { name: 'Badge Embroidery', href: '/products?category=embroidery&subcategory=badge-embroidery' }
          ]
        },
        {
          name: 'Travels',
          href: '/products?category=travels',
          submenu: [
            { name: 'All Travel Items', href: '/products?category=travels' },
            { name: 'Hand Bag', href: '/products?category=travels&subcategory=hand-bag' },
            { name: 'Strolley Bags', href: '/products?category=travels&subcategory=strolley-bags' },
            { name: 'Travel Bags', href: '/products?category=travels&subcategory=travel-bags' },
            { name: 'Back Packs', href: '/products?category=travels&subcategory=back-packs' },
            { name: 'Laptop Bags', href: '/products?category=travels&subcategory=laptop-bags' }
          ]
        },
        {
          name: 'Leather',
          href: '/products?category=leather',
          submenu: [
            { name: 'All Leather Items', href: '/products?category=leather' },
            { name: 'Office Bags', href: '/products?category=leather&subcategory=office-bags' },
            { name: 'Wallets', href: '/products?category=leather&subcategory=wallets' }
          ]
        },
        {
          name: 'Uniforms',
          href: '/products?category=uniforms',
          submenu: [
            { name: 'All Uniforms', href: '/products?category=uniforms' },
            { name: 'School Uniforms', href: '/products?category=uniforms&subcategory=school-uniforms' },
            { name: 'Corporate', href: '/products?category=uniforms&subcategory=corporate' }
          ]
        },
        {
          name: 'Design Services',
          href: '/products?category=design-services',
          submenu: [
            { name: 'All Design Services', href: '/products?category=design-services' },
            { name: 'Logo Design', href: '/products?category=design-services&subcategory=logo-design' },
            { name: 'Branding', href: '/products?category=design-services&subcategory=branding' },
            { name: 'Print Design', href: '/products?category=design-services&subcategory=print-design' }
          ]
        }
      ]
    },
    {
      name: 'Services',
      href: '#',
      dropdown: [
        { name: 'Embroidery Services', href: '/embroidery' },
        { name: 'Custom Logo Design', href: '/custom-logo-design' },
        { name: 'Custom Design Orders', href: '/custom-design-order' },
        { name: 'Custom Embroidery Request', href: '/custom-embroidery-request' }
      ]
    },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ]

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src={Shreegraphicslogo}
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


          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map(item =>
              item.dropdown ? (
                <div key={item.name} className="relative group">
                  <Link
                    to={item.href}
                    className="flex items-center text-gray-700 hover:text-primary-600 px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg hover:bg-primary-50"
                  >
                    {item.name}
                    <ChevronDownIcon className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                  </Link>

                  {/* Dropdown */}
                  <div className="absolute left-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="py-2">
                      {item.dropdown.map(subItem =>
                        subItem.submenu ? (
                          <div key={subItem.name} className="relative group/submenu">
                            <Link
                              to={subItem.href}
                              className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary-50 rounded-lg mx-2"
                            >
                              {subItem.name}
                              <ChevronDownIcon className="ml-2 h-4 w-4 rotate-[-90deg] group-hover/submenu:rotate-[-180deg] transition-transform" />
                            </Link>

                            <div className="absolute left-full top-0 ml-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover/submenu:opacity-100 group-hover/submenu:visible transition-all duration-300 transform translate-x-2 group-hover/submenu:translate-x-0 z-50">
                              <div className="py-2">
                                {subItem.submenu.map(subSubItem => (
                                  <Link
                                    key={subSubItem.name}
                                    to={subSubItem.href}
                                    className="block px-4 py-3 text-sm text-gray-600 hover:bg-primary-50 rounded-lg mx-2"
                                  >
                                    {subSubItem.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 rounded-lg mx-2"
                          >
                            {subItem.name}
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:text-primary-600 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300"
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-3 text-gray-700 hover:text-primary-600 rounded-xl"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-xl hover:bg-primary-50">
                  <UserIcon className="h-5 w-5 text-gray-700" />
                  <span className="hidden sm:block text-sm">{user?.name}</span>
                </button>
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="py-2">
                    <Link to="/profile" className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 rounded-lg">Profile</Link>
                    <Link to="/orders" className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 rounded-lg">Orders</Link>
                    {user?.role === 'admin' && (
                      <>
                        <div className="border-t border-gray-100 my-2"></div>
                        <Link to="/admin" className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 rounded-lg">Admin Dashboard</Link>
                        <Link to="/clients" className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 rounded-lg">Clients</Link>
                      </>
                    )}
                    <div className="border-t border-gray-100 my-2"></div>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg">Logout</button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 px-4 py-2 text-sm rounded-lg">Login</Link>
                <Link to="/register" className="bg-primary-600 text-white px-4 py-2 text-sm rounded-lg">Sign Up</Link>
              </>
            )}

            {/* Mobile menu button */}
            <button onClick={handleMenuToggle} className="md:hidden p-3 text-gray-700 hover:bg-primary-50 rounded-xl">
              {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4">
            {navigation.map(item => (
              <div key={item.name}>
                <button
                  onClick={() => item.dropdown ? toggleDropdown(item.name) : handleMenuClose()}
                  className="flex justify-between w-full px-4 py-2 text-base font-semibold text-gray-700 hover:bg-primary-50 rounded-lg"
                >
                  {item.name}
                  {item.dropdown && <ChevronDownIcon className={`h-5 w-5 transform transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />}
                </button>

                {/* Dropdown */}
                {item.dropdown && openDropdown === item.name && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-primary-100 pl-3">
                    {item.dropdown.map(subItem => (
                      <div key={subItem.name}>
                        {!subItem.submenu ? (
                          <Link
                            to={subItem.href}
                            onClick={handleMenuClose} // ✅ close menu when clicking
                            className="block px-3 py-2 text-sm text-gray-600 hover:bg-primary-50 rounded-lg"
                          >
                            {subItem.name}
                          </Link>
                        ) : (
                          <>
                            <button
                              onClick={() => toggleSubmenu(subItem.name)}
                              className="flex justify-between w-full px-3 py-2 text-sm font-medium text-gray-600 hover:bg-primary-50 rounded-lg"
                            >
                              {subItem.name}
                              <ChevronDownIcon className={`h-4 w-4 transform transition-transform ${openSubmenu === subItem.name ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`ml-4 mt-1 space-y-1 border-l border-gray-200 pl-3 ${openSubmenu === subItem.name ? 'block' : 'hidden'}`}>
                              {subItem.submenu.map(subSubItem => (
                                <Link
                                  key={subSubItem.name}
                                  to={subSubItem.href}
                                  onClick={handleMenuClose} // ✅ close menu when clicking
                                  className="block px-3 py-2 text-xs text-gray-500 hover:bg-primary-50 rounded-lg"
                                >
                                  {subSubItem.name}
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </nav>
  )
}

export default memo(Navbar)
