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

  // Close dropdown after delay on mouse leave (for better UX)
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
            { name: "Cap", href: "/products?category=apparels&subcategory=cap" },
            { name: "Jackets", href: "/products?category=apparels&subcategory=jackets" },
            { name: "Shirt", href: "/products?category=apparels&subcategory=shirt" },
            { name: "T-Shirt", href: "/products?category=apparels&subcategory=t-shirt" },
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
            { name: "Badge Embroidery", href: "/products?category=embroidery&subcategory=badge-embroidery" },
            { name: "Custom Embroidery", href: "/products?category=embroidery&subcategory=custom-embroidery" },
            { name: "Hand Embroidery", href: "/products?category=embroidery&subcategory=hand-embroidery" },
          ],
        },
        {
          name: "Travels",
          href: "/products?category=travels",
          submenu: [
            { name: "All Travel Items", href: "/products?category=travels" },
            { name: "Hand Bag", href: "/products?category=travels&subcategory=hand-bag" },
            { name: "Strolley Bags", href: "/products?category=travels&subcategory=strolley-bags" },
            { name: "Travel Bags", href: "/products?category=travels&subcategory=travel-bags" },
            { name: "Back Packs", href: "/products?category=travels&subcategory=back-packs" },
            { name: "Laptop Bags", href: "/products?category=travels&subcategory=laptop-bags" },
          ],
        },
        {
          name: "Leather",
          href: "/products?category=leather",
          submenu: [
            { name: "All Leather Items", href: "/products?category=leather" },
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
            { name: "Corporate", href: "/products?category=uniforms&subcategory=corporate" },
          ],
        },
        {
          name: "Design Services",
          href: "/products?category=design-services",
          submenu: [
            { name: "All Design Services", href: "/products?category=design-services" },
            { name: "Logo Design", href: "/products?category=design-services&subcategory=logo-design" },
            { name: "Branding", href: "/products?category=design-services&subcategory=branding" },
            { name: "Print Design", href: "/products?category=design-services&subcategory=print-design" },
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
        { name: "Custom Design Orders", href: "/custom-design-order" },
        { name: "Custom Embroidery Request", href: "/custom-embroidery-request" },
      ],
    },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-300 shadow-[0_2px_10px_rgba(255,69,0,0.2)]">
      <div className="w-full px-4sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-3 group">
            <img
              src={Shreegraphicslogo}
              alt="Shree Graphics Logo"
              className="h-16 sm:h-20 object-contain"
            />
            <div className="hidden sm:flex flex-col text-center">
              <span className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Shree Graphics Design
              </span>
              <span className="text-xs text-orange-600">
                Your Imagination, Our Embroidery Stitches
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.dropdown && handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeave}
              >
                {item.dropdown ? (
                  <button className="flex items-center gap-1 text-gray-700 hover:text-orange-600 font-medium transition-all">
                    {item.name}
                    <ChevronDownIcon
                      className={`h-4 w-4 transition-transform ${
                        openDropdown === item.name ? "rotate-180 text-orange-600" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    onClick={closeMobileMenu}
                    className="text-gray-700 hover:text-orange-600 font-medium transition"
                  >
                    {item.name}
                  </Link>
                )}

                {/* First Level Dropdown */}
                {item.dropdown && openDropdown === item.name && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 mt-4 w-64 bg-white/95 backdrop-blur-md border border-orange-300/40 rounded-lg shadow-2xl shadow-orange-900/20"
                    onMouseEnter={() => clearTimeout(timeoutRef.current)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="py-3">
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
                            className="flex items-center justify-between px-5 py-3 text-gray-700 hover:bg-orange-50 transition"
                          >
                            <span>{sub.name}</span>
                            {sub.submenu && <ChevronRightIcon className="h-4 w-4 text-gray-400" />}
                          </Link>

                          {/* Second Level Submenu */}
                          {sub.submenu && openSubmenu === sub.name && (
                            <div className="absolute left-full top-0 w-56 -ml-1 bg-white/95 backdrop-blur-md border border-orange-300/40 rounded-lg shadow-xl">
                              {sub.submenu.map((ss) => (
                                <Link
                                  key={ss.name}
                                  to={ss.href}
                                  onClick={closeMobileMenu}
                                  className="block px-5 py-3 text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition"
                                >
                                  {ss.name}
                                </Link>
                              ))}
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

          {/* Right Icons & Auth */}
          <div className="flex items-center gap-4">
            <button onClick={toggleCart} className="relative p-2 text-gray-700 hover:text-orange-600 transition">
              <ShoppingCartIcon className="h-6 w-6" />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full animate-pulse">
                  {getCartItemsCount()}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition">
                  <UserIcon className="h-5 w-5" />
                  <span className="hidden sm:block">{user?.name || "User"}</span>
                </button>
                <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md border border-orange-300/40 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl">
                  <div className="py-2 text-gray-700">
                    <Link to="/profile" onClick={closeMobileMenu} className="block px-4 py-2 hover:bg-orange-50">
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        navigate("/profile", { state: { activeTab: "orders" } });
                        closeMobileMenu();
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-orange-50"
                    >
                      Orders
                    </button>
                    {user?.role === "admin" && (
                      <>
                        <div className="border-t border-orange-300/40 my-1"></div>
                        <Link to="/admin" onClick={closeMobileMenu} className="block px-4 py-2 hover:bg-orange-50">
                          Admin Dashboard
                        </Link>
                        <Link to="/clients" onClick={closeMobileMenu} className="block px-4 py-2 hover:bg-orange-50">
                          Clients
                        </Link>
                      </>
                    )}
                    <div className="border-t border-orange-300/40 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-orange-600 hover:bg-orange-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" onClick={closeMobileMenu} className="text-gray-700 hover:text-orange-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 py-2 rounded-md font-semibold hover:from-orange-600 hover:to-red-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button onClick={handleMenuToggle} className="md:hidden text-gray-700 hover:text-orange-600">
              {isMenuOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 border-t border-orange-300/40 py-4">
            {navigation.map((item) => (
              <div key={item.name} className="border-b border-orange-200 last:border-0">
                <div className="flex justify-between items-center px-4 py-3">
                  {item.dropdown ? (
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                      className="flex-1 text-left text-gray-700 font-medium flex justify-between items-center"
                    >
                      {item.name}
                      <ChevronDownIcon
                        className={`h-5 w-5 transition-transform ${
                          openDropdown === item.name ? "rotate-180 text-orange-600" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <Link to={item.href} onClick={closeMobileMenu} className="text-gray-700 font-medium">
                      {item.name}
                    </Link>
                  )}
                </div>

                {item.dropdown && openDropdown === item.name && (
                  <div className="bg-white/80">
                    {item.dropdown.map((sub) => (
                      <div key={sub.name}>
                        {sub.submenu ? (
                          <>
                            <button
                              onClick={() => setOpenSubmenu(openSubmenu === sub.name ? null : sub.name)}
                              className="w-full text-left px-8 py-2 text-sm text-gray-600 flex justify-between items-center hover:text-orange-600"
                            >
                              {sub.name}
                              <ChevronDownIcon
                                className={`h-4 w-4 transition-transform ${
                                  openSubmenu === sub.name ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            {openSubmenu === sub.name && (
                              <div className="pl-12">
                                {sub.submenu.map((ss) => (
                                  <Link
                                    key={ss.name}
                                    to={ss.href}
                                    onClick={closeMobileMenu}
                                    className="block py-2 text-xs text-gray-500 hover:text-orange-600"
                                  >
                                    {ss.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <Link
                            to={sub.href}
                            onClick={closeMobileMenu}
                            className="block px-8 py-2 text-sm text-gray-600 hover:text-orange-600"
                          >
                            {sub.name}
                          </Link>
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
  );
};

export default memo(Navbar);
