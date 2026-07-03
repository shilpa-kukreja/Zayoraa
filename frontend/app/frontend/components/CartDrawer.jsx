"use client";

import React, { useContext } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { AppContext } from "../context/AppContext";
import OrderSummary from "./OrderSummary";

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
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween" }}
            className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Your Cart ({cartItems.length})
              </h2>
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
                    <li
                      key={`${item._id || item.id}-${item.color}`}
                      className="flex gap-4 border-b pb-4"
                    >
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
                            onClick={() =>
                              removeFromCart(item._id || item.id, item.color)
                            }
                            className="text-gray-500 hover:text-red-500"
                            aria-label="Remove item"
                          >
                            <FiX />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 capitalize">
                          Color: {item.color}
                        </p>
                        <p className="font-semibold">
                          ₹{item.price.toLocaleString()}
                        </p>
                        <div className="flex items-center mt-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartItemQuantity(
                                item._id || item.id,
                                item.color,
                                item.quantity - 1,
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
                                item.quantity + 1,
                              )
                            }
                            className="px-2 py-1 border rounded-r-md"
                            disabled={item.quantity >= Math.min(item.stock, 30)}
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













// "use client";

// import React, { useContext, useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import { motion, AnimatePresence } from "framer-motion";
// import { FiX } from "react-icons/fi";
// import { AppContext } from "../context/AppContext";
// import OrderSummary from "./OrderSummary";

// const CartDrawer = () => {
//   const {
//     isCartOpen,
//     setIsCartOpen,
//     cartItems,
//     removeFromCart,
//     updateCartItemQuantity,
//     calculateCartTotal,
//   } = useContext(AppContext);

//   // Track which items are blinking (key = `${id}-${color}`)
//   const [blinkingKeys, setBlinkingKeys] = useState(new Set());
//   const prevCartItemsRef = useRef(cartItems);
//   const timeoutsRef = useRef({});
//   const isMounted = useRef(false); // ✅ key fix: skip first effect run

//   const getItemKey = (item) => `${item._id || item.id}-${item.color}`;

//   useEffect(() => {
//     // ✅ On mount, just store the current cart and skip blinking logic
//     if (!isMounted.current) {
//       isMounted.current = true;
//       prevCartItemsRef.current = cartItems;
//       return;
//     }

//     const prev = prevCartItemsRef.current;
//     const current = cartItems;

//     const prevMap = new Map();
//     prev.forEach((item) => {
//       prevMap.set(getItemKey(item), item.quantity);
//     });
//     const currentMap = new Map();
//     current.forEach((item) => {
//       currentMap.set(getItemKey(item), item.quantity);
//     });

//     const newKeys = [];
//     currentMap.forEach((qty, key) => {
//       // Only trigger if the item is completely new OR its quantity increased
//       if (!prevMap.has(key) || qty > prevMap.get(key)) {
//         newKeys.push(key);
//       }
//     });

//     if (newKeys.length > 0) {
//       setBlinkingKeys((prevSet) => {
//         const updated = new Set(prevSet);
//         newKeys.forEach((k) => updated.add(k));
//         return updated;
//       });

//       newKeys.forEach((key) => {
//         if (timeoutsRef.current[key]) {
//           clearTimeout(timeoutsRef.current[key]);
//         }
//         const timeoutId = setTimeout(() => {
//           setBlinkingKeys((prevSet) => {
//             const updated = new Set(prevSet);
//             updated.delete(key);
//             return updated;
//           });
//           delete timeoutsRef.current[key];
//         }, 5000);
//         timeoutsRef.current[key] = timeoutId;
//       });
//     }

//     prevCartItemsRef.current = current;

//     return () => {
//       Object.values(timeoutsRef.current).forEach((id) => clearTimeout(id));
//       timeoutsRef.current = {};
//     };
//   }, [cartItems]);

//   return (
//     <AnimatePresence>
//       {isCartOpen && (
//         <>
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/30 z-40"
//             onClick={() => setIsCartOpen(false)}
//           />

