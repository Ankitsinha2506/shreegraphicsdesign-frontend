import { Link } from "react-router-dom";
import ShreeGraphicsLogo from "../assets/FooterLogo.png";
import {
  Facebook,
  Instagram,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-t from-gray-50 to-white border-t-4 border-orange-500 shadow-2xl">
      <div className="w-full py-16 px-4 lg:px-12">
        {/* Max Width Container + Perfect Grid (Option 1) */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">

          {/* About + Logo – Wider & Left Aligned on Large Screens */}
          <div className="lg:col-span-4 text-center lg:text-left">
            <img
              src={ShreeGraphicsLogo}
              alt="Shree Graphics Design"
              className="h-[130px] mx-auto lg:mx-0 drop-shadow-2xl"
            />

            <h3 className="text-2xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mt-4">
              Shree Graphics Design
            </h3>

            <p className="text-[11px] text-orange-600 font-bold tracking-widest mt-1">
              Your Imagination, Our Embroidery Stitches
            </p>

            <p className="text-gray-600 text-sm leading-relaxed mt-6 max-w-xs mx-auto lg:max-w-none lg:mx-0">
              Premium custom embroidery, logo design & corporate branding solutions since 2015. Trusted by 500+ brands across India.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-8 justify-center lg:justify-start">
              <a
                href="#"
                className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white hover:scale-110 transition-all duration-300 shadow-md"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6 text-orange-600" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white hover:scale-110 transition-all duration-300 shadow-md"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6 text-orange-600" />
              </a>
              <a
                href="https://wa.me/918888830696"
                className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white hover:scale-110 transition-all duration-300 shadow-md"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-6 w-6 text-orange-600" />
              </a>
              <a
                href="mailto:info@shreegraphics.com"
                className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white hover:scale-110 transition-all duration-300 shadow-md"
                aria-label="Email"
              >
                <Mail className="h-6 w-6 text-orange-600" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xl font-bold text-gray-800 mb-7 relative inline-block after:absolute after:left-0 after:-bottom-2 after:w-16 after:h-1 after:bg-gradient-to-r after:from-orange-500 after:to-red-600">
              Quick Links
            </h4>
            <ul className="space-y-4 text-gray-600 font-medium text-sm lg:text-base">
              <li><Link to="/" className="hover:text-orange-600 transition">Home</Link></li>
              <li><Link to="/products" className="hover:text-orange-600 transition">All Products</Link></li>
              <li><Link to="/about" className="hover:text-orange-600 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-orange-600 transition">Contact</Link></li>
            </ul>
          </div>

          {/* Our Services */}
          <div className="lg:col-span-3">
            <h4 className="text-xl font-bold text-gray-800 mb-7 relative inline-block after:absolute after:left-0 after:-bottom-2 after:w-16 after:h-1 after:bg-gradient-to-r after:from-orange-500 after:to-red-600">
              Our Services
            </h4>
            <ul className="space-y-4 text-gray-600 font-medium text-sm lg:text-base">
              <li><Link to="/custom-logo-design" className="hover:text-orange-600 transition">Custom Logo Design</Link></li>
              <li><Link to="/embroidery" className="hover:text-orange-600 transition">Embroidery Services</Link></li>
              <li><Link to="/custom-design-order" className="hover:text-orange-600 transition">Bulk Custom Orders</Link></li>
              <li><Link to="/custom-embroidery-request" className="hover:text-orange-600 transition">Free Design Consultation</Link></li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div className="lg:col-span-3">
            <h4 className="text-xl font-bold text-gray-800 mb-7 relative inline-block after:absolute after:left-0 after:-bottom-2 after:w-16 after:h-1 after:bg-gradient-to-r after:from-orange-500 after:to-red-600">
              Get in Touch
            </h4>

            <div className="space-y-7 text-gray-600 text-sm lg:text-base">

              {/* Phone */}
              <div className="flex items-start gap-4">
                <Phone className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Call / WhatsApp</p>
                  <a href="tel:+918888830696" className="text-orange-600 font-bold block hover:underline">
                    +91 88888 30696
                  </a>
                  <a href="tel:+918765432109" className="text-orange-600 font-bold block hover:underline">
                    +91 87654 32109
                  </a>
                  <p className="text-xs text-gray-500 mt-1">Instant response on WhatsApp</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <Mail className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Email Us</p>
                  <a href="mailto:info@shreegraphics.com" className="text-orange-600 hover:underline block">
                    info@shreegraphics.com
                  </a>
                  <a href="mailto:support@shreegraphics.com" className="text-orange-600 hover:underline block">
                    support@shreegraphics.com
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                <p className="text-sm leading-relaxed">
                  First Floor, Survey No. 21, Ganesham Commercial-A,<br />
                  Office No. 102-A, Aundh - Ravet BRTS Rd,<br />
                  Pimple Saudagar, Pune, Maharashtra 411027
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200 max-w-7xl mx-auto">
          <div className="text-center md:flex md:justify-between md:items-center text-gray-600 text-sm">
            <p>
              © {currentYear} <span className="font-bold text-orange-600">Shree Graphics Design</span>. All Rights Reserved.
            </p>
            <p className="mt-3 md:mt-0">
              Designed & Developed by{" "}
              <span className="font-bold text-gray-800">
                Smart Software Services (I) Pvt. Ltd.
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;