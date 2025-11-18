import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Shreegraphicsdesignlogo from "../assets/images/shreegraphics.png";
import QMSLogo from "../assets/images/QMS.png";
import NewageLogo from "../assets/images/Newage.png";
import NexusLogo from "../assets/images/Nexus.png";
import NimbjaLogo from "../assets/images/Nimbja.png";
import SmartMatrixLogo from "../assets/images/SmartMatrix.png";
import SmartSoftwareServicesLogo from "../assets/images/SmartSoftwareServices.png";
import Client1 from "../assets/images/generated-image.png";

// ✅ Client logos
const clientLogos = [
  { src: Shreegraphicsdesignlogo, alt: "Shree Graphics Design" },
  { src: QMSLogo, alt: "QMS" },
  { src: Client1, alt: "Client 1" },
  { src: NewageLogo, alt: "Newage" },
  { src: NexusLogo, alt: "Nexus" },
  { src: NimbjaLogo, alt: "Nimbja" },
  { src: SmartMatrixLogo, alt: "Smart Matrix" },
  { src: SmartSoftwareServicesLogo, alt: "Smart Software Services" },
];

const ClientsCarousel = () => {
  const settings = {
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    speed: 1000,
    cssEase: "linear",
    arrows: false,
    dots: false,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 640, settings: { slidesToShow: 2 } },
      { breakpoint: 400, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="py-20 bg-transparent">
      <div className="w-full px-4 sm:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 mb-3">
            Our Happy Clients
          </h2>
          <p className="text-gray-600 text-lg">
            Trusted by leading brands around the world
          </p>
        </div>

        {/* Carousel */}
        <Slider {...settings}>
          {clientLogos.map((logo, idx) => (
            <div key={idx} className="flex items-center justify-center px-6">
              <div className="group relative transition-all">
                {/* Subtle red glow on hover */}
                <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 blur-xl rounded-full transition-all duration-500"></div>

                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-20 w-auto object-contain mx-auto group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.4)]"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default ClientsCarousel;
