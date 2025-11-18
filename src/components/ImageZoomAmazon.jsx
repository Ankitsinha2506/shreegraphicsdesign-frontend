import React, { useState, useRef, useEffect } from "react";

const ImageZoomAmazon = ({
  src,
  width = 420,
  height = 420,
  zoom = 2,
  gap = 20,
  boxScale = 1.15,
  topOffset = 40
}) => {
  const imgRef = useRef(null);
  const [showZoom, setShowZoom] = useState(false);
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const [imgSize, setImgSize] = useState({ w: width, h: height });
  const [zoomPos, setZoomPos] = useState({ top: 0, left: 0 });

  // Recalculate positions based on rendered image size
  const updatePosition = () => {
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;

    setImgSize({ w: rect.width, h: rect.height });

    setZoomPos({
      top: rect.top + window.scrollY - topOffset,
      left: rect.right + gap + window.scrollX,
    });
  };

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, []);

  const handleMouseMove = (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setCoords({
      x: Math.min(Math.max(x, 0), 100),
      y: Math.min(Math.max(y, 0), 100),
    });
  };

  return (
    <>
      {/* MAIN IMAGE */}
      <div
        className="relative flex items-center justify-center"
        style={{ width, height }}
      >
        <img
          ref={imgRef}
          src={src}
          alt="Product"
          className="w-full h-full object-contain rounded-md shadow"
          onLoad={updatePosition}
          onMouseEnter={() => {
            updatePosition();
            setShowZoom(true);
          }}
          onMouseLeave={() => setShowZoom(false)}
          onMouseMove={handleMouseMove}
        />
      </div>

      {/* ZOOM BOX */}
      {showZoom && (
        <div
          className="fixed z-50 rounded-xl overflow-hidden backdrop-blur-lg shadow-xl border border-gray-300"
          style={{
            top: zoomPos.top,
            left: zoomPos.left,
            width: imgSize.w * boxScale,
            height: imgSize.h * boxScale,
            backgroundImage: `url(${src})`,
            backgroundSize: `${imgSize.w * zoom}px ${imgSize.h * zoom}px`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: `-${(coords.x / 100) * imgSize.w * (zoom - 1)}px 
                                -${(coords.y / 100) * imgSize.h * (zoom - 1)}px`,
            backgroundColor: "rgba(255,255,255,0.4)",
          }}
        ></div>
      )}
    </>
  );
};

export default ImageZoomAmazon;
