import { useState, useCallback, memo } from "react";
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
import Shreegraphicslogo from "../assets/shreegraphicsfooterimage.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemsCount, toggleCart } = useCart();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [logout, navigate]);

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleNavClick = useCallback(() => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
    setOpenSubmenu(null);
  }, []);

  const toggleDropdown = (name) =>
    setOpenDropdown(openDropdown === name ? null : name);
  const toggleSubmenu = (name) =>
    setOpenSubmenu(openSubmenu === name ? null : name);

  // Your existing full navigation tree
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
            { name: "Shirt", href: "/products?category=apparels&subcategory=Shirt" },
            { name: "T-Shirt", href: "/products?category=apparels&subcategory=denim-shirt" },
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
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-red-800 shadow-[0_2px_10px_rgba(255,30,86,0.2)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* main row */}
        <div className="flex items-center justify-between py-3">
          {/* logo */}
          <Link
            to="/"
            onClick={handleNavClick}
            className="flex items-center gap-3 group"
          >
            <img
              src={Shreegraphicslogo}
              alt="Shree Graphics Logo"
              className="h-16 sm:h-20 object-contain drop-shadow-[0_0_10px_rgba(255,0,0,0.6)] group-hover:scale-105 transition-transform"
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Shree Graphics Design
              </span>
              <span className="text-xs text-gray-400">
                Your Imagination, Our Embroidery Stitches
              </span>
            </div>
          </Link>

          {/* desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) =>
              item.dropdown ? (
                <div key={item.name} className="relative group">
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="flex items-center text-gray-300 hover:text-red-500 font-medium transition-all duration-300"
                  >
                    {item.name}
                    <ChevronDownIcon
                      className={`ml-1 h-4 w-4 transition-transform ${
                        openDropdown === item.name ? "rotate-180 text-red-500" : ""
                      }`}
                    />
                  </button>

                  {openDropdown === item.name && (
                    <div className="absolute left-0 mt-3 w-56 bg-black text-gray-200 rounded-lg border border-red-800/40 shadow-[0_0_20px_rgba(255,0,0,0.3)]">
                      <div className="py-2">
                        {item.dropdown.map((sub) =>
                          sub.submenu ? (
                            <div
                              key={sub.name}
                              className="relative group/sub"
                            >
                              <Link
                                to={sub.href}
                                onClick={handleNavClick}
                                className="flex justify-between items-center px-4 py-2 hover:bg-red-900/30 rounded-md"
                              >
                                {sub.name}
                                <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover/sub:text-red-500" />
                              </Link>
                              <div className="absolute left-full top-0 ml-2 w-52 bg-black border border-red-800/30 rounded-lg opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all">
                                {sub.submenu.map((ss) => (
                                  <Link
                                    key={ss.name}
                                    to={ss.href}
                                    onClick={handleNavClick}
                                    className="block px-4 py-2 hover:bg-red-900/40 rounded-md"
                                  >
                                    {ss.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <Link
                              key={sub.name}
                              to={sub.href}
                              onClick={handleNavClick}
                              className="block px-4 py-2 hover:bg-red-900/30 rounded-md"
                            >
                              {sub.name}
                            </Link>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={handleNavClick}
                  className="text-gray-300 hover:text-red-500 font-medium transition"
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* right */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-300 hover:text-red-500"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                  {getCartItemsCount()}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-gray-300 hover:text-red-500">
                  <UserIcon className="h-5 w-5" />
                  <span className="hidden sm:block">{user?.name}</span>
                </button>
                <div className="absolute right-0 mt-3 w-56 bg-black border border-red-800/40 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-[0_0_15px_rgba(255,0,0,0.3)]">
                  <div className="py-2 text-gray-300">
                    <Link
                      to="/profile"
                      onClick={handleNavClick}
                      className="block px-4 py-2 hover:bg-red-900/30"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        navigate("/profile", { state: { activeTab: "orders" } });
                        handleNavClick();
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-red-900/30"
                    >
                      Orders
                    </button>
                    {user?.role === "admin" && (
                      <>
                        <div className="border-t border-red-900/40 my-1"></div>
                        <Link to="/admin" className="block px-4 py-2 hover:bg-red-900/30">Admin Dashboard</Link>
                        <Link to="/clients" className="block px-4 py-2 hover:bg-red-900/30">Clients</Link>
                      </>
                    )}
                    <div className="border-t border-red-900/40 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-900/30"
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
                  className="text-gray-300 hover:text-red-500"
                  onClick={handleNavClick}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-500 transition"
                  onClick={handleNavClick}
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* mobile toggle */}
            <button
              onClick={handleMenuToggle}
              className="md:hidden text-gray-300 hover:text-red-500"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black text-gray-300 border-t border-red-900/40 p-4 rounded-b-lg">
            {navigation.map((item) => (
              <div key={item.name}>
                <button
                  onClick={() =>
                    item.dropdown ? toggleDropdown(item.name) : handleNavClick()
                  }
                  className="flex justify-between w-full py-2 text-left font-semibold hover:text-red-500"
                >
                  {item.name}
                  {item.dropdown && (
                    <ChevronDownIcon
                      className={`h-5 w-5 transition-transform ${
                        openDropdown === item.name ? "rotate-180 text-red-500" : ""
                      }`}
                    />
                  )}
                </button>
                {item.dropdown && openDropdown === item.name && (
                  <div className="ml-4 border-l border-red-800/50 pl-3">
                    {item.dropdown.map((sub) => (
                      <div key={sub.name}>
                        {!sub.submenu ? (
                          <Link
                            to={sub.href}
                            onClick={handleNavClick}
                            className="block py-1 text-sm hover:text-red-500"
                          >
                            {sub.name}
                          </Link>
                        ) : (
                          <>
                            <button
                              onClick={() => toggleSubmenu(sub.name)}
                              className="flex justify-between w-full py-1 text-sm hover:text-red-500"
                            >
                              {sub.name}
                              <ChevronDownIcon
                                className={`h-4 w-4 transition-transform ${
                                  openSubmenu === sub.name ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            {openSubmenu === sub.name && (
                              <div className="ml-3 border-l border-red-900/40 pl-3">
                                {sub.submenu.map((ss) => (
                                  <Link
                                    key={ss.name}
                                    to={ss.href}
                                    onClick={handleNavClick}
                                    className="block py-1 text-xs hover:text-red-400"
                                  >
                                    {ss.name}
                                  </Link>
                                ))}
                              </div>
                            )}
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
  );
};

export default memo(Navbar);
