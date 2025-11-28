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
      <div className="w-full px-4 lg:px-12 py-14">

        {/* GRID FIXED – Reduced gaps and aligned columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 lg:gap-x-10">

          {/* About + Logo */}
          <div className="lg:col-span-1 text-center">
            <img
              src={ShreeGraphicsLogo}
              alt="Shree Graphics Design"
              className="h-[130px] mx-auto drop-shadow-2xl"
            />

            <h3 className="text-2xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mt-3">
              Shree Graphics Design
            </h3>

            <p className="text-[11px] text-orange-600 font-bold tracking-widest mt-1">
              Your Imagination, Our Embroidery Stitches
            </p>

            <p className="text-gray-600 text-sm leading-relaxed mt-5 max-w-xs lg:max-w-sm mx-auto">
              Premium custom embroidery, logo design<br />& corporate branding solutions since 2015. Trusted by 500+ brands across India.
            </p>

            <div className="flex gap-5 mt-7 justify-center">
              <a className="w-11 h-11 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white hover:scale-110 transition">
                <Facebook className="h-6 w-6 text-orange-600" />
              </a>
              <a className="w-11 h-11 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white hover:scale-110 transition">
                <Instagram className="h-6 w-6 text-orange-600" />
              </a>
              <a className="w-11 h-11 bg-orange-100 rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white hover:scale-110 transition">
                <MessageCircle className="h-6 w-6 text-orange-600" />
              </a>
              <a className="w-11 h-11 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white hover:scale-110 transition">
                <Mail className="h-6 w-6 text-orange-600" />
              </a>
            </div>
          </div>


          {/* QUICK LINKS */}
          <div>
            {/* <h4 className="text-xl font-bold text-gray-800 mb-6 relative inline-block after:absolute after:left-0 after:-bottom-2 after:w-16 after:h-1 after:bg-gradient-to-r from-orange-500 to-red-600"></h4> */}
            <h4 className="text-xl font-bold text-gray-800 mb-6 relative inline-block after:absolute after:left-0 after:-bottom-2 after:w-16 after:h-1 after:bg-gradient-to-r after:from-orange-500 after:to-red-600">
              Quick Links
            </h4>
            <ul className="space-y-4 text-gray-600 font-medium">
              <li><Link to="/" className="hover:text-orange-600 transition">Home</Link></li>
              <li><Link to="/products" className="hover:text-orange-600 transition">All Products</Link></li>
              <li><Link to="/about" className="hover:text-orange-600 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-orange-600 transition">Contact</Link></li>
            </ul>
          </div>

          {/* SERVICES */}
          <div>
            <h4 className="text-xl font-bold text-gray-800 mb-6 relative inline-block after:absolute after:left-0 after:-bottom-2 after:w-16 after:h-1 after:bg-gradient-to-r after:from-orange-500 after:to-red-600">
              Our Services
            </h4>
            <ul className="space-y-4 text-gray-600 font-medium">
              <li><Link to="/custom-logo-design" className="hover:text-orange-600 transition">Custom Logo Design</Link></li>
              <li><Link to="/embroidery" className="hover:text-orange-600 transition">Embroidery Services</Link></li>
              <li><Link to="/custom-design-order" className="hover:text-orange-600 transition">Bulk Custom Orders</Link></li>
              <li><Link to="/custom-embroidery-request" className="hover:text-orange-600 transition">Free Design Consultation</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-xl font-bold text-gray-800 mb-6 relative inline-block after:absolute after:left-0 after:-bottom-2 after:w-16 after:h-1 after:bg-gradient-to-r after:from-orange-500 after:to-red-600">
              Get in Touch
            </h4>

            <div className="space-y-6 text-gray-600">

              {/* Phone */}
              <div className="flex items-start gap-4">
                <Phone className="h-5 w-5 text-orange-600 mt-1" />
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
                <Mail className="h-5 w-5 text-orange-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">Email Us</p>
                  <a href="mailto:info@shreegraphics.com" className="text-orange-600 hover:underline">
                    info@shreegraphics.com
                  </a>
                  <br />
                  <a href="mailto:support@shreegraphics.com" className="text-orange-600 hover:underline">
                    support@shreegraphics.com
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-orange-600 mt-1" />
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
        <div className="mt-14 pt-8 border-t-2 border-orange-200 text-center md:flex md:justify-between md:items-center text-gray-600 text-sm">
          <p>
            © {currentYear} <span className="font-bold text-orange-600">Shree Graphics Design</span>. All Rights Reserved.
          </p>
          <p className="mt-4 md:mt-0">
            Design & Developed by{" "}
            <span className="font-bold text-gray-800">
              Smart Software Services (I) Pvt. Ltd.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
