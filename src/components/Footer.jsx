import { Link } from "react-router-dom";
import ShreeGraphicsLogo from "../assets/shreegraphicsfooterimage.png";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 border-t border-red-900/40 shadow-[0_-2px_10px_rgba(255,0,0,0.2)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* logo + about */}
        <div className="md:col-span-2">
          <img
            src={ShreeGraphicsLogo}
            alt="Shree Graphics"
            className="h-20 w-auto mb-4 drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]"
          />
          <p className="text-sm text-gray-400 leading-relaxed max-w-md">
            Your one-stop destination for custom embroidery, logo design, and
            premium branding solutions. Crafted with precision and passion.
          </p>
          <div className="flex gap-4 mt-4 text-gray-400">
            <a href="#" className="hover:text-red-500">Facebook</a>
            <a href="#" className="hover:text-red-500">Instagram</a>
            <a href="#" className="hover:text-red-500">Twitter</a>
          </div>
        </div>

        {/* quick links */}
        <div>
          <h4 className="text-white font-semibold mb-3 border-b border-red-800 pb-1 inline-block">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-red-500">Home</Link></li>
            <li><Link to="/products" className="hover:text-red-500">Products</Link></li>
            <li><Link to="/about" className="hover:text-red-500">About</Link></li>
            <li><Link to="/contact" className="hover:text-red-500">Contact</Link></li>
          </ul>
        </div>

        {/* services */}
        <div>
          <h4 className="text-white font-semibold mb-3 border-b border-red-800 pb-1 inline-block">Services</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/custom-logo-design" className="hover:text-red-500">Custom Logo</Link></li>
            <li><Link to="/embroidery" className="hover:text-red-500">Embroidery</Link></li>
            <li><Link to="/custom-design-order" className="hover:text-red-500">Custom Design</Link></li>
            <li><Link to="/custom-embroidery-request" className="hover:text-red-500">Embroidery Request</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-red-800/40 py-4 flex justify-between items-center text-xs text-gray-500 px-4">
        <div>
          © {new Date().getFullYear()} Shree Graphics Design. All rights reserved.
        </div>
        <div>
          Developed & Maintained by{" "}
          <span className="font-medium text-gray-600">
            Smart Software Services (I) Pvt. Ltd.
          </span>
        </div>
      </div>


    </footer>
  );
};

export default Footer;
