'use client'
import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FiHeart, FiX, FiShoppingBag } from 'react-icons/fi';
import { AppContext } from '../context/AppContext';


const WishlistPopup = () => {
  const { 
    wishlist, 
    isWishlistOpen, 
    setIsWishlistOpen,
    toggleWishlist,
    addToCart
  } = useContext(AppContext);

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0  bg-opacity-50 z-40"
            onClick={() => setIsWishlistOpen(false)}
          />
          
          {/* Wishlist Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FiHeart className="text-pink-500" />
                Your Wishlist ({wishlist.length})
              </h2>
              <button 
                onClick={() => setIsWishlistOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            {/* Wishlist Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {wishlist.length === 0 ? (
                <div className="text-center py-10">
                  <FiHeart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Your wishlist is empty
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Save your favorite items here to view them later
                  </p>
                  <button
                    onClick={() => setIsWishlistOpen(false)}
                    className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {wishlist.map((product) => (
                    <li key={product._id} className="flex gap-4 pb-4 border-b">
                      {(() => {
                        const idx = Number.isFinite(Number(product?.wishlistVariantIndex))
                          ? Number(product.wishlistVariantIndex)
                          : 0;
                        const safeIdx = Array.isArray(product.variant) && product.variant.length > 0
                          ? Math.min(Math.max(idx, 0), product.variant.length - 1)
                          : 0;

                        const variant = Array.isArray(product.variant) && product.variant.length > 0
                          ? product.variant[safeIdx]
                          : null;
                        const img = variant?.image || product.thumbImg;
                        const price = variant?.discountPrice ?? 0;
                        const originalPrice = variant?.price ?? 0;

                        return (
                          <>
                            <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                              <Image
                                src={`http://localhost:5000${img}`}
                                alt={product.name}
                                width={80}
                                height={80}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h3 className="font-medium text-gray-800">{product.name}</h3>
                                <button 
                                  onClick={() => toggleWishlist(product)}
                                  className="text-gray-500 hover:text-pink-500"
                                >
                                  <FiX />
                                </button>
                              </div>
                              {variant?.color && (
                                <p className="text-xs text-gray-500 mt-0.5 mb-2 capitalize">
                                  Color: <span className="font-medium text-gray-700">{variant.color}</span>
                                </p>
                              )}
                              <p className="text-sm text-gray-600 mb-2">
                                ₹{Number(price).toLocaleString()}
                                {originalPrice > price && (
                                  <span className="ml-2 text-xs text-gray-400 line-through">
                                    ₹{Number(originalPrice).toLocaleString()}
                                  </span>
                                )}
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    if (variant) {
                                      addToCart(product, variant, 1);
                                      // remove from wishlist after successful add
                                      toggleWishlist(product);
                                    }
                                    setIsWishlistOpen(false);
                                  }}
                                  className="flex-1 py-1 px-2 bg-pink-500 text-white text-sm rounded-md hover:bg-pink-600 flex items-center justify-center gap-1"
                                >
                                  <FiShoppingBag className="w-3 h-3" />
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Footer (visible only when items exist) */}
            {wishlist.length > 0 && (
              <div className="border-t border-gray-200 p-4">
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="w-full py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WishlistPopup;