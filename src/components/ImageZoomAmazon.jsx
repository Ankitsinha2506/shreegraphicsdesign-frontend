import React, { useState, useRef } from "react";

const ImageZoomAmazon = ({
  src,
  width = 400,
  height = 400,
  zoom = 3,
  zoomWidth = 800,  // NEW: width of zoom window
  zoomHeight = 800  // NEW: height of zoom window
}) => {
  const [showZoom, setShowZoom] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });
  };

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
          className="fixed z-50 pointer-events-none"
          style={{
            top: "50%",
            left: "70%", // slightly right
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="rounded-lg border border-gray-300" // only thin border
            style={{
              width: zoomWidth,
              height: zoomHeight,
              backgroundImage: `url(${src})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${width * zoom}px ${height * zoom}px`,
              backgroundPosition: `-${(coords.x / 100) * width * (zoom - 1)}px -${(coords.y / 100) * height * (zoom - 1)}px`,
            }}
          />
        </div>
      )}


    </div>
  );
};

export default ImageZoomAmazon;
