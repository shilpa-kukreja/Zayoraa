'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

const logos = [
  { src: '/logos/logo1.png', alt: 'Cosmopolitan' },
  { src: '/logos/logo2.png', alt: 'Elle' },
  { src: '/logos/logo3.png', alt: 'Grazia' },
  { src: '/logos/logo1.png', alt: 'Vogue' },
  { src: '/logos/logo2.png', alt: 'Harper\'s Bazaar' },
  { src: '/logos/logo3.png', alt: 'Marie Claire' },
];

const MediaSlider = () => {
  const sliderRef = useRef();
  const sliderContentRef = useRef();
  const animationRef = useRef();
  const scrollSpeed = useRef(0.5); // Adjustable speed

  useEffect(() => {
    const slider = sliderRef.current;
    const content = sliderContentRef.current;

    if (!slider || !content) return;

    // Double the content for seamless looping
    content.innerHTML = content.innerHTML + content.innerHTML;

    const animate = () => {
      if (slider.scrollLeft >= content.scrollWidth / 2) {
        slider.scrollLeft -= content.scrollWidth / 2;
      } else {
        slider.scrollLeft += scrollSpeed.current;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    // Pause on hover
    const handleMouseEnter = () => {
      cancelAnimationFrame(animationRef.current);
    };

    const handleMouseLeave = () => {
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    slider.addEventListener('mouseenter', handleMouseEnter);
    slider.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationRef.current);
      slider.removeEventListener('mouseenter', handleMouseEnter);
      slider.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="w-full overflow-hidden  py-10 relative ">
      {/* Section title */}
      

      {/* Gradient overlays */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

      {/* Slider container */}
      <div
        ref={sliderRef}
        className="w-full overflow-x-hidden py-8"
      >
        <div
          ref={sliderContentRef}
          className="flex gap-20 items-center w-max px-8"
        >
          {logos.map((logo, index) => (
            <div
              key={`${logo.alt}-${index}`}
              className="relative w-40 h-16 flex-shrink-0 transition-all duration-300 hover:scale-110 grayscale hover:grayscale-0"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                className="object-contain object-center"
                sizes="(max-width: 768px) 120px, 160px"
                quality={100}
                priority={index < 3}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaSlider;