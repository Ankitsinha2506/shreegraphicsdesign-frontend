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
  const imgRef = useRef(null);
  const touchStartRef = useRef(null);
  const velocityRef = useRef({ vx: 0, vy: 0 });
  const animationRef = useRef(null);

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

  // Mobile: touch handlers with inertia
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    cancelAnimationFrame(animationRef.current);
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      lastX: coords.x,
      lastY: coords.y,
      time: Date.now(),
    };
  };

  const handleTouchMove = (e) => {
    if (!isMobile || !touchStartRef.current) return;
    const touch = e.touches[0];
    const dx = ((touchStartRef.current.x - touch.clientX) / overlayWidthFinal) * 100;
    const dy = ((touchStartRef.current.y - touch.clientY) / overlayHeightFinal) * 100;
    const newX = Math.min(Math.max(touchStartRef.current.lastX + dx, 0), 100);
    const newY = Math.min(Math.max(touchStartRef.current.lastY + dy, 0), 100);

    // calculate velocity
    const now = Date.now();
    const dt = now - touchStartRef.current.time;
    if (dt > 0) {
      velocityRef.current.vx = (newX - coords.x) / dt;
      velocityRef.current.vy = (newY - coords.y) / dt;
    }
    touchStartRef.current.time = now;

    setCoords({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    const decay = 0.95; // inertia friction
    const step = () => {
      let { x, y } = coords;
      let { vx, vy } = velocityRef.current;

      vx *= decay;
      vy *= decay;

      x += vx * 16; // approx 60fps
      y += vy * 16;

      x = Math.min(Math.max(x, 0), 100);
      y = Math.min(Math.max(y, 0), 100);

      setCoords({ x, y });
      velocityRef.current = { vx, vy };

      if (Math.abs(vx) > 0.01 || Math.abs(vy) > 0.01) {
        animationRef.current = requestAnimationFrame(step);
      }
    };
    animationRef.current = requestAnimationFrame(step);
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
            touchAction: "none",
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
              backgroundPosition: `-${(coords.x / 100) * width * (zoom - 1)}px -${
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
