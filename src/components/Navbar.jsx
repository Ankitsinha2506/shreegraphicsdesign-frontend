import { useState, useCallback, memo, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Shreegraphicslogo from "../assets/FooterLogo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemsCount, toggleCart } = useCart();
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [logout, navigate]);

  const handleMenuToggle = () => setIsMenuOpen((prev) => !prev);

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
    setOpenSubmenu(null);
  };

  const handleMouseEnter = (name) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(name);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
      setOpenSubmenu(null);
    }, 200);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    {
      name: "Products",
      href: "/products",
      dropdown: [
        {
          name: "Apparels",
          href: "/products?category=apparels",
          submenu: [
            { name: "All Apparels", href: "/products?category=apparels" },
            { name: "Caps", href: "/products?category=apparels&subcategory=cap" },
            { name: "Jackets", href: "/products?category=apparels&subcategory=jackets" },
            { name: "Shirts", href: "/products?category=apparels&subcategory=shirt" },
            { name: "T-Shirts", href: "/products?category=apparels&subcategory=t-shirt" },
          ],
        },
        {
          name: "Embroidery",
          href: "/products?category=embroidery",
          submenu: [
            { name: "All Embroidery", href: "/products?category=embroidery" },
            { name: "Logo Embroidery", href: "/products?category=embroidery&subcategory=logo-embroidery" },
            { name: "Text Embroidery", href: "/products?category=embroidery&subcategory=text-embroidery" },
            { name: "Patches", href: "/products?category=embroidery&subcategory=custom-patches" },
            { name: "Monogramming", href: "/products?category=embroidery&subcategory=monogramming" },
            { name: "Custom Embroidery", href: "/products?category=embroidery&subcategory=custom-embroidery" },
          ],
        },
        {
          name: "Travel Items",
          href: "/products?category=travels",
          submenu: [
            { name: "All Travel Items", href: "/products?category=travels" },
            { name: "Hand Bags", href: "/products?category=travels&subcategory=hand-bag" },
            { name: "Trolley Bags", href: "/products?category=travels&subcategory=strolley-bags" },
            { name: "Backpacks", href: "/products?category=travels&subcategory=back-packs" },
            { name: "Laptop Bags", href: "/products?category=travels&subcategory=laptop-bags" },
          ],
        },
        {
          name: "Leather",
          href: "/products?category=leather",
          submenu: [
            { name: "All Leather", href: "/products?category=leather" },
            { name: "Office Bags", href: "/products?category=leather&subcategory=office-bags" },
            { name: "Wallets", href: "/products?category=leather&subcategory=wallets" },
          ],
        },
        {
          name: "Uniforms",
          href: "/products?category=uniforms",
          submenu: [
            { name: "All Uniforms", href: "/products?category=uniforms" },
            { name: "School Uniforms", href: "/products?category=uniforms&subcategory=school-uniforms" },
            { name: "Corporate Uniforms", href: "/products?category=uniforms&subcategory=corporate" },
          ],
        },
        {
          name: "Design Services",
          href: "/products?category=design-services",
          submenu: [
            { name: "All Services", href: "/products?category=design-services" },
            { name: "Logo Design", href: "/products?category=design-services&subcategory=logo-design" },
            { name: "Branding", href: "/products?category=design-services&subcategory=branding" },
          ],
        },
      ],
    },
    {
      name: "Services",
      href: "#",
      dropdown: [
        { name: "Embroidery Services", href: "/embroidery" },
        { name: "Custom Logo Design", href: "/custom-logo-design" },
        { name: "Custom Orders", href: "/custom-design-order" },
        { name: "Embroidery Request", href: "/custom-embroidery-request" },
      ],
    },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-orange-200 shadow-lg shadow-orange-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-4 group">
            <img
              src={Shreegraphicslogo}
              alt="Shree Graphics Logo"
              className="h-16 sm:h-20 object-contain drop-shadow-xl group-hover:scale-105 transition-all duration-300"
            />
            <div className="hidden lg:flex flex-col">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent leading-tight">
                Shree Graphics Design
              </span>
              <span className="text-xs text-orange-600 font-medium tracking-wider">
                YOUR IMAGINATION • OUR STITCHES
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.dropdown && handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeave}
              >
                {item.dropdown ? (
                  <button className="flex items-center gap-1.5 text-gray-700 hover:text-orange-600 font-semibold transition-all duration-200">
                    {item.name}
                    <ChevronDownIcon
                      className={`h-4 w-4 transition-transform ${openDropdown === item.name ? "rotate-180 text-orange-600" : ""}`}
                    />
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    onClick={closeMobileMenu}
                    className="text-gray-700 hover:text-orange-600 font-semibold transition-all duration-200"
                  >
                    {item.name}
                  </Link>
                )}

                {/* Dropdown Menu */}
                {item.dropdown && openDropdown === item.name && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 mt-5 w-72 bg-white rounded-2xl shadow-2xl border border-orange-100 overflow-hidden"
                    onMouseEnter={() => clearTimeout(timeoutRef.current)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="p-3">
                      {item.dropdown.map((sub) => (
                        <div
                          key={sub.name}
                          className="relative group/sub"
                          onMouseEnter={() => sub.submenu && setOpenSubmenu(sub.name)}
                          onMouseLeave={() => setOpenSubmenu(null)}
                        >
                          <Link
                            to={sub.href}
                            onClick={closeMobileMenu}
                            className="flex items-center justify-between px-5 py-3.5 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all font-medium"
                          >
                            <span>{sub.name}</span>
                            {sub.submenu && <ChevronRightIcon className="h-4 w-4 text-orange-500" />}
                          </Link>

                          {/* Submenu */}
                          {sub.submenu && openSubmenu === sub.name && (
                            <div className="absolute left-full top-0 w-64 -ml-2 bg-white rounded-xl shadow-xl border border-orange-100">
                              <div className="py-2">
                                {sub.submenu.map((ss) => (
                                  <Link
                                    key={ss.name}
                                    to={ss.href}
                                    onClick={closeMobileMenu}
                                    className="block px-6 py-3 text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-all"
                                  >
                                    {ss.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side - Cart & Auth */}
          <div className="flex items-center gap-5">
            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all duration-200"
            >
              <ShoppingCartIcon className="h-7 w-7" />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  {getCartItemsCount()}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-gray-700 hover:text-orange-600 font-medium transition">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden lg:block">{user?.name?.split(" ")[0] || "User"}</span>
                </button>

                <div className="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl border border-orange-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="p-3">
                    <Link to="/profile" onClick={closeMobileMenu} className="block px-5 py-3 hover:bg-orange-50 rounded-lg text-gray-700 font-medium">
                      My Profile
                    </Link>
                    <button
                      onClick={() => { navigate("/profile", { state: { activeTab: "orders" } }); closeMobileMenu(); }}
                      className="block w-full text-left px-5 py-3 hover:bg-orange-50 rounded-lg text-gray-700 font-medium"
                    >
                      My Orders
                    </button>
                    {user?.role === "admin" && (
                      <>
                        <div className="border-t border-orange-100 my-2"></div>
                        <Link to="/admin" onClick={closeMobileMenu} className="block px-5 py-3 hover:bg-orange-50 rounded-lg text-orange-600 font-bold">
                          Admin Dashboard
                        </Link>
                      </>
                    )}
                    <div className="border-t border-orange-100 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-5 py-3 hover:bg-red-50 text-red-600 rounded-lg font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-orange-600 font-semibold transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-7 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={handleMenuToggle}
              className="md:hidden p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
            >
              {isMenuOpen ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-orange-100 shadow-2xl">
            <div className="px-4 py-6 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                      className="w-full text-left flex items-center justify-between px-4 py-4 text-lg font-semibold text-gray-800 hover:bg-orange-50 rounded-lg transition"
                    >
                      {item.name}
                      <ChevronDownIcon className={`h-6 w-6 transition-transform ${openDropdown === item.name ? "rotate-180 text-orange-600" : ""}`} />
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={closeMobileMenu}
                      className="block px-4 py-4 text-lg font-semibold text-gray-800 hover:bg-orange-50 rounded-lg transition"
                    >
                      {item.name}
                    </Link>
                  )}

                  {item.dropdown && openDropdown === item.name && (
                    <div className="ml-4 mt-2 space-y-1 bg-orange-50/50 rounded-xl p-4">
                      {item.dropdown.map((sub) => (
                        <div key={sub.name}>
                          <Link
                            to={sub.href}
                            onClick={closeMobileMenu}
                            className="block py-3 text-gray-700 hover:text-orange-600 font-medium"
                          >
                            {sub.name}
                          </Link>
                          {sub.submenu && (
                            <div className="ml-6 mt-2 space-y-2 border-l-2 border-orange-300 pl-4">
                              {sub.submenu.map((ss) => (
                                <Link
                                  key={ss.name}
                                  to={ss.href}
                                  onClick={closeMobileMenu}
                                  className="block py-2 text-sm text-gray-600 hover:text-orange-600"
                                >
                                  {ss.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default memo(Navbar);