//           <motion.div
//             initial={{ opacity: 0, x: "100%" }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: "100%" }}
//             transition={{ type: "tween" }}
//             className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col"
//           >
//             <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//               <h2 className="text-lg font-semibold">
//                 Your Cart ({cartItems.length})
//               </h2>
//               <button
//                 type="button"
//                 onClick={() => setIsCartOpen(false)}
//                 className="p-2 rounded-full hover:bg-gray-100"
//                 aria-label="Close cart"
//               >
//                 <FiX className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto p-4">
//               {cartItems.length === 0 ? (
//                 <div className="text-center py-10">
//                   <p className="text-gray-500 mb-4">Your cart is empty</p>
//                   <button
//                     type="button"
//                     onClick={() => setIsCartOpen(false)}
//                     className="px-4 py-2 bg-[#8D6AF8] text-white rounded-md hover:bg-[#7159bb]"
//                   >
//                     Continue Shopping
//                   </button>
//                 </div>
//               ) : (
//                 <ul className="space-y-4">
//                   {cartItems.map((item) => {
//                     const key = getItemKey(item);
//                     const isBlinking = blinkingKeys.has(key);

//                     return (
//                       <li
//                         key={key}
//                         className={`flex gap-4 border-b pb-4 p-2 rounded-lg transition-colors ${
//                           isBlinking ? "blinking-card" : "border-gray-200"
//                         }`}
//                       >
//                         <div
//                           className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 ${
//                             isBlinking ? "blinking-image" : "border border-gray-200"
//                           }`}
//                         >
//                           <Image
//                             src={item.image}
//                             alt={item.name}
//                             width={80}
//                             height={80}
//                             className="object-cover w-full h-full"
//                           />
//                         </div>
//                         <div className="flex-1">
//                           <div className="flex justify-between">
//                             <h3 className="font-medium">{item.name}</h3>
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 removeFromCart(item._id || item.id, item.color)
//                               }
//                               className="text-gray-500 hover:text-red-500"
//                               aria-label="Remove item"
//                             >
//                               <FiX />
//                             </button>
//                           </div>
//                           <p className="text-sm text-gray-600 capitalize">
//                             Color: {item.color}
//                           </p>
//                           <p className="font-semibold">
//                             ₹{item.price.toLocaleString()}
//                           </p>
//                           <div className="flex items-center mt-2">
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 updateCartItemQuantity(
//                                   item._id || item.id,
//                                   item.color,
//                                   item.quantity - 1,
//                                 )
//                               }
//                               className="px-2 py-1 border rounded-l-md"
//                               disabled={item.quantity <= 1}
//                             >
//                               -
//                             </button>
//                             <span className="px-4 py-1 border-t border-b text-center w-12">
//                               {item.quantity}
//                             </span>
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 updateCartItemQuantity(
//                                   item._id || item.id,
//                                   item.color,
//                                   item.quantity + 1,
//                                 )
//                               }
//                               className="px-2 py-1 border rounded-r-md"
//                               disabled={
//                                 item.quantity >= Math.min(item.stock, 30)
//                               }
//                             >
//                               +
//                             </button>
//                           </div>
//                         </div>
//                       </li>
//                     );
//                   })}
//                 </ul>
//               )}
//             </div>

//             {cartItems.length > 0 && (
//               <div>
//                 <OrderSummary subtotal={calculateCartTotal()} />
//               </div>
//             )}
//           </motion.div>
//         </>
//       )}

//       <style jsx>{`
//         /* Blinking card border */
//         @keyframes blinkBorderViolet {
//           0% {
//             border-color: rgba(141, 106, 248, 0.3);
//             box-shadow: 0 0 0 0 rgba(141, 106, 248, 0);
//           }
//           25% {
//             border-color: rgba(141, 106, 248, 0.7);
//             box-shadow: 0 0 4px 1px rgba(141, 106, 248, 0.3);
//           }
//           50% {
//             border-color: #8D6AF8;
//             box-shadow: 0 0 8px 2px rgba(141, 106, 248, 0.5);
//           }
//           75% {
//             border-color: rgba(141, 106, 248, 0.7);
//             box-shadow: 0 0 4px 1px rgba(141, 106, 248, 0.3);
//           }
//           100% {
//             border-color: rgba(141, 106, 248, 0.3);
//             box-shadow: 0 0 0 0 rgba(141, 106, 248, 0);
//           }
//         }
//         .blinking-card {
//           border: 2px solid transparent;
//           animation: blinkBorderViolet 0.8s ease-in-out 6;
//           border-radius: 8px;
//         }

//         /* Blinking image border */
//         @keyframes blinkImageBorder {
//           0% {
//             border-color: rgba(141, 106, 248, 0.2);
//           }
//           50% {
//             border-color: #8D6AF8;
//           }
//           100% {
//             border-color: rgba(141, 106, 248, 0.2);
//           }
//         }
//         .blinking-image {
//           border: 2px solid transparent;
//           animation: blinkImageBorder 0.8s ease-in-out 6;
//         }
//       `}</style>
//     </AnimatePresence>
//   );
// };

// export default CartDrawer;




