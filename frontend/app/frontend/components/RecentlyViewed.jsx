'use client';

import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FiHeart } from 'react-icons/fi';
import { AppContext } from '../context/AppContext';

const getProductId = (product) => String(product?._id ?? product?.id ?? '');

const dedupeRecentlyViewed = (items) => {
  const seen = new Set();
  return items.filter((product) => {
    const id = getProductId(product);
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

const RecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const { toggleWishlist, isInWishlist, addToCart } = useContext(AppContext);

  useEffect(() => {
    const loadRecentlyViewed = () => {
      const items = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
      const unique = dedupeRecentlyViewed(items);
      setRecentlyViewed(unique);
      if (unique.length !== items.length) {
        localStorage.setItem('recentlyViewed', JSON.stringify(unique));
      }
    };

    loadRecentlyViewed();
    window.addEventListener('recentlyViewedUpdated', loadRecentlyViewed);
    return () => window.removeEventListener('recentlyViewedUpdated', loadRecentlyViewed);
  }, []);

  const selectVariant = (productId, variantIndex) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variantIndex,
    }));
  };

  const handleAddToCart = (product) => {
    const selectedVariantIndex = selectedVariants[product._id] ?? 0;
    const variant = product.variant?.[selectedVariantIndex];

    if (!variant || product.stock <= 0 || variant.stock <= 0) {
      return;
    }

    addToCart(product, variant, 1);
  };

  const renderProductCard = (product) => {
    const selectedIndex = selectedVariants[product._id] ?? 0;

    const hasVariants =
      Array.isArray(product.variant) && product.variant.length > 0;

    const safeSelectedIndex = hasVariants
      ? Math.min(Math.max(selectedIndex, 0), product.variant.length - 1)
      : 0;

    const safeVariant = hasVariants ? product.variant[safeSelectedIndex] : null;

    const discount =
      safeVariant && safeVariant.price > safeVariant.discountPrice
        ? Math.round(
            ((safeVariant.price - safeVariant.discountPrice) /
              safeVariant.price) *
              100,
          )
        : 0;

    const isWishlisted = isInWishlist(product._id);

    const outOfStock =
      product.stock <= 0 || !safeVariant || safeVariant.stock <= 0;

    const mainCardImg = safeVariant?.image || product.thumbImg;

    return (
      <div className="bg-white border border-[#8D6AF8] rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
        <div className="relative aspect-square overflow-hidden">
          <Link
            href={{
              pathname: `/frontend/ProductDetail/${product.slug}`,
              query: hasVariants ? { v: String(safeSelectedIndex) } : {},
            }}
          >
            <div className="relative h-full w-full group transition-transform duration-500">
              <img
                src={`http://localhost:5000${mainCardImg}`}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
              />

              <img
                src={`http://localhost:5000${
                  product.galleryImg?.[1] || mainCardImg
                }`}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </Link>

          <button
            onClick={() => toggleWishlist(product, safeSelectedIndex)}
            className={`absolute top-3 right-3 p-2 rounded-full bg-white shadow-sm z-10 ${
              isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <FiHeart
              className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`}
            />
          </button>
        </div>

        <div className="p-3 flex-grow flex flex-col">
          <h3 className="text-sm sm:text-lg font-medium capitalize mb-2 line-clamp-1">
            {product.name}
          </h3>

          <h3 className="text-sm sm:text-md font-medium capitalize mb-2 line-clamp-2">
            {product.shortDescription?.replace(/<[^>]*>/g, '')}
          </h3>

          {safeVariant && (
            <>
              <div className="flex items-center gap-2 mb-3">
                {safeVariant.price > safeVariant.discountPrice && (
                  <span className="line-through text-gray-500">
                    ₹{safeVariant.price}
                  </span>
                )}

                <span className="font-bold text-lg">
                  ₹{safeVariant.discountPrice}
                </span>

                {discount > 0 && (
                  <span className="text-red-600 text-xs">{discount}% OFF</span>
                )}
              </div>

              {hasVariants && (
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {product.variant.map((v, i) => {
                    const isActive = i === safeSelectedIndex;

                    return (
                      <button
                        key={`${product._id}-${i}`}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          selectVariant(product._id, i);
                        }}
                        title={v?.color || `Variant ${i + 1}`}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          isActive
                            ? 'border-[#8D6AF8] ring-2 ring-[#8D6AF8]/30'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <span
                          className="block w-4 h-4 rounded-full mx-auto shadow-inner"
                          style={{
                            backgroundColor: v?.colorcode || '#000000',
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              <button
                onClick={() => handleAddToCart(product)}
                disabled={outOfStock}
                className={`w-full py-2 rounded-md ${
                  outOfStock
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-[#5d3dbb] text-white hover:bg-black'
                }`}
              >
                {outOfStock ? 'Out of Stock' : 'Add To Cart'}
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 2, arrows: false, dots: true } },
    ],
  };

  if (recentlyViewed.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 sm:py-12 py-6">
      <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
        Recently Viewed
      </h2>
      <Slider {...settings}>
        {recentlyViewed.map((product) => (
          <div key={product._id} className="px-2 h-full">
            {renderProductCard(product)}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RecentlyViewed;
