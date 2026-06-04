// 'use client';
// import React, { useState, useEffect, useRef } from 'react';
// import ReactCompareImage from 'react-compare-image';
// import { motion, AnimatePresence } from 'framer-motion';

// const slides = [
//   {
//     leftImage: '/sliders/slider1.webp',
//     rightImage: '/sliders/slider2.webp',
//     leftLabel: 'VANILLA',
//     rightLabel: 'PISTACHIO',
//   },
// //   {
// //     leftImage: '/sliders/slider3.webp',
// //     rightImage: '/sliders/slider4.webp',
// //     leftLabel: 'CHOCOLATE',
// //     rightLabel: 'MANGO',
// //   },
// ];

// const CompareSlider = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const containerRef = useRef(null);
//   const [width, setWidth] = useState(0);

//   // Auto slider every 5 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   // Measure container width
//   useEffect(() => {
//     const updateWidth = () => {
//       if (containerRef.current) {
//         setWidth(containerRef.current.offsetWidth);
//       }
//     };

//     updateWidth();
//     window.addEventListener('resize', updateWidth);
//     return () => window.removeEventListener('resize', updateWidth);
//   }, []);

//   const slide = slides[currentSlide];

//   return (
//     <div
//       className="w-full min-h-screen flex items-center justify-center px-0 py-12 overflow-hidden"
//       ref={containerRef}
//     >
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={currentSlide}
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -30 }}
//           transition={{ duration: 0.8 }}
//           className="w-full h-full relative"
//         >
//           {width > 0 && (
//             <ReactCompareImage
//               leftImage={slide.leftImage}
//               rightImage={slide.rightImage}
//               sliderLineColor="#fff"
//               sliderLineWidth={2}
//               handleSize={40}
//               alt="Compare Image"
//               style={{
//                 width: `${width}px`,
//                 height: 'auto',
//               }}
//             />
//           )}

//           {/* Left Label */}
//           <div className="absolute bottom-10 left-6 text-white drop-shadow-md">
//             <p className="text-lg md:text-xl font-semibold">{slide.leftLabel}</p>
//             <a href="#" className="text-sm underline">Shop Now</a>
//           </div>

//           {/* Right Label */}
//           <div className="absolute bottom-10 right-6 text-white drop-shadow-md text-right">
//             <p className="text-lg md:text-xl font-semibold">{slide.rightLabel}</p>
//             <a href="#" className="text-sm underline">Shop Now</a>
//           </div>
//         </motion.div>
//       </AnimatePresence>
//     </div>
//   );
// };

// export default CompareSlider;


"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    leftImage: "/sliders/sliders1.png",
    rightImage: "/sliders/sliders2.png",
    leftLabel: "VANILLA",
    rightLabel: "PISTACHIO",
  },
  // Add more slides...
];

const CustomCompareImage = ({ leftImage, rightImage, width, handleSize = 40 }) => {
  const [position, setPosition] = useState(width / 2);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  useEffect(() => {
    setPosition(width / 2); // Start with 50/50 split
  }, [width]);

  const startDrag = () => (isDragging.current = true);
  const stopDrag = () => (isDragging.current = false);

  const onMove = (e) => {
    if (!isDragging.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let newPos = clientX - rect.left;
    newPos = Math.max(0, Math.min(newPos, rect.width));
    setPosition(newPos);
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseup", stopDrag, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", stopDrag, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", stopDrag);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-auto overflow-hidden select-none"
      style={{ maxWidth: `${width}px` }}
    >
      {/* Right image (full width) */}
      <img src={rightImage} alt="Right" className="w-full h-auto block" />
      
      {/* Left image (clipped based on position) */}
      <div
        className="absolute top-0 left-0 h-full overflow-hidden"
        style={{ width: `${position}px` }}
      >
        <img src={leftImage} alt="Left" className="w-full h-auto block" />
      </div>

      {/* Divider line and handle */}
      <div
        className="absolute top-0 bottom-0 flex items-center justify-center"
        style={{
          left: `${position}px`,
          transform: 'translateX(-50%)'
        }}
      >
        <div className="h-full w-px bg-white absolute" />
        {/* Drag handle */}
        <div
          className="w-10 h-12 bg-white rounded-full absolute cursor-grab active:cursor-grabbing shadow-md flex items-center justify-center"
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
          <div className="flex space-x-0.5">
            <div className="w-1 h-4 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-4 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CompareSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  // Auto slider every 5s with pause on hover/touch
  useEffect(() => {
    let interval;
    const startInterval = () => {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    };

    startInterval();
    const container = containerRef.current;
    if (!container) return;

    const pause = () => clearInterval(interval);
    const resume = () => startInterval();

    container.addEventListener("mouseenter", pause);
    container.addEventListener("mouseleave", resume);
    container.addEventListener("touchstart", pause, { passive: true });
    container.addEventListener("touchend", resume, { passive: true });

    return () => {
      clearInterval(interval);
      container.removeEventListener("mouseenter", pause);
      container.removeEventListener("mouseleave", resume);
      container.removeEventListener("touchstart", pause);
      container.removeEventListener("touchend", resume);
    };
  }, []);

  // Resize handling
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) setWidth(containerRef.current.offsetWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth, { passive: true });
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div
      ref={containerRef}
      className="w-full sm:min-h-screen h-auto flex items-center justify-center px-0 py-5 overflow-hidden"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.8 }}
          className="w-full h-full relative flex justify-center"
        >
          {width > 0 && (
            <CustomCompareImage
              leftImage={slide.leftImage}
              rightImage={slide.rightImage}
              width={width}
              handleSize={40}
            />
          )}

          {/* Labels */}
          <div className="absolute sm:bottom-10 bottom-5 left-6 text-white drop-shadow-md">
            <p className="text-lg md:text-xl font-semibold">{slide.leftLabel}</p>
            <a href="/frontend/view-all" className="text-sm underline hover:no-underline">
              Shop Now
            </a>
          </div>
          <div className="absolute sm:bottom-10 bottom-5 right-6 text-white drop-shadow-md text-right">
            <p className="text-lg md:text-xl font-semibold">{slide.rightLabel}</p>
            <a href="/frontend/view-all" className="text-sm underline hover:no-underline">
              Shop Now
            </a>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CompareSlider;








