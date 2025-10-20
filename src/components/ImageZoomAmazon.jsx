import React, { useState, useRef, useEffect } from "react";

const ImageZoomAmazon = ({
  src,
  width = 400,
  height = 400,
  zoom = 3,
  zoomWidth = 400,
  zoomHeight = 400,
  maxGap = 50,
  minGap = 20
}) => {
  const [showZoom, setShowZoom] = useState(false);
  const [coords, setCoords] = useState({ x: 50, y: 50 }); // center by default
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [touchStart, setTouchStart] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const overlayWidthFinal = isMobile ? window.innerWidth : zoomWidth;
  const overlayHeightFinal = isMobile ? window.innerHeight : zoomHeight;

  const calculatedGap = Math.min(Math.max(windowWidth * 0.02, minGap), maxGap);

  const overlayTop = isMobile
    ? 0
    : (imgRef.current?.getBoundingClientRect().top || 0) +
      (height - overlayHeightFinal) / 2;

  const overlayLeft = isMobile
    ? 0
    : (imgRef.current?.getBoundingClientRect().right || 0) + calculatedGap;

  // Desktop: update coords on mouse move
  const handleMouseMove = (e) => {
    if (isMobile) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });
  };

  // Mobile: handle touch start
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY, ...coords });
  };

  // Mobile: handle touch move (drag)
  const handleTouchMove = (e) => {
    if (!isMobile || !touchStart) return;
    const touch = e.touches[0];
    const deltaX = ((touchStart.x - touch.clientX) / overlayWidthFinal) * 100;
    const deltaY = ((touchStart.y - touch.clientY) / overlayHeightFinal) * 100;
    let newX = touchStart.x - deltaX;
    let newY = touchStart.y - deltaY;

    // Clamp between 0-100
    newX = Math.min(Math.max(touchStart.x + deltaX, 0), 100);
    newY = Math.min(Math.max(touchStart.y + deltaY, 0), 100);
    setCoords({ x: newX, y: newY });
  };

  // Reset touch start on touch end
  const handleTouchEnd = () => {
    setTouchStart(null);
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
        onTouchStart={() => setShowZoom(true)}
      />

      {/* Zoom Overlay */}
      {showZoom && (
        <div
          className="fixed z-50 pointer-events-auto flex items-center justify-center"
          style={{
            top: overlayTop,
            left: overlayLeft,
            width: overlayWidthFinal,
            height: overlayHeightFinal,
            backgroundColor: isMobile ? "rgba(0,0,0,0.4)" : "transparent",
            borderRadius: "0.5rem",
            border: isMobile ? "none" : "1px solid #d1d5db",
            boxSizing: "border-box",
            touchAction: "none", // important for drag
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={() => setShowZoom(false)}
              className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md text-gray-700 hover:bg-gray-100"
            >
              &#10005;
            </button>
          )}

          <div
            className="rounded-lg bg-no-repeat bg-center w-full h-full"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: `${width * zoom}px ${height * zoom}px`,
              backgroundPosition: isMobile
                ? `${-coords.x}% ${-coords.y}%`
                : `-${(coords.x / 100) * width * (zoom - 1)}px -${
                    (coords.y / 100) * height * (zoom - 1)
                  }px`,
              pointerEvents: "none",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageZoomAmazon;
