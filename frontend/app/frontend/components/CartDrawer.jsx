'use client';

import React, { useContext } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { AppContext } from '../context/AppContext';
import OrderSummary from './OrderSummary';

const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    removeFromCart,
    updateCartItemQuantity,
    calculateCartTotal,
  } = useContext(AppContext);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setIsCartOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Your Cart ({cartItems.length})</h2>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Close cart"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="px-4 py-2 bg-[#8D6AF8] text-white rounded-md hover:bg-[#7159bb]"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {cartItems.map((item) => (
                    <li key={`${item._id || item.id}-${item.color}`} className="flex gap-4 border-b pb-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.name}</h3>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item._id || item.id, item.color)}
                            className="text-gray-500 hover:text-red-500"
                            aria-label="Remove item"
                          >
                            <FiX />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 capitalize">Color: {item.color}</p>
                        <p className="font-semibold">₹{item.price.toLocaleString()}</p>
                        <div className="flex items-center mt-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartItemQuantity(
                                item._id || item.id,
                                item.color,
                                item.quantity - 1
                              )
                            }
                            className="px-2 py-1 border rounded-l-md"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-4 py-1 border-t border-b text-center w-12">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartItemQuantity(
                                item._id || item.id,
                                item.color,
                                item.quantity + 1
                              )
                            }
                            className="px-2 py-1 border rounded-r-md"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cartItems.length > 0 && (
              <div>
                <OrderSummary subtotal={calculateCartTotal()} />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
