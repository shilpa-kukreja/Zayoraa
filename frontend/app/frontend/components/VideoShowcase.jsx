'use client';

import React, { useRef, useState, useMemo, useContext } from 'react';
import Link from 'next/link';
import { AppContext } from '../context/AppContext';

const VideoShowcase = () => {
  const { products, videos, addToCart } = useContext(AppContext);
  console.log('videoshow', videos);

  const sliderRef = useRef(null);
  const [hoveredItem, setHoveredItem] = useState(null);


  // ✅ Sort videos
  const sortedVideos = useMemo(() => {
    return [...(videos || [])].sort(
      (a, b) => parseInt(a.order || 0) - parseInt(b.order || 0)
    );
  }, [videos]);

  const handleAddToCart = (product) => {
    const variant = product?.variant?.[0];
    if (variant) {
      addToCart(product, variant, 1);
    }
  };

  // ✅ Safe product finder
  const getProductDetails = (productId) => {
    if (!productId) return null;

    // Handle object or string
    const id = typeof productId === 'object' ? productId._id : productId;

    return products?.find((p) => p._id?.toString() === id?.toString());
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const calculateDiscount = (price, discountPrice) => {
    if (!price || !discountPrice) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  // ✅ Loader state
  if (!sortedVideos || sortedVideos.length === 0) {
    return (
      <section className="mx-auto px-4 sm:px-6 lg:px-8 sm:py-16 py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">Loading videos...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full mx-auto px-4 sm:px-6 lg:px-8 sm:py-16 py-6 relative">
      <div className="text-center sm:mb-12 mb-6">
        <h2 className="sm:text-4xl text-2xl font-semibold text-center sm:mb-12 mb-4 uppercase text-black">
          TAKE A CLOSER LOOK
        </h2>
        <p className="sm:text-lg text-sm text-gray-600 max-w-2xl mx-auto">
          Discover the artistry of Syuta bags through dynamic, detailed views
        </p>
      </div>

      <div className="relative group">
        {/* Navigation Arrows */}
        <button
          onClick={scrollLeft}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-black rounded-full shadow-lg hover:bg-black transition-all opacity-0 group-hover:opacity-100"
          aria-label="Scroll left"
        >
          <svg
            className="w-5 h-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={scrollRight}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-black rounded-full shadow-lg hover:bg-black transition-all opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <svg
            className="w-5 h-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Video Slider */}
        <div
          ref={sliderRef}
          className="flex overflow-hidden  scrollbar-hide space-x-6 py-2 px-1"
        >
          {sortedVideos.map((video, index) => {
            const product = getProductDetails(video.productid);
            const variant = product?.variant?.[0]; // safe

            return (
              <div
                key={video._id || video.id || index}
                className="flex-none w-64 sm:w-72 lg:w-80 transition-all duration-300 group/card"
                onMouseEnter={() => setHoveredItem(video._id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  href={
                    product?.slug
                      ? `/frontend/ProductDetail/${product.slug}`
                      : '#'
                  }
                  className="group relative block"
                >
                  {/* Video Container */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <video
                      src={`http://localhost:5000${video.videourl} `}
                      autoPlay={index === 0}
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                    />

                    {/* Add to Cart Button */}
                    {product && (
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <button
                          className="flex items-center justify-center space-x-2 bg-[#6b4fbe] text-white font-medium px-4 py-2 rounded-full shadow-md hover:bg-black transition-all transform translate-y-2 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 duration-300"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                        >
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <span className="text-sm">Add to Cart</span>
                        </button>

                        {/* Discount Badge */}
                        {variant?.price > variant?.discountPrice && (
                          <span className="text-xs font-bold text-white bg-red-600 px-2 py-1 rounded-md">
                            {calculateDiscount(
                              variant.price,
                              variant.discountPrice
                            )}
                            % OFF
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  {product && (
                    <div className="mt-4 px-2">
                      <h4 className="text-lg text-center capitalize font-semibold text-gray-900 line-clamp-2 mb-1 group-hover/card:text-primary transition-colors">
                        {product.name}
                      </h4>
                      {variant && (
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{variant.discountPrice}
                          </span>
                          {variant.price > variant.discountPrice && (
                            <span className="text-sm line-through text-gray-400">
                              ₹{variant.price}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
