import { Link } from "react-router-dom";
import ShreeGraphicsLogo from "../assets/FooterLogo.png";
import {
  Facebook,
  Instagram,
  MessageCircle,   // ← This is the WhatsApp icon in lucide-react
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-t from-gray-50 to-white border-t-4 border-orange-500 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Logo + About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={ShreeGraphicsLogo}
                alt="Shree Graphics Design"
                className="h-20 w-auto drop-shadow-2xl"
              />
            </div>
            <h3 className="text-2xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Shree Graphics
            </h3>
            <p className="text-xs text-orange-600 font-bold tracking-widest mt-1">
              YOUR IMAGINATION • OUR STITCHES
            </p>

            <p className="text-gray-600 text-sm leading-relaxed mt-5 max-w-xs">
              Premium custom embroidery, logo design & corporate branding solutions since 2015.
              Trusted by 500+ brands across India.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all group"
              >
                <Facebook className="h-5 w-5 text-orange-600 group-hover:text-white" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all group"
              >
                <Instagram className="h-5 w-5 text-orange-600 group-hover:text-white" />
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-orange-100 rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white transition-all group"
              >
                <MessageCircle className="h-5 w-5 text-orange-600 group-hover:text-white" />
              </a>
              <a
                href="mailto:hello@shreegraphics.in"
                className="w-11 h-11 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all group"
              >
                <Mail className="h-5 w-5 text-orange-600 group-hover:text-white" />
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

          {/* Contact Info */}
          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold text-gray-800 mb-6 relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-16 after:h-1 after:bg-gradient-to-r after:from-orange-500 after:to-red-600 after:rounded-full">
              Get in Touch
            </h4>

            <div className="space-y-6 text-gray-600">

              {/* PHONE NUMBERS */}
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">Call / WhatsApp</p>
                  <p className="text-orange-600 font-bold">+91 88888 30696</p>
                  <p className="text-orange-600 font-bold">+91 87654 32109</p>
                  <p className="text-xs text-gray-500">Instant response on WhatsApp</p>
                </div>
              </div>

              {/* EMAIL */}
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">Email Us</p>
                  <p className="text-orange-600">info@shreegraphics.com</p>
                  <p className="text-orange-600">support@shreegraphics.com</p>
                  <p className="text-xs text-gray-500">We reply within 24 hours</p>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-orange-600 mt-0.5" />
                <p className="text-sm leading-relaxed">
                  Mountain View Society, Radhyeswari Nagari,<br />
                  Bakori Road, Wagholi, Pune – 412207<br />
                  India
                </p>
              </div>

              {/* BUSINESS HOURS */}
              {/* <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">Business Hours</p>
                  <p className="text-orange-600">Mon–Fri: 9:00 AM – 6:00 PM</p>
                  <p className="text-orange-600">Saturday: 10:00 AM – 4:00 PM</p>
                </div>
              </div> */}

            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-10 border-t-2 border-orange-200 flex flex-col md:flex-row justify-between items-center text-center text-gray-600">
          <p className="text-sm">
            © {currentYear} <span className="font-bold text-orange-600">Shree Graphics Design</span>. All Rights Reserved.
          </p>
          <p className="text-sm mt-4 md:mt-0">
            Crafted with <span className="text-orange-600 text-xl">Heart</span> in India by{" "}
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