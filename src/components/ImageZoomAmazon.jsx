import React, { useState, useRef, useEffect } from "react";

const ImageZoomAmazon = ({
  src,
  width = 400,
  height = 400,
  zoom = 3,
  zoomWidth = 800,
  zoomHeight = 800
}) => {
  const [showZoom, setShowZoom] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const imgRef = useRef(null);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });
  };

  // Adjust zoom overlay size for mobile
  const isMobile = windowWidth < 768;
  const overlayWidth = isMobile ? width * 1.2 : zoomWidth;
  const overlayHeight = isMobile ? height * 1.2 : zoomHeight;
  const overlayLeft = isMobile ? "50%" : "70%"; // center on mobile

  return (
    <div className="relative" style={{ width, height }}>
      {/* Main Image */}
      <img
        ref={imgRef}
        src={src}
        alt="Product"
        className="w-full h-full object-contain rounded-lg border"
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
        onMouseMove={handleMouseMove}
      />

      {/* Zoom Overlay */}
      {showZoom && (
        <div
          className="fixed z-50 flex items-start justify-center"
          style={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: isMobile ? "rgba(0,0,0,0.4)" : "transparent",
            pointerEvents: "auto",
            paddingTop: isMobile ? "3rem" : 0, // give space for close button
            boxSizing: "border-box"
          }}
        >
          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={() => setShowZoom(false)}
              className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md text-gray-700 hover:bg-gray-100"
            >
              &#10005; {/* × character */}
            </button>
          )}

          {/* Zoom overlay */}
          <div
            className="rounded-lg border border-gray-300"
            style={{
              width: overlayWidth,
              height: overlayHeight,
              backgroundImage: `url(${src})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${width * zoom}px ${height * zoom}px`,
              backgroundPosition: `-${(coords.x / 100) * width * (zoom - 1)}px -${(coords.y / 100) * height * (zoom - 1)}px`,
              zIndex: 40
            }}
          />
        </div>
      )}

    </div>
  );
};

export default ImageZoomAmazon;