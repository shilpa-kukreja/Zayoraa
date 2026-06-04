"use client";

import React, { useContext, useEffect, useState } from "react";
import { FiHeart } from "react-icons/fi";
import Link from "next/link";
import Slider from "react-slick";
import { AppContext } from "../context/AppContext";

const DealsOfTheDay = () => {
  const { products, categories, toggleWishlist, isInWishlist, addToCart } =
    useContext(AppContext);
  const [selectedVariants, setSelectedVariants] = useState({});

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
  // Change this date
  const dealEndDate = "2026-12-31T23:59:59";

  const [timeLeft, setTimeLeft] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(dealEndDate).getTime();

      const distance = end - now;

      if (distance <= 0) {
        setTimeLeft({
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        return;
      }

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dealCategory = categories.find(
    (category) =>
      category?.slug === "deals-of-the-day" ||
      category?.name?.toLowerCase() === "deals of the day",
  );

  const dealCategoryId = dealCategory?._id?.toString();

  const dealProducts = products
    .filter((product) => {
      const categoryMatched =
        Boolean(dealCategoryId) &&
        Array.isArray(product.category) &&
        product.category.some((catId) => catId?.toString() === dealCategoryId);

      const sectionMatched =
        product.section?.includes("dealoftheday") ||
        product.section?.includes("deals-of-the-day");

      return categoryMatched || sectionMatched;
    })
    .slice(0, 3);

  const mobileSliderSettings = {
    dots: false,
    infinite: dealProducts.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: dealProducts.length > 1,
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
      <div className="bg-white border border-[#6b40c2] rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
        {/* IMAGE */}
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
              isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"
            }`}
          >
            <FiHeart
              className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
            />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-3 flex-grow flex flex-col">
          <h3 className="text-sm sm:text-lg font-medium capitalize mb-2">
            {product.name}
          </h3>

          <h3 className="text-sm sm:text-md font-medium capitalize mb-2 line-clamp-2">
            {product.shortDescription?.replace(/<[^>]*>/g, "")}
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

              {/* COLOR VARIANTS */}
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
                            ? "border-[#6b40c2] ring-2 ring-[#6b40c2]/30"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <span
                          className="block w-4 h-4 rounded-full mx-auto shadow-inner"
                          style={{
                            backgroundColor: v?.colorcode || "#000000",
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
                    ? "bg-gray-300 text-gray-500"
                    : "bg-[#6b40c2] text-white hover:bg-black"
                }`}
              >
                {outOfStock ? "Out of Stock" : "Add To Cart"}
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (

    // mobile view
    <section className="max-w-[1600px] mx-auto px-2 sm:px-6 py-10">
      <div className="bg-gradient-to-r from-[#8D6AF8] to-[#8F71F4] rounded-[30px] p-4 md:p-8">
        <div className="lg:hidden">
          <div className="text-center flex flex-col items-center justify-center">
            <img
              src="/deals/mobile.webp"
              alt="Deal of the Day"
              className="w-full max-w-[280px] object-contain"
            />

            <h3 className="text-black text-2xl mb-4">Expires in</h3>

            <div className="flex gap-3 mb-6">
              <div className="bg-white rounded-xl p-3 min-w-[75px]">
                <div className="font-bold text-xl">{timeLeft.hours}</div>
                <div className="text-xs">Hrs</div>
              </div>

              <div className="bg-white rounded-xl p-3 min-w-[75px]">
                <div className="font-bold text-xl">{timeLeft.minutes}</div>
                <div className="text-xs">Mins</div>
              </div>

              <div className="bg-white rounded-xl p-3 min-w-[75px]">
                <div className="font-bold text-xl">{timeLeft.seconds}</div>
                <div className="text-xs">Sec</div>
              </div>
            </div>
          </div>

          <div>
            {dealProducts.length > 0 && (
              <Slider {...mobileSliderSettings}>
                {dealProducts.map((product) => (
                  <div key={product._id} className="px-2">
                    {renderProductCard(product)}
                  </div>
                ))}
              </Slider>
            )}
          </div>

          {/* <div className="text-center mt-8">
            <Link
              href="/frontend/view-all"
              className="inline-flex items-center justify-center bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition"
            >
              View Collection
            </Link>
          </div> */}
        </div>

        <div className="hidden lg:grid lg:grid-cols-4 gap-6 items-center">
          {/* LEFT SIDE */}
          <div className="text-center flex flex-col items-center justify-center">
            <img
              src="/deals/desktop.webp"
              alt="Deal of the Day"
              className="w-full max-w-[350px] object-contain"
            />

            <h3 className="text-black text-2xl mb-4">Expires in</h3>

            <div className="flex gap-3">
              <div className="bg-white rounded-xl p-3 min-w-[75px]">
                <div className="font-bold text-xl">{timeLeft.hours}</div>
                <div className="text-xs">Hrs</div>
              </div>

              <div className="bg-white rounded-xl p-3 min-w-[75px]">
                <div className="font-bold text-xl">{timeLeft.minutes}</div>
                <div className="text-xs">Mins</div>
              </div>

              <div className="bg-white rounded-xl p-3 min-w-[75px]">
                <div className="font-bold text-xl">{timeLeft.seconds}</div>
                <div className="text-xs">Sec</div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {dealProducts.map((product) => (
                <div key={product._id}>{renderProductCard(product)}</div>
              ))}
            </div>

            {/* <div className="text-center mt-8">
              <Link
                href="/frontend/view-all"
                className="inline-flex items-center justify-center bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition"
              >
                View Collection
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealsOfTheDay;
