'use client'
import React, { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import OrderSummary from "../components/OrderSummary";
import { AppContext } from "../context/AppContext";
import { FiX, FiArrowLeft, FiPlus, FiMinus, FiChevronDown, FiChevronUp } from "react-icons/fi";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateCartItemQuantity, 
    calculateCartTotal,
    setIsCartOpen,
    router
  } = useContext(AppContext);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 border border-gray-400">
        {/* Page Header */}
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

        {/* Cart Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items Section */}
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
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
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
                            ? `http://localhost:5000${item.variant.image}`
                            : null;
                          const imageFromItem = item?.image
                            ? (String(item.image).startsWith("http")
                              ? String(item.image)
                              : `http://localhost:5000${item.image}`)
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
                                onClick={() => updateCartItemQuantity(
                                  itemId, 
                                  item.color, 
                                  item.quantity - 1
                                )}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-l-md transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <FiMinus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 bg-white text-center text-gray-900 font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateCartItemQuantity(
                                  itemId, 
                                  item.color, 
                                  item.quantity + 1
                                )}
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
                <OrderSummary 
                  subtotal={calculateCartTotal()} 
                  // onCheckout={() => {
                  //   setIsCartOpen(false);
                  //   router.push('/checkout');
                  // }} 
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;