'use client'
import React, { useContext, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import OrderSummary from "../components/OrderSummary";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import { FiX, FiArrowLeft, FiPlus, FiMinus, FiHeart, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateCartItemQuantity,
    calculateCartTotal,
    toggleWishlist,
    isInWishlist,
    addToCart,
  } = useContext(AppContext);

  // Recommended products state
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [recLoading, setRecLoading] = useState(true);
  const [recError, setRecError] = useState("");
  const [selectedVariants, setSelectedVariants] = useState({});

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/recommended/active`);
        if (res.data.success) {
          setRecommendedProducts(res.data.data || []);
        } else {
          setRecError("Failed to load recommendations");
        }
      } catch (err) {
        console.error("Error fetching recommended:", err);
        setRecError("Could not load recommendations");
      } finally {
        setRecLoading(false);
      }
    };
    fetchRecommended();
  }, []);

  // Variant selection
  const selectVariant = (productId, variantIndex) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variantIndex,
    }));
  };

  const handleAddToCart = (product) => {
    const selectedIndex = selectedVariants[product._id] ?? 0;
    const variant = product.variant?.[selectedIndex];

    if (!variant || product.stock <= 0 || variant.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    addToCart(product, variant, 1);
    toast.success(`${product.name} added to the cart`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // --------------------------------------------------------------
  // Shopify‑style Recommended Product Card
  // --------------------------------------------------------------
  const renderRecommendedCard = (product) => {
    const selectedIndex = selectedVariants[product._id] ?? 0;
    const hasVariants = Array.isArray(product.variant) && product.variant.length > 0;
    const safeIndex = hasVariants
      ? Math.min(Math.max(selectedIndex, 0), product.variant.length - 1)
      : 0;
    const variant = hasVariants ? product.variant[safeIndex] : null;
    const mainImg = variant?.image || product.thumbImg;
    const price = variant?.discountPrice || variant?.price || 0;
    const originalPrice = variant?.price || 0;
    const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
    const outOfStock = product.stock <= 0 || !variant || variant.stock <= 0;

    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100/80"
      >
        {/* Image */}
        <Link
          href={`/frontend/ProductDetail/${product.slug}`}
          className="relative block aspect-square overflow-hidden bg-gray-50"
        >
          <img
            src={`${API_BASE}${mainImg}`}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-base font-bold text-gray-900">₹{price.toLocaleString()}</span>
            {discount > 0 && (
              <>
                <span className="text-xs text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>
                <span className="text-xs font-semibold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Variant swatches */}
          {hasVariants && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {product.variant.map((v, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    selectVariant(product._id, i);
                  }}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    i === safeIndex
                      ? 'border-[#8D6AF8] ring-1 ring-[#8D6AF8]/30'
                      : 'border-gray-300 hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: v.colorcode || '#000' }}
                  title={v.color || `Variant ${i+1}`}
                />
              ))}
            </div>
          )}

          {/* Add to Cart – pill button */}
          <button
            onClick={() => handleAddToCart(product)}
            disabled={outOfStock}
            className={`mt-3 w-full py-1.5 text-sm font-medium rounded-full transition-colors ${
              outOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'border border-[#8D6AF8] text-[#8D6AF8] hover:bg-[#8D6AF8] hover:text-white'
            }`}
          >
            {outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </motion.div>
    );
  };

  // --------------------------------------------------------------
  // Main cart rendering (unchanged)
  // --------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 border border-gray-400">
        {/* Page Header - unchanged */}
        <div className="bg-white py-4 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Your Shopping Cart
                </h1>
                <span className="ml-4 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                  {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              <Link
                href="/frontend/view-all"
                className="mt-4 md:mt-0 inline-flex items-center text-[#8D6AF8] hover:text-[#7159bb] transition-colors"
              >
                <FiArrowLeft className="mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Cart Content - unchanged */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items Section - unchanged */}
            <div className="w-full">
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-md p-8 text-center"
                >
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <FiX className="w-12 h-12 text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Your cart is empty
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Looks like you haven't added any items to your cart yet.
                  </p>
                  <Link
                    href="/frontend/view-all"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-[#7e5cc2] to-[#6b40c2] hover:from-[#744ac9] hover:to-[#6b40c2] transition-all duration-200"
                  >
                    Start Shopping
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  {/* Desktop Table Header */}
                  <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="col-span-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Product
                    </div>
                    <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                      Price
                    </div>
                    <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                      Quantity
                    </div>
                    <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                      Subtotal
                    </div>
                  </div>

                  {/* Cart Items */}
                  <ul className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <motion.li
                        key={`${item._id}-${item.color}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 md:p-6 hover:bg-gray-50/50 transition-colors"
                      >
                        {(() => {
                          const imageFromVariant = item?.variant?.image
                            ? `${API_BASE}${item.variant.image}`
                            : null;
                          const imageFromItem = item?.image
                            ? String(item.image).startsWith("http")
                              ? String(item.image)
                              : `${API_BASE}${item.image}`
                            : null;
                          const displayImage = imageFromVariant || imageFromItem || "/placeholder.png";
                          const itemId = item?._id || item?.id;

                          return (
                            <div className="grid grid-cols-12 gap-4 items-center">
                              {/* Product Info */}
                              <div className="col-span-12 md:col-span-6 flex items-center space-x-4">
                                <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                  <Image
                                    src={displayImage}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                  />
                                </div>
                                <div>
                                  <h3 className="text-base font-medium text-gray-900">
                                    {item.name}
                                  </h3>
                                  <p className="text-sm text-gray-500 mt-1">
                                    Color: <span className="capitalize font-medium">{item.color}</span>
                                  </p>
                                  <button
                                    onClick={() => removeFromCart(itemId, item.color)}
                                    className="mt-2 flex items-center text-sm text-gray-500 hover:text-red-600 transition-colors"
                                  >
                                    <FiX className="mr-1" /> Remove
                                  </button>
                                </div>
                              </div>

                              {/* Price */}
                              <div className="col-span-4 md:col-span-2 text-right">
                                <p className="text-base font-medium text-gray-900">
                                  ₹{item.price.toLocaleString()}
                                </p>
                                {item.originalPrice && (
                                  <p className="text-xs text-gray-400 line-through">
                                    ₹{item.originalPrice.toLocaleString()}
                                  </p>
                                )}
                              </div>

                              {/* Quantity */}
                              <div className="col-span-4 md:col-span-2">
                                <div className="flex items-center justify-center md:justify-start border border-gray-300 rounded-md w-fit">
                                  <button
                                    onClick={() =>
                                      updateCartItemQuantity(itemId, item.color, item.quantity - 1)
                                    }
                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-l-md transition-colors"
                                    disabled={item.quantity <= 1}
                                  >
                                    <FiMinus className="w-4 h-4" />
                                  </button>
                                  <span className="px-4 py-2 bg-white text-center text-gray-900 font-medium">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateCartItemQuantity(itemId, item.color, item.quantity + 1)
                                    }
                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-r-md transition-colors"
                                  >
                                    <FiPlus className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Subtotal */}
                              <div className="col-span-4 md:col-span-2 text-right">
                                <p className="text-base font-medium text-gray-900">
                                  ₹{(item.price * item.quantity).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          );
                        })()}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>

            {/* Order Summary */}
            {cartItems.length > 0 && (
              <div className="lg:w-1/3">
                <OrderSummary subtotal={calculateCartTotal()} />
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* SHOPIFY‑STYLE RECOMMENDED SECTION – Fresh & Premium */}
        {/* ============================================================ */}
        {!recLoading && !recError && recommendedProducts.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50/50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section Header */}
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
                    You may also like
                  </h2>
                  <div className="w-12 h-0.5 bg-[#8D6AF8] mt-1.5 rounded-full" />
                </div>
                {/* <Link
                  href="/frontend/view-all"
                  className="text-sm text-[#8D6AF8] hover:text-[#7159bb] font-medium flex items-center gap-1 transition-colors"
                >
                  View all <FiArrowRight className="w-4 h-4" />
                </Link> */}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {recommendedProducts.map((product) => (
                  <div key={product._id}>{renderRecommendedCard(product)}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {recLoading && (
          <div className="border-t border-gray-200 bg-gray-50/50 py-16">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#8D6AF8] border-t-transparent" />
            </div>
          </div>
        )}

        {recError && !recLoading && (
          <div className="border-t border-gray-200 bg-gray-50/50 py-12 text-center text-gray-500">
            {recError}
          </div>
        )}

        {!recLoading && !recError && recommendedProducts.length === 0 && (
          <div className="border-t border-gray-200 bg-gray-50/50 py-12 text-center text-gray-500">
            No recommendations available at the moment.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;