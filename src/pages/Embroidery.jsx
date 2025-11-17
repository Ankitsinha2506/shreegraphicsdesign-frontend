import React from "react";
import { Link } from "react-router-dom";

const Embroidery = () => {
  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-700 to-black rounded-full shadow-[0_0_15px_rgba(255,0,0,0.5)] mb-6">
            <span className="text-3xl">🧵</span>
          </div>
          <h1 className="text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
              Professional Embroidery
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Transform your apparel and accessories with premium embroidery work.
            From corporate logos to personalized designs, we deliver with precision and style.
          </p>
        </div>

        {/* Process Section */}
        <section className="bg-zinc-900/60 backdrop-blur-md rounded-2xl shadow-[0_0_30px_rgba(255,0,0,0.15)] p-10 mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center text-red-500">Our Embroidery Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              ['🔄', 'Convert Your Logo', 'Professional digitization for embroidery machines.'],
              ['🧵', 'Choose Stitch Styles', 'Select optimal stitch types for durability and beauty.'],
              ['🎨', 'Match Brand Colors', 'We match threads to your brand identity.'],
              ['🧪', 'Test Sample', 'We ensure perfection before production.'],
              ['✨', 'Final Embroidery', 'Delivered with accuracy and elegance.']
            ].map(([emoji, title, desc], i) => (
              <div
                key={i}
                className="bg-black/70 border border-red-900/40 rounded-xl p-6 text-center hover:-translate-y-2 transition-all hover:shadow-[0_0_20px_rgba(255,0,0,0.3)]"
              >
                <div className="text-3xl mb-4">{emoji}</div>
                <h3 className="font-semibold text-red-400 text-lg mb-2">{title}</h3>
                <p className="text-gray-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-10 text-red-500">Our Embroidery Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              ['🧵', 'Logo Embroidery', 'Professional logo embroidery for apparel and uniforms.'],
              ['✂️', 'Custom Patches', 'Embroidered patches for branding and identity.'],
              ['🎨', 'Custom Designs', 'Unique embroidery concepts made to order.'],
              ['⚡', 'Quick Turnaround', 'Fast delivery without compromising quality.']
            ].map(([emoji, title, desc], i) => (
              <div
                key={i}
                className="bg-zinc-900 border border-red-900/40 rounded-2xl p-6 text-center shadow-[0_0_15px_rgba(255,0,0,0.15)] hover:shadow-[0_0_25px_rgba(255,0,0,0.3)] hover:-translate-y-2 transition-all"
              >
                <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  {emoji}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call To Action */}
        <div className="mt-16 bg-gradient-to-r from-red-700 to-black rounded-2xl p-10 text-center text-white shadow-[0_0_30px_rgba(255,0,0,0.3)]">
          <h2 className="text-3xl font-bold mb-4">Need Custom Embroidery?</h2>
          <p className="text-gray-300 mb-6">
            Have something special in mind? Let’s create your perfect embroidered design today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Contact Us
            </Link>

            <Link
              to="/custom-design-order"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition"
            >
              Order Custom Design
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Embroidery;
