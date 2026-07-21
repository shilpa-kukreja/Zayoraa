"use client";
import React, { useState, useEffect, useContext, useMemo } from "react";
import Link from "next/link";
import {
  FiFilter,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiHeart,
} from "react-icons/fi";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";

export default function BestSellers() {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    availability: false,
    categories: [],
    priceRange: [0, 5599],
    sortBy: "featured",
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    price: true,
  });
  const [selectedVariants, setSelectedVariants] = useState({});

  const { toggleWishlist, isInWishlist, addToCart, products, categories } =
    useContext(AppContext);

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
      toast.error("This product is out of stock.");
      return;
    }

    addToCart(product, variant, 1);
    // toast.success(`${product.name} added to cart!`, {
    //   position: "top-right",
    //   autoClose: 2000,
    // });
  };

  const bestSellerProducts = useMemo(
    () => products.filter((product) => product.section?.includes("bestseller")),
    [products],
  );

  const hasActiveFilters =
    filters.availability ||
    filters.categories.length > 0 ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 5599;

  // Apply filters
  useEffect(() => {
    let result = [...bestSellerProducts];

    if (filters.availability) {
      result = result.filter((product) => parseInt(product.stock) > 0);
    }

    if (filters.categories.length > 0) {
      result = result.filter((product) =>
        filters.categories.some((cat) =>
          product.category.includes(cat.toString()),
        ),
      );
    }

    result = result.filter((product) => {
      const minPrice = Math.min(
        ...product.variant.map((v) => v.discountPrice || v.price),
      );
      const maxPrice = Math.max(
        ...product.variant.map((v) => v.discountPrice || v.price),
      );
      return (
        minPrice >= filters.priceRange[0] && maxPrice <= filters.priceRange[1]
      );
    });

    switch (filters.sortBy) {
      case "price-low":
        result.sort((a, b) => {
          const aMin = Math.min(
            ...a.variant.map((v) => v.discountPrice || v.price),
          );
          const bMin = Math.min(
            ...b.variant.map((v) => v.discountPrice || v.price),
          );
          return aMin - bMin;
        });
        break;
      case "price-high":
        result.sort((a, b) => {
          const aMax = Math.max(
            ...a.variant.map((v) => v.discountPrice || v.price),
          );
          const bMax = Math.max(
            ...b.variant.map((v) => v.discountPrice || v.price),
          );
          return bMax - aMax;
        });
        break;
      case "newest":
        result.sort((a, b) => parseInt(b._id) - parseInt(a._id));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [filters, bestSellerProducts]);

  const handleCategoryChange = (categoryId) => {
    setFilters((prev) => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter((c) => c !== categoryId)
        : [...prev.categories, categoryId];
      return { ...prev, categories: newCategories };
    });
  };

  const toggleFilterSection = (section) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const resetFilters = () => {
    setFilters({
      availability: false,
      categories: [],
      priceRange: [0, 5599],
      sortBy: "featured",
    });
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
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${mainCardImg}`}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
              />

              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${
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

        <div className="p-3 flex-grow flex flex-col">
          <h3 className="text-sm sm:text-lg font-medium capitalize mb-2 line-clamp-1">
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
                            ? "border-[#8D6AF8] ring-2 ring-[#8D6AF8]/30"
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
                    : "bg-[#5d3dbb] text-white hover:bg-black"
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
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="w-full">
        <img
          src="/best-seller/banner.png"
          alt="Best Sellers"
          className="w-full object-cover"
        />
      </div>

      <div className="text-center sm:mt-6 mt-5">
        <h1 className="text-2xl md:text-4xl font-bold">BestSellers</h1>
        <div className="flex items-center justify-center gap-3">
          <span className="text-[#6b40c2] text-xl">✦</span>
          <span className="w-25 h-[3px] bg-gray-300"></span>
          <span className="text-[#6b40c2] text-xl">✦</span>
          <span className="w-25 h-[3px] bg-gray-300"></span>
          <span className="text-[#6b40c2] text-xl">✦</span>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:py-8 py-5">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filters Button */}
          <div className="lg:hidden flex justify-between items-center sm:mb-6 mb-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#7a1113] text-white rounded-lg"
            >
              <FiFilter /> Filters
            </button>
            <div className="w-48">
              <select
                className="w-full border rounded-lg px-3 py-2 bg-white"
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({ ...filters, sortBy: e.target.value })
                }
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Mobile Filters Overlay */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 bg-opacity-50 lg:hidden">
              <div className="absolute right-0 top-0 h-full w-4/5 bg-white overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button onClick={() => setMobileFiltersOpen(false)}>
                    <FiX size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Availability */}
                  <div className="pb-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="mobile-in-stock"
                        checked={filters.availability}
                        onChange={() =>
                          setFilters({
                            ...filters,
                            availability: !filters.availability,
                          })
                        }
                        className="h-4 w-4 text-gray-600 rounded"
                      />
                      <label
                        htmlFor="mobile-in-stock"
                        className="ml-2 text-gray-700"
                      >
                        In stock only
                      </label>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="pb-4 border-b border-gray-200">
                    <button
                      className="flex justify-between items-center w-full"
                      onClick={() => toggleFilterSection("category")}
                    >
                      <h3 className="font-medium">CATEGORY</h3>
                      {expandedFilters.category ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      )}
                    </button>
                    {expandedFilters.category && (
                      <div className="mt-3 space-y-2">
                        {categories.map((category) => (
                          <div key={category._id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`mobile-category-${category._id}`}
                              checked={filters.categories.includes(
                                category._id.toString(),
                              )}
                              onChange={() =>
                                handleCategoryChange(category._id.toString())
                              }
                              className="h-4 w-4 text-gray-600 rounded"
                            />
                            <label
                              htmlFor={`mobile-category-${category._id}`}
                              className="ml-2 text-gray-700"
                            >
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="pb-4 border-b border-gray-200">
                    <button
                      className="flex justify-between items-center w-full"
                      onClick={() => toggleFilterSection("price")}
                    >
                      <h3 className="font-medium">PRICE</h3>
                      {expandedFilters.price ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      )}
                    </button>
                    {expandedFilters.price && (
                      <div className="mt-3 space-y-4">
                        <div className="flex justify-between text-sm">
                          <span>₹{filters.priceRange[0]}</span>
                          <span>₹{filters.priceRange[1]}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="5599"
                          value={filters.priceRange[1]}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              priceRange: [
                                filters.priceRange[0],
                                parseInt(e.target.value),
                              ],
                            })
                          }
                          className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-800"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 border border-gray-300 rounded-lg flex-1"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="px-4 py-2 bg-[#7a1113] text-white rounded-lg flex-1"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Filters */}
          <div className="hidden lg:block w-1/4 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg">FILTERS</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Reset All
                </button>
              </div>

              {/* Availability */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="in-stock"
                    checked={filters.availability}
                    onChange={() =>
                      setFilters({
                        ...filters,
                        availability: !filters.availability,
                      })
                    }
                    className="h-4 w-4 text-gray-600 rounded focus:ring-gray-500"
                  />
                  <label htmlFor="in-stock" className="ml-2 text-gray-700">
                    In stock only
                  </label>
                </div>
              </div>

              {/* Category */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <button
                  className="flex justify-between items-center w-full mb-3"
                  onClick={() => toggleFilterSection("category")}
                >
                  <h4 className="font-medium">CATEGORY</h4>
                  {expandedFilters.category ? (
                    <FiChevronUp size={18} />
                  ) : (
                    <FiChevronDown size={18} />
                  )}
                </button>
                {expandedFilters.category && (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category._id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`category-${category._id}`}
                          checked={filters.categories.includes(
                            category._id.toString(),
                          )}
                          onChange={() =>
                            handleCategoryChange(category._id.toString())
                          }
                          className="h-4 w-4 text-gray-600 rounded focus:ring-gray-500"
                        />
                        <label
                          htmlFor={`category-${category.id}`}
                          className="ml-2 text-gray-700"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="mb-2">
                <button
                  className="flex justify-between items-center w-full mb-3"
                  onClick={() => toggleFilterSection("price")}
                >
                  <h4 className="font-medium">PRICE</h4>
                  {expandedFilters.price ? (
                    <FiChevronUp size={18} />
                  ) : (
                    <FiChevronDown size={18} />
                  )}
                </button>
                {expandedFilters.price && (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>₹{filters.priceRange[0]}</span>
                      <span>₹{filters.priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5599"
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          priceRange: [
                            filters.priceRange[0],
                            parseInt(e.target.value),
                          ],
                        })
                      }
                      className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-800"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="w-full lg:w-3/4">
            {/* Sort By - Desktop */}
            <div className="hidden lg:flex justify-between items-center mb-4">
              <span className="text-gray-600">
                {filteredProducts.length} products
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Sort by:</span>
                <select
                  className="border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value })
                  }
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 &&
            products.length > 0 &&
            hasActiveFilters ? (
              <div className="text-center sm:py-16 py-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-medium text-gray-700 mb-4">
                  No products match your filters
                </h3>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-[#6a4cc2] text-white rounded-lg hover:bg-black transition"
                >
                  Reset Filters
                </button>
              </div>
            ) : filteredProducts.length === 0 &&
              products.length > 0 &&
              bestSellerProducts.length === 0 ? (
              <div className="text-center sm:py-16 py-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-medium text-gray-700">
                  No best sellers at the moment
                </h3>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 gap-2">
                {filteredProducts.map((product) => (
                  <div key={product._id}>{renderProductCard(product)}</div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
