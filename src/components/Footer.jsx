import { Link } from "react-router-dom";
import ShreeGraphicsLogo from "../assets/FooterLogo.png";
import {
  Facebook,
  Instagram,
  MessageCircle, // WhatsApp icon
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-t from-gray-50 to-white border-t-4 border-orange-500 shadow-2xl">
      <div className="w-full px-4 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Logo + About */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-center gap-4 mb-6">
              <img
                src={ShreeGraphicsLogo}
                alt="Shree Graphics Design"
                className="h-20 w-auto drop-shadow-2xl"
              />
            </div>
            <h3 className="text-2xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent text-center">
              Shree Graphics Design
            </h3>
            <p className="text-xs text-orange-600 font-bold tracking-widest mt-1 text-center">
              YOUR IMAGINATION • OUR STITCHES
            </p>

            <p className="text-gray-600 text-sm leading-relaxed mt-5 max-w-xs text-center mx-auto">
              Premium custom embroidery, logo design & corporate branding solutions since 2015.
              Trusted by 500+ brands across India.
            </p>

            {/* Social Icons - Fully Fixed & Accessible */}
            <div className="flex gap-5 mt-8 justify-center">
              <a
                href="https://facebook.com/shreegraphics"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white hover:scale-110 hover:shadow-xl transition-all duration-300 group"
              >
                <Facebook className="h-6 w-6 text-orange-600 group-hover:text-white transition-colors" />
              </a>

              <a
                href="https://instagram.com/shreegraphics"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white hover:scale-110 hover:shadow-xl transition-all duration-300 group"
              >
                <Instagram className="h-6 w-6 text-orange-600 group-hover:text-white transition-colors" />
              </a>

              <a
                href="https://wa.me/918888830696"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
                className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white hover:scale-110 hover:shadow-xl transition-all duration-300 group"
              >
                <MessageCircle className="h-6 w-6 text-orange-600 group-hover:text-white transition-colors" />
              </a>

              <a
                href="mailto:info@shreegraphics.com"
                aria-label="Send us an Email"
                className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white hover:scale-110 hover:shadow-xl transition-all duration-300 group"
              >
                <Mail className="h-6 w-6 text-orange-600 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold text-gray-800 mb-6 relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-16 after:h-1 after:bg-gradient-to-r after:from-orange-500 after:to-red-600 after:rounded-full">
              Quick Links
            </h4>
            <ul className="space-y-4 text-gray-600 font-medium">
              <li><Link to="/" className="hover:text-orange-600 transition flex items-center gap-2">Home</Link></li>
              <li><Link to="/products" className="hover:text-orange-600 transition flex items-center gap-2">All Products</Link></li>
              <li><Link to="/about" className="hover:text-orange-600 transition flex items-center gap-2">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-orange-600 transition flex items-center gap-2">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-bold text-gray-800 mb-6 relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-16 after:h-1 after:bg-gradient-to-r after:from-orange-500 after:to-red-600 after:rounded-full">
              Our Services
            </h4>
            <ul className="space-y-4 text-gray-600 font-medium">
              <li><Link to="/custom-logo-design" className="hover:text-orange-600 transition">Custom Logo Design</Link></li>
              <li><Link to="/embroidery" className="hover:text-orange-600 transition">Embroidery Services</Link></li>
              <li><Link to="/custom-design-order" className="hover:text-orange-600 transition">Bulk Custom Orders</Link></li>
              <li><Link to="/custom-embroidery-request" className="hover:text-orange-600 transition">Free Design Consultation</Link></li>
            </ul>
          </div>

          {/* Contact Info - Clickable Phone & Email */}
          <div>
            <h4 className="text-xl font-bold text-gray-800 mb-6 relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-16 after:h-1 after:bg-gradient-to-r after:from-orange-500 after:to-red-600 after:rounded-full">
              Get in Touch
            </h4>

            <div className="space-y-7 text-gray-600">

              {/* PHONE NUMBERS */}
              <div className="flex items-start gap-4">
                <Phone className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Call / WhatsApp</p>
                  <a href="tel:+918888830696" className="block text-orange-600 font-bold hover:underline">
                    +91 88888 30696
                  </a>
                  <a href="tel:+918765432109" className="block text-orange-600 font-bold hover:underline">
                    +91 87654 32109
                  </a>
                  <p className="text-xs text-gray-500 mt-1">Instant response on WhatsApp</p>
                </div>
              </div>

              {/* EMAIL */}
              <div className="flex items-start gap-4">
                <Mail className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Email Us</p>
                  <a href="mailto:info@shreegraphics.com" className="text-orange-600 hover:underline">
                    info@shreegraphics.com
                  </a>
                  <br />
                  <a href="mailto:support@shreegraphics.com" className="text-orange-600 hover:underline">
                    support@shreegraphics.com
                  </a>
                  <p className="text-xs text-gray-500 mt-1">We reply within 24 hours</p>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                <p className="text-sm leading-relaxed">
                  First Floor, Survey No. 21, Ganesham Commercial -A,<br />
                  Office No. 102-A, Aundh - Ravet BRTS Rd, Pimple Saudagar,<br />
                   Pune, Maharashtra 411027
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-10 border-t-2 border-orange-200 flex flex-col md:flex-row justify-between items-center text-center text-gray-600 text-sm">
          <p>
            © {currentYear} <span className="font-bold text-orange-600">Shree Graphics Design</span>. All Rights Reserved.
          </p>
          <p className="mt-4 md:mt-0">
             Design and Developed by{" "}
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