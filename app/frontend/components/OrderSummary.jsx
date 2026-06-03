// 'use client'
// import React, { useContext, useState } from "react";
// import { AppContext } from "../context/AppContext";
// import { addressDummyData } from "@/public/assets";
// import { FiChevronDown, FiPlus, FiX, FiUser, FiPhone, FiMapPin, FiHome, FiBriefcase } from "react-icons/fi";
// import { motion, AnimatePresence } from "framer-motion";
// import { MdOutlineEmail } from "react-icons/md";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// const OrderSummary = ({ subtotal, onCheckout }) => {
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
//   const [promoCode, setPromoCode] = useState("");
//   const [userAddresses, setUserAddresses] = useState([]);
//   const { cartItems } = useContext(AppContext);
//   const router = useRouter();

//   // New address form state
//   const [newAddress, setNewAddress] = useState({
//     fullName: '',
//     phoneNumber: '',
//     addressLine1: '',
//     addressLine2: '',
//     city: '',
//     state: '',
//     pincode: '',
//     landmark: '',
//     addressType: 'home'
//   });

//   // const fetchUserAddresses = async () => {
//   //   // Simulate API call
//   //   setUserAddresses(addressDummyData);
//   // };

//   const handleAddressSelect = (address) => {
//     setSelectedAddress(address);
//     setIsDropdownOpen(false);
//   };

//   const handleAddAddress = () => {
//     setIsDropdownOpen(false);
//     setIsAddAddressOpen(true);
//   };

//    const applyCoupon = async () => {
//         try {
//             const totalAmount = cartTotal; // Total before discount

//             const { data } = await axios.post(
//                 "http://localhost:5000/api/coupons/apply",
//                 { couponCode, totalAmount },
//                 { headers: { token } }

//             );


//             if (data.success) {
//                 setDiscount(data.discount);
//                 setTotalAfterDiscount(data.newTotalAmount); // Update total price in UI
//                 console.log(data.newTotalAmount);
//                 toast.success(
//                     `Coupon applied successfully! You saved ₹${data.discount}`
//                 );
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             console.error(error);
//             toast.error("Failed to apply coupon");
//         }
//     };


//   const handleNewAddressChange = (e) => {
//     const { name, value } = e.target;
//     setNewAddress(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSaveAddress = (e) => {
//     e.preventDefault();
//     // Add validation here
//     const updatedAddresses = [...userAddresses, newAddress];
//     setUserAddresses(updatedAddresses);
//     setSelectedAddress(newAddress);
//     setIsAddAddressOpen(false);
//     // Reset form
//     setNewAddress({
//       fullName: '',
//       phoneNumber: '',
//       email: '',
//       addressLine1: '',
//       addressLine2: '',
//       city: '',
//       state: '',
//       pincode: '',
//       landmark: '',
//       addressType: 'home'
//     });
//   };

//   // const createOrder = () => {
//   //   if (!selectedAddress) {
//   //     alert("Please select a delivery address");
//   //     return;
//   //   }
//   //   onCheckout();
//   // };



//   const createOrder = () => {
//     // if (!selectedAddress) {
//     //   alert("Please select a delivery address");
//     //   return;
//     // }

//     const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

//     if (token) {
//       // ✅ User logged in → go checkout
//       onCheckout();
//       router.push("/frontend/checkout");
//     } else {
//       // ❌ No login → go signin, with ?from=checkout so we know where they came from
//       router.push("/frontend/signin?from=checkout");
//     }
//   };
//   // React.useEffect(() => {
//   //   fetchUserAddresses();
//   // }, []);

//   const taxAmount = Math.floor(subtotal * 0.02);
//   const totalAmount = subtotal + taxAmount;

//   return (
//     <>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white rounded-xl shadow-md overflow-hidden sticky top-6"
//       >
//         <div className="p-6">
//           <h2 className="text-xl font-semibold text-gray-900 mb-6">
//             Order Summary
//           </h2>

//           {/* Address Selection */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Delivery Address
//             </label>
//             <div className="relative">
//               <button
//                 className={`w-full flex justify-between items-center px-4 py-3 bg-white border ${selectedAddress ? "border-gray-300" : "border-red-300"
//                   } rounded-lg shadow-sm text-left`}
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               >
//                 <span className="truncate">
//                   {selectedAddress ? (
//                     <>
//                       <span className="font-medium">{selectedAddress.fullName}</span>
//                       <span className="text-gray-600 ml-2">
//                         {selectedAddress.area}, {selectedAddress.city}
//                       </span>
//                     </>
//                   ) : (
//                     <span className="text-gray-500">Select delivery address</span>
//                   )}
//                 </span>
//                 {isDropdownOpen ? (
//                   <FiChevronDown className="w-5 h-5 text-gray-500 transform rotate-180" />
//                 ) : (
//                   <FiChevronDown className="w-5 h-5 text-gray-500" />
//                 )}
//               </button>

//               <AnimatePresence>
//                 {isDropdownOpen && (
//                   <motion.ul
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden"
//                   >
//                     {userAddresses.map((address, index) => (
//                       <li
//                         key={index}
//                         className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0"
//                         onClick={() => handleAddressSelect(address)}
//                       >
//                         <div className="font-medium">{address.fullName}</div>
//                         <div className="text-sm text-gray-600">
//                           {address.area}, {address.city}, {address.state} - {address.pincode}
//                         </div>
//                         <div className="text-sm mt-1">{address.phoneNumber}</div>
//                       </li>
//                     ))}
//                     <li
//                       onClick={handleAddAddress}
//                       className="px-4 py-3 bg-gray-50 hover:bg-gray-100 cursor-pointer text-center text-blue-600 font-medium flex items-center justify-center"
//                     >
//                       <FiPlus className="mr-2" />
//                       Add New Address
//                     </li>
//                   </motion.ul>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>

//           {/* Promo Code */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Promo Code
//             </label>
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 value={promoCode}
//                 onChange={(e) => setPromoCode(e.target.value)}
//                 placeholder="Enter promo code"
//                 className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2  outline-none"
//               />
//               <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
//                 Apply
//               </button>
//             </div>
//           </div>

//           {/* Order Breakdown */}
//           <div className="space-y-3 mb-6">
//             <div className="flex justify-between">
//               <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
//               <span className="font-medium">₹{subtotal.toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Shipping</span>
//               <span className="font-medium text-green-600">FREE</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Tax (2%)</span>
//               <span className="font-medium">₹{taxAmount.toLocaleString()}</span>
//             </div>
//             <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between text-lg font-bold">
//               <span>Total</span>
//               <span>₹{totalAmount.toLocaleString()}</span>
//             </div>
//           </div>

//           {/* Checkout Button */}
//           <button
//             onClick={createOrder}
//             className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md transition-all duration-200"
//           >
//             Proceed to Checkout
//           </button>

//         </div>
//       </motion.div>

//       {/* Add Address Modal */}
//       <AnimatePresence>
//         {isAddAddressOpen && (
//           <div className="fixed pt-16 inset-0 z-50 overflow-y-auto">
//             <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//               {/* Background overlay */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="fixed inset-0 transition-opacity"
//                 aria-hidden="true"
//               >
//                 <div className="absolute inset-0 bg-opacity-75"></div>
//               </motion.div>

//               {/* Modal content */}
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.95 }}
//                 className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
//                 role="dialog"
//                 aria-modal="true"
//                 aria-labelledby="modal-headline"
//               >
//                 <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
//                       Add New Address
//                     </h3>
//                     <button
//                       onClick={() => setIsAddAddressOpen(false)}
//                       className="text-gray-400 z-10 cursor-pointer hover:text-gray-500"
//                     >
//                       <FiX className="h-6 w-6" />
//                     </button>
//                   </div>

//                   <form onSubmit={handleSaveAddress}>
//                     <div className="space-y-4">
//                       {/* Full Name */}
//                       <div className="relative">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                           <FiUser className="h-5 w-5 text-gray-400" />
//                         </div>
//                         <input
//                           type="text"
//                           name="fullName"
//                           value={newAddress.fullName}
//                           onChange={handleNewAddressChange}
//                           placeholder="Full Name"
//                           required
//                           className="pl-10 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2  outline-none"
//                         />
//                       </div>

//                       {/* Phone Number */}
//                       <div className="relative">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                           <MdOutlineEmail className="h-5 w-5 text-gray-400" />
//                         </div>
//                         <input
//                           type="email"
//                           name="Email"
//                           value={newAddress.email}
//                           onChange={handleNewAddressChange}
//                           placeholder="Email"
//                           required
//                           className="pl-10 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2  outline-none"
//                         />
//                       </div>

//                       {/* Phone Number */}
//                       <div className="relative">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                           <FiPhone className="h-5 w-5 text-gray-400" />
//                         </div>
//                         <input
//                           type="tel"
//                           name="phoneNumber"
//                           value={newAddress.phoneNumber}
//                           onChange={handleNewAddressChange}
//                           placeholder="Phone Number"
//                           required
//                           className="pl-10 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2  outline-none"
//                         />
//                       </div>

//                       {/* Address Line 1 */}
//                       <div className="relative">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                           <FiMapPin className="h-5 w-5 text-gray-400" />
//                         </div>
//                         <input
//                           type="text"
//                           name="addressLine1"
//                           value={newAddress.addressLine1}
//                           onChange={handleNewAddressChange}
//                           placeholder="Address Line 1 (House No., Building)"
//                           required
//                           className="pl-10 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2  outline-none"
//                         />
//                       </div>

//                       {/* Address Line 2 */}
//                       <input
//                         type="text"
//                         name="addressLine2"
//                         value={newAddress.addressLine2}
//                         onChange={handleNewAddressChange}
//                         placeholder="Address Line 2 (Area, Colony)"
//                         className="block w-full relative border z-20 border-gray-300 rounded-lg py-2 px-3 focus:ring-2  outline-none"
//                       />

//                       {/* City, State, Pincode */}
//                       <div className=" relative grid grid-cols-1 z-10 md:grid-cols-3 gap-4">
//                         <div>
//                           <input
//                             type="text"
//                             name="city"
//                             value={newAddress.city}
//                             onChange={handleNewAddressChange}
//                             placeholder="City"
//                             required
//                             className="block w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2  outline-none"
//                           />
//                         </div>
//                         <div>
//                           <input
//                             type="text"
//                             name="state"
//                             value={newAddress.state}
//                             onChange={handleNewAddressChange}
//                             placeholder="State"
//                             required
//                             className="block w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2  outline-none"
//                           />
//                         </div>
//                         <div>
//                           <input
//                             type="text"
//                             name="pincode"
//                             value={newAddress.pincode}
//                             onChange={handleNewAddressChange}
//                             placeholder="Pincode"
//                             required
//                             className="block w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 outline-none"
//                           />
//                         </div>
//                       </div>

//                       {/* Landmark */}
//                       <input
//                         type="text"
//                         name="landmark"
//                         value={newAddress.landmark}
//                         onChange={handleNewAddressChange}
//                         placeholder="Landmark (Optional)"
//                         className="block w-full border relative border-gray-300 rounded-lg py-2 px-3 focus:ring-2  outline-none"
//                       />

//                       {/* Address Type */}
//                       <div className="space-y-2">
//                         <p className="text-sm font-medium text-gray-700">Address Type</p>
//                         <div className="flex space-x-4">
//                           <label className="inline-flex items-center">
//                             <input
//                               type="radio"
//                               name="addressType"
//                               value="home"
//                               checked={newAddress.addressType === 'home'}
//                               onChange={handleNewAddressChange}
//                               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                             />
//                             <span className="ml-2 text-gray-700 flex items-center">
//                               <FiHome className="mr-1" /> Home
//                             </span>
//                           </label>
//                           <label className="inline-flex items-center">
//                             <input
//                               type="radio"
//                               name="addressType"
//                               value="work"
//                               checked={newAddress.addressType === 'work'}
//                               onChange={handleNewAddressChange}
//                               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                             />
//                             <span className="ml-2 text-gray-700 flex items-center">
//                               <FiBriefcase className="mr-1" /> Work
//                             </span>
//                           </label>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mt-6 flex justify-end space-x-3">
//                       <button
//                         type="button"
//                         onClick={() => setIsAddAddressOpen(false)}
//                         className="px-4 py-2 z-20 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none "
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         className="px-4 py-2 z-10 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 "
//                       >
//                         Save Address
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </motion.div>
//             </div>
//           </div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default OrderSummary;



// 'use client';
// import React, { useContext, useState } from "react";
// import { AppContext } from "../context/AppContext";
// import { FiChevronDown, FiPlus, FiX, FiUser, FiPhone, FiMapPin, FiHome, FiBriefcase } from "react-icons/fi";
// import { motion, AnimatePresence } from "framer-motion";
// import { MdOutlineEmail } from "react-icons/md";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import toast from "react-hot-toast";

// const OrderSummary = ({ subtotal, onCheckout }) => {
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
//   const [promoCode, setPromoCode] = useState("");
//   const [userAddresses, setUserAddresses] = useState([]);
//   const [discount, setDiscount] = useState(0);
//   const [totalAfterDiscount, setTotalAfterDiscount] = useState(subtotal);

//   const { cartItems } = useContext(AppContext);
//   const router = useRouter();

//   // New address form state
//   const [newAddress, setNewAddress] = useState({
//     fullName: '',
//     email: '',
//     phoneNumber: '',
//     addressLine1: '',
//     addressLine2: '',
//     city: '',
//     state: '',
//     pincode: '',
//     landmark: '',
//     addressType: 'home'
//   });

//   // Handle address selection
//   const handleAddressSelect = (address) => {
//     setSelectedAddress(address);
//     setIsDropdownOpen(false);
//   };

//   const handleAddAddress = () => {
//     setIsDropdownOpen(false);
//     setIsAddAddressOpen(true);
//   };

//   // Coupon apply logic
//   const applyCoupon = async () => {
//     try {
//       const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

//       const { data } = await axios.post(
//         "http://localhost:5000/api/coupons/apply",
//         { couponCode: promoCode, totalAmount: subtotal },
//         { headers: { token } }
//       );

//       if (data.success) {
//         setDiscount(data.discount);
//         setTotalAfterDiscount(data.newTotalAmount);
//         toast.success(`Coupon applied! You saved ₹${data.discount}`);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to apply coupon");
//     }
//   };

//   // Handle new address form input
//   const handleNewAddressChange = (e) => {
//     const { name, value } = e.target;
//     setNewAddress((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSaveAddress = (e) => {
//     e.preventDefault();
//     const updatedAddresses = [...userAddresses, newAddress];
//     setUserAddresses(updatedAddresses);
//     setSelectedAddress(newAddress);
//     setIsAddAddressOpen(false);
//     // Reset form
//     setNewAddress({
//       fullName: '',
//       email: '',
//       phoneNumber: '',
//       addressLine1: '',
//       addressLine2: '',
//       city: '',
//       state: '',
//       pincode: '',
//       landmark: '',
//       addressType: 'home'
//     });
//   };

//   // Checkout navigation
//   const createOrder = () => {
//     const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
//     if (token) {
//       onCheckout();
//       router.push("/frontend/checkout"); // adjust path if different
//     } else {
//       router.push("/frontend/signin?from=checkout");
//     }
//   };

//   // Tax calculation
//   const taxAmount = Math.floor(subtotal * 0.02);
//   const grossTotal = subtotal + taxAmount;
//   const finalTotal = discount > 0 ? totalAfterDiscount + taxAmount : grossTotal;

//   return (
//     <>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white rounded-xl shadow-md overflow-hidden sticky top-6"
//       >
//         <div className="p-6">
//           <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

//           {/* Address Selection */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Delivery Address
//             </label>
//             <div className="relative">
//               <button
//                 className={`w-full flex justify-between items-center px-4 py-3 bg-white border ${selectedAddress ? "border-gray-300" : "border-red-300"} rounded-lg shadow-sm text-left`}
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               >
//                 <span className="truncate">
//                   {selectedAddress ? (
//                     <>
//                       <span className="font-medium">{selectedAddress.fullName}</span>
//                       <span className="text-gray-600 ml-2">
//                         {selectedAddress.addressLine2}, {selectedAddress.city}
//                       </span>
//                     </>
//                   ) : (
//                     <span className="text-gray-500">Select delivery address</span>
//                   )}
//                 </span>
//                 <FiChevronDown
//                   className={`w-5 h-5 text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
//                 />
//               </button>

//               <AnimatePresence>
//                 {isDropdownOpen && (
//                   <motion.ul
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden"
//                   >
//                     {userAddresses.map((address, index) => (
//                       <li
//                         key={index}
//                         className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0"
//                         onClick={() => handleAddressSelect(address)}
//                       >
//                         <div className="font-medium">{address.fullName}</div>
//                         <div className="text-sm text-gray-600">
//                           {address.addressLine2}, {address.city}, {address.state} - {address.pincode}
//                         </div>
//                         <div className="text-sm mt-1">{address.phoneNumber}</div>
//                       </li>
//                     ))}
//                     <li
//                       onClick={handleAddAddress}
//                       className="px-4 py-3 bg-gray-50 hover:bg-gray-100 cursor-pointer text-center text-blue-600 font-medium flex items-center justify-center"
//                     >
//                       <FiPlus className="mr-2" />
//                       Add New Address
//                     </li>
//                   </motion.ul>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>

//           {/* Promo Code */}
//           {/* <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Promo Code
//             </label>
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 value={promoCode}
//                 onChange={(e) => setPromoCode(e.target.value)}
//                 placeholder="Enter promo code"
//                 className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 outline-none"
//               />
//               <button
//                 onClick={applyCoupon}
//                 className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
//               >
//                 Apply
//               </button>
//             </div>
//           </div> */}

//           {/* Order Breakdown */}
//           <div className="space-y-3 mb-6">
//             <div className="flex justify-between">
//               <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
//               <span className="font-medium">₹{subtotal.toLocaleString()}</span>
//             </div>
//             {discount > 0 && (
//               <div className="flex justify-between text-green-600">
//                 <span>Discount</span>
//                 <span>-₹{discount}</span>
//               </div>
//             )}
//             <div className="flex justify-between">
//               <span className="text-gray-600">Shipping</span>
//               <span className="font-medium text-green-600">FREE</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Tax (2%)</span>
//               <span className="font-medium">₹{taxAmount.toLocaleString()}</span>
//             </div>
//             <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between text-lg font-bold">
//               <span>Total</span>
//               <span>₹{finalTotal.toLocaleString()}</span>
//             </div>
//           </div>

//           {/* Checkout Button */}
//           <button
//             onClick={createOrder}
//             className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md transition-all duration-200"
//           >
//             Proceed to Checkout
//           </button>
//         </div>
//       </motion.div>

//       {/* Add Address Modal */}
//       <AnimatePresence>
//         {isAddAddressOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative"
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-medium text-gray-900">Add New Address</h3>
//                 <button
//                   onClick={() => setIsAddAddressOpen(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <FiX className="h-6 w-6" />
//                 </button>
//               </div>

//               <form onSubmit={handleSaveAddress} className="space-y-4">
//                 {/* Full Name */}
//                 <div className="relative">
//                   <FiUser className="absolute left-3 top-2.5 text-gray-400" />
//                   <input
//                     type="text"
//                     name="fullName"
//                     value={newAddress.fullName}
//                     onChange={handleNewAddressChange}
//                     placeholder="Full Name"
//                     required
//                     className="pl-10 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 outline-none"
//                   />
//                 </div>

//                 {/* Email */}
//                 <div className="relative">
//                   <MdOutlineEmail className="absolute left-3 top-2.5 text-gray-400" />
//                   <input
//                     type="email"
//                     name="email"
//                     value={newAddress.email}
//                     onChange={handleNewAddressChange}
//                     placeholder="Email"
//                     required
//                     className="pl-10 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 outline-none"
//                   />
//                 </div>

//                 {/* Phone */}
//                 <div className="relative">
//                   <FiPhone className="absolute left-3 top-2.5 text-gray-400" />
//                   <input
//                     type="tel"
//                     name="phoneNumber"
//                     value={newAddress.phoneNumber}
//                     onChange={handleNewAddressChange}
//                     placeholder="Phone Number"
//                     required
//                     maxLength={10}
//                     className="pl-10 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 outline-none"
//                   />
//                 </div>

//                 {/* Address Lines */}
//                 <input
//                   type="text"
//                   name="addressLine1"
//                   value={newAddress.addressLine1}
//                   onChange={handleNewAddressChange}
//                   placeholder="Address Line 1 (House No., Building)"
//                   required
//                   className="block w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 outline-none"
//                 />
//                 <input
//                   type="text"
//                   name="addressLine2"
//                   value={newAddress.addressLine2}
//                   onChange={handleNewAddressChange}
//                   placeholder="Address Line 2 (Area, Colony)"
//                   className="block w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 outline-none"
//                 />

//                 {/* City, State, Pincode */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <input
//                     type="text"
//                     name="city"
//                     value={newAddress.city}
//                     onChange={handleNewAddressChange}
//                     placeholder="City"
//                     required
//                     className="block w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 outline-none"
//                   />
//                   <input
//                     type="text"
//                     name="state"
//                     value={newAddress.state}
//                     onChange={handleNewAddressChange}
//                     placeholder="State"
//                     required
//                     className="block w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 outline-none"
//                   />
//                   <input
//                     type="text"
//                     name="pincode"
//                     value={newAddress.pincode}
//                     onChange={handleNewAddressChange}
//                     placeholder="Pincode"
//                     required
//                     maxLength={6}
//                     className="block w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 outline-none"
//                   />
//                 </div>

//                 {/* Landmark */}
//                 <input
//                   type="text"
//                   name="landmark"
//                   value={newAddress.landmark}
//                   onChange={handleNewAddressChange}
//                   placeholder="Landmark (Optional)"
//                   className="block w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 outline-none"
//                 />

//                 {/* Address Type */}
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium text-gray-700">Address Type</p>
//                   <div className="flex space-x-4">
//                     <label className="inline-flex items-center">
//                       <input
//                         type="radio"
//                         name="addressType"
//                         value="home"
//                         checked={newAddress.addressType === "home"}
//                         onChange={handleNewAddressChange}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <span className="ml-2 flex items-center text-gray-700">
//                         <FiHome className="mr-1" /> Home
//                       </span>
//                     </label>
//                     <label className="inline-flex items-center">
//                       <input
//                         type="radio"
//                         name="addressType"
//                         value="work"
//                         checked={newAddress.addressType === "work"}
//                         onChange={handleNewAddressChange}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <span className="ml-2 flex items-center text-gray-700">
//                         <FiBriefcase className="mr-1" /> Work
//                       </span>
//                     </label>
//                   </div>
//                 </div>

//                 <div className="mt-6 flex justify-end space-x-3">
//                   <button
//                     type="button"
//                     onClick={() => setIsAddAddressOpen(false)}
//                     className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
//                   >
//                     Save Address
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default OrderSummary;



// "use client";
// import React, { useContext, useState, useEffect } from "react";
// import { AppContext } from "../context/AppContext";
// import {
//   FiChevronDown,
//   FiPlus,
//   FiX,
//   FiUser,
//   FiPhone,
//   FiHome,
//   FiBriefcase,
//   FiCreditCard,
//   FiDollarSign,
//   FiCheck,
//   FiMapPin,
//   FiTruck,
//   FiInfo
// } from "react-icons/fi";
// import { motion, AnimatePresence } from "framer-motion";
// import { MdOutlineEmail, MdLocationOn } from "react-icons/md";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import toast from "react-hot-toast";


// let razorpayScriptPromise = null;
// function loadRazorpayScript() {
//   if (typeof window === "undefined") return Promise.resolve(false);
//   if (window.Razorpay) return Promise.resolve(true);
//   if (!razorpayScriptPromise) {
//     razorpayScriptPromise = new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.async = true;
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   }
//   return razorpayScriptPromise;
// }

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// const OrderSummary = ({ subtotal }) => {
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
//   const [checkoutStep, setCheckoutStep] = useState("address");
//   const [paymentMethod, setPaymentMethod] = useState("cod");
//   const [userAddresses, setUserAddresses] = useState([]);
//   const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

//   const [newAddress, setNewAddress] = useState({
//     fullName: "",
//     email: "",
//     phoneNumber: "",
//     addressLine1: "",
//     addressLine2: "",
//     city: "",
//     state: "",
//     pincode: "",
//     landmark: "",
//     addressType: "Home",
//   });

//   const { cartItems } = useContext(AppContext);
//   const router = useRouter();




//   useEffect(() => {
//   const token = localStorage.getItem("token");
//   axios
//   .get("http://localhost:5000/api/users/getaddress", {
//     headers: { Authorization: `Bearer ${token}` },
//   })
//   .then((res) => {
//     setUserAddresses(res.data.address || []);
//     if (!res.data.address?.length) {
//       setIsFirstTimeUser(true);
//     }
//   })
//   .catch(() => {
//     setIsFirstTimeUser(true);
//   });

// }, []);


//   const handleNewAddressChange = (e) => {
//     const { name, value } = e.target;
//     setNewAddress((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSaveAddress = async (e) => {
//     e.preventDefault();

//     const token = localStorage.getItem("token");



//     try {
//       const res =await axios.post(
//         "http://localhost:5000/api/users/addaddress",
//         {

//           fullName: newAddress.fullName,
//           email: newAddress.email,
//           phone: newAddress.phoneNumber,
//           address1: newAddress.addressLine1,
//           address2: newAddress.addressLine2,
//           addresstype: newAddress.addressType,
//           city: newAddress.city,
//           state: newAddress.state,
//           postalCode: newAddress.pincode,
//           landmark: newAddress.landmark,

//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );



//       if (res.data.success) {
//         setUserAddresses(res.data.user.address); // ✅ update with backend response
//         setSelectedAddress(res.data.user.address[res.data.user.address.length - 1]);
//         toast.success("Address added successfully!");
//         setCheckoutStep("address");
//         setIsFirstTimeUser(false);
//         setNewAddress({
//           fullName: "",
//           email: "",
//           phoneNumber: "",
//           addressLine1: "",
//           addressLine2: "",
//           city: "",
//           state: "",
//           pincode: "",
//           landmark: "",
//           addressType: "Home",
//         });
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to save address");
//     }
//   };


//   const taxAmount = Math.floor(subtotal * 0.02);
//   const grossTotal = subtotal + taxAmount;
//   const finalTotal = grossTotal;

//   const handleCheckout = () => {
//     const token =
//       typeof window !== "undefined" ? localStorage.getItem("token") : null;

//     if (!token) {
//       router.push("/frontend/signin?from=checkout");
//       return;
//     }

//     setIsCheckoutModalOpen(true);

//     // If user has no addresses, show add address form first
//     if (userAddresses.length === 0) {
//       setCheckoutStep("add-address");
//     } else {
//       setCheckoutStep("address");
//     }
//   };


//     const handleApplyCoupon = async () => {
//       if (!couponCode.trim()) {
//         setCouponError("Please enter a coupon code");
//         return;
//       }
//       try {
//         const res = await axios.post(`${API_BASE}/api/coupons/apply`, {
//           couponCode: couponCode.trim(),
//           totalAmount: subtotal,
//         });
//         if (res?.data?.success) {
//           console.log("Coupon response data:", res.data);
//           const amt = Number(res.data.discount) || 0;
//           console.log("Coupon applied, discount:", amt);
//           setDiscount(amt);
//           setCouponError("");
//         } else {
//           setDiscount(0);
//           setCouponError(res?.data?.message || "Invalid coupon");
//         }
//       } catch (err) {
//         console.error("Coupon error details:", err?.response?.data || err?.message);
//         setDiscount(0);
//         setCouponError(err?.response?.data?.message || "Error validating coupon");
//       }
//     };

//     // ---- RAZORPAY ----
//     const handleRazorpay = useCallback(
//       async (orderPayload) => {
//         const ready = await loadRazorpayScript();
//         if (!ready || typeof window === "undefined" || !window.Razorpay) {
//           alert("Unable to load Razorpay. Please try again.");
//           return;
//         }
//         try {
//           const res = await axios.post(`${API_BASE}/api/order/razorpay`, orderPayload);
//           if (!res?.data?.success || !res?.data?.order?.id) {
//             console.error("Failed to create Razorpay order:", res?.data);
//             alert("Failed to create Razorpay order");
//             return;
//           }

//           const order = res.data.order;
//           const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
//           if (!key) {
//             console.error("Missing NEXT_PUBLIC_RAZORPAY_KEY_ID");
//             alert("Payment configuration error");
//             return;
//           }

//           const options = {
//             key,
//             amount: order.amount, // in paise
//             currency: "INR",
//             name: "My Shop",
//             description: "Order Payment",
//             order_id: order.id,
//             handler: async (response) => {
//               try {
//                 const verifyRes = await axios.post(`${API_BASE}/api/order/verify`, {
//                   ...response,
//                   orderId: order.id,
//                 });

//                 if (verifyRes?.data?.success) {
//                   clearCart();
//                   router.push(`/frontend/order-success/${order.id}`);
//                 } else {
//                   alert("Payment verification failed!");
//                 }
//               } catch (e) {
//                 console.error("Verification error:", e);
//                 alert("Payment verification error. Please contact support.");
//               }
//             },
//             prefill: {
//               name: `${form.firstName} ${form.lastName}`.trim(),
//               email: form.email,
//               contact: form.phone,
//             },
//             theme: { color: "#ec4899" },
//             modal: {
//               ondismiss: function () {
//                 alert("Payment cancelled. You can try again.");
//               },
//             },
//           };

//           const razorpay = new window.Razorpay(options);
//           razorpay.open();
//         } catch (error) {
//           console.error("Razorpay error:", error);
//           alert("Error processing Razorpay payment");
//         }
//       },
//       [router, form.firstName, form.lastName, form.email, form.phone, clearCart]
//     );

//     // ---- SUBMIT ----
//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       if (!validateForm()) return;
//       if (cartItems.length === 0) {
//         alert("Your cart is empty.");
//         return;
//       }

//       setIsSubmitting(true);

//       const orderPayload = {
//         userId: userId || null,
//         items: cartItems.map((item) => ({
//           productId: item._id || item.id,
//           name: item.name,
//           price: Number(item.price) || 0,
//           quantity: Number(item.quantity) || 0,
//           image: item.image || "/default-product-image.jpg",
//         })),
//         amount: total,
//         address: form,
//         couponCode: couponCode.trim() || "",
//         discount: Number(discount) || 0,
//         paymentMethod,
//       };

//       try {
//         if (paymentMethod === "COD") {
//           const res = await axios.post(`${API_BASE}/api/order/cod`, orderPayload);
//           if (res?.data?.success) {
//             clearCart();
//             const orderId =
//               res?.data?.order?._id ||
//               res?.data?.order?.id ||
//               res?.data?.orderId ||
//               res?.data?.orderid;
//             if (!orderId) {
//               console.error("Order ID missing in COD response:", res?.data);
//               alert("Order placed, but could not fetch order ID.");
//               return;
//             }
//             router.push(`/frontend/order-success/${orderId}`);
//           } else {
//             alert(res?.data?.message || "Failed to place order.");
//           }
//         } else {
//           await handleRazorpay(orderPayload);
//         }
//       } catch (err) {
//         console.error("Order error:", err?.response?.data || err?.message);
//         alert("Something went wrong. Try again!");
//       } finally {
//         setIsSubmitting(false);
//       }
//     };

//   const handlePlaceOrder = () => {
//     if (!selectedAddress) {
//       toast.error("Please select a delivery address");
//       return;
//     }

//     toast.success("Order placed successfully!");
//     setIsCheckoutModalOpen(false);
//     router.push("/frontend/order-confirmation");
//   };

//   const getAddressIcon = (type) => {
//     switch (type) {
//       case "Home":
//         return <FiHome className="text-blue-500" />;
//       case "Work":
//         return <FiBriefcase className="text-green-500" />;
//       default:
//         return <MdLocationOn className="text-purple-500" />;
//     }
//   };

//   const getAddressTypeText = (type) => {
//     switch (type) {
//       case "Home":
//         return "Home";
//       case "Work":
//         return "Work";
//       default:
//         return "Other";
//     }
//   };

//   // Step indicator component
//   const StepIndicator = () => (
//     <div className="flex justify-center mb-2">
//       <div className="flex items-center">
//         <div className={`flex flex-col items-center ${checkoutStep === "address" || checkoutStep === "add-address" ? "text-blue-600" : "text-gray-400"}`}>
//           <div className={`w-5 h-5 rounded-full flex items-center justify-center ${checkoutStep === "address" || checkoutStep === "add-address" ? "bg-blue-100 border-2 border-blue-600" : "bg-gray-100"}`}>
//             {checkoutStep === "payment" ? <FiCheck className="w-4 h-4" /> : <FiMapPin className="w-4 h-4" />}
//           </div>
//           <span className="text-xs mt-1 font-medium">Address</span>
//         </div>
//         <div className={`w-8 h-1 mx-2 ${checkoutStep === "payment" ? "bg-blue-600" : "bg-gray-300"}`}></div>
//         <div className={`flex flex-col items-center ${checkoutStep === "payment" ? "text-blue-600" : "text-gray-400"}`}>
//           <div className={`w-5 h-5 rounded-full flex items-center justify-center ${checkoutStep === "payment" ? "bg-blue-100 border-2 border-blue-600" : "bg-gray-100"}`}>
//             <FiCreditCard className="w-4 h-4" />
//           </div>
//           <span className="text-xs mt-1 font-medium">Payment</span>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className="bg-white  rounded-xl shadow-lg overflow-hidden sticky top-6 border border-gray-200"
//       >
//         <div className="p-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-3 border-b">Order Summary</h2>

//           <div className="space-y-3 mb-5">
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
//               <span className="font-medium">₹{subtotal.toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-600">Shipping</span>
//               <span className="font-medium text-green-600">FREE</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-600">Tax (2%)</span>
//               <span className="font-medium">₹{taxAmount.toLocaleString()}</span>
//             </div>
//             <div className="border-t border-gray-200 pt-3 mt-2 flex justify-between text-base font-semibold">
//               <span>Total</span>
//               <span className="text-blue-600">₹{finalTotal.toLocaleString()}</span>
//             </div>
//           </div>

//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={handleCheckout}
//             className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
//           >
//             <FiCreditCard className="text-sm" />
//             Proceed to Checkout
//           </motion.button>

//           <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
//             <FiTruck className="mr-1" />
//             <span>Free delivery on orders above ₹499</span>
//           </div>
//         </div>
//       </motion.div>


//       {isCheckoutModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center shadow-lg bg-opacity-50 backdrop-blur-sm p-4">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.95, y: 20 }}
//             transition={{ type: "spring", damping: 25, stiffness: 300 }}
//             className="bg-white rounded-xl shadow-xl w-full max-w-lg min-h-[90vh] overflow-hidden flex flex-col"
//           >
//             <div className="flex justify-between items-center p-5 ">
//               <h2 className="text-xl font-semibold text-gray-800">
//                 {checkoutStep === "address" ? "Select Delivery Address" :
//                   checkoutStep === "add-address" ? "Add Delivery Address" :
//                     "Payment Method"}
//               </h2>
//               <button
//                 onClick={() => setIsCheckoutModalOpen(false)}
//                 className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <FiX className="h-5 w-5" />
//               </button>
//             </div>

//             <div className="p-5">
//               <StepIndicator />

//               <div className="overflow-y-auto scrollbar-hide max-h-[60vh]">
//                 {checkoutStep === "address" ? (
//                   <div className="space-y-4">
//                     <div className="space-y-3">
//                       {userAddresses.map((address) => (
//                         <motion.div
//                           key={address._id}
//                           whileHover={{ scale: 1.01 }}
//                           className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedAddress?._id === address._id
//                             ? "border-blue-500 bg-blue-50"
//                             : "border-gray-200 hover:border-blue-300"
//                             }`}
//                           onClick={() => setSelectedAddress(address)}
//                         >
//                           <div className="flex items-start justify-between">
//                             <div className="flex items-center gap-2 mb-2">
//                               <div className={`p-1.5 rounded-full ${selectedAddress?._id === address._id ? "bg-blue-100" : "bg-gray-100"}`}>
//                                 {getAddressIcon(address.addresstype)}
//                               </div>
//                               <span className="font-medium text-gray-800 text-sm capitalize">
//                                 {getAddressTypeText(address.addresstype)}
//                               </span>
//                             </div>
//                             {selectedAddress?._id === address._id && (
//                               <motion.button
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   setCheckoutStep("payment");
//                                 }}
//                                 className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded text-xs font-medium transition-colors"
//                               >
//                                 Deliver Here
//                               </motion.button>
//                             )}
//                           </div>
//                           <div className="text-gray-700 text-xs">
//                             <div className="font-medium">{address.fullName}</div>
//                             <div className="mt-1">{address.address1}, {address.address2}</div>
//                             <div>{address.city}, {address.state} - {address.postalCode}</div>
//                             <div className="mt-2 flex items-center">
//                               <FiPhone className="mr-1.5 text-gray-500 text-xs" />
//                               {address.phone}
//                             </div>
//                             {address.landmark && (
//                               <div className="mt-1 flex items-center">
//                                 <FiMapPin className="mr-1.5 text-gray-500 text-xs" />
//                                 Landmark: {address.landmark}
//                               </div>
//                             )}
//                           </div>
//                         </motion.div>
//                       ))}
//                     </div>

//                     <motion.button
//                       whileHover={{ scale: 1.01 }}
//                       whileTap={{ scale: 0.99 }}
//                       onClick={() => setCheckoutStep("add-address")}
//                       className="w-full px-4 py-3 border border-dashed border-gray-300 rounded-lg text-blue-600 font-medium flex items-center justify-center hover:border-blue-400 transition-colors text-sm"
//                     >
//                       <FiPlus className="mr-2" /> Add New Address
//                     </motion.button>
//                   </div>
//                 ) : checkoutStep === "add-address" ? (
//                   <motion.form
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     onSubmit={handleSaveAddress}
//                     className="space-y-4"
//                   >
//                     {isFirstTimeUser && (
//                       <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2 mb-2">
//                         <FiInfo className="text-blue-500 mt-0.5 flex-shrink-0" />
//                         <p className="text-blue-700 text-xs">Please add your delivery address to continue with your order.</p>
//                       </div>
//                     )}

//                     <h3 className="text-lg font-semibold text-gray-800 mb-3">Add Delivery Address</h3>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="relative">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
//                         <FiUser className="absolute left-3 top-9 text-gray-400 text-sm" />
//                         <input
//                           type="text"
//                           name="fullName"
//                           value={newAddress.fullName}
//                           onChange={handleNewAddressChange}
//                           placeholder="Full Name"
//                           required
//                           className="pl-10 block w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
//                         />
//                       </div>

//                       <div className="relative">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
//                         <MdOutlineEmail className="absolute left-3 top-9 text-gray-400 text-sm" />
//                         <input
//                           type="email"
//                           name="email"
//                           value={newAddress.email}
//                           onChange={handleNewAddressChange}
//                           placeholder="Email"
//                           required
//                           className="pl-10 block w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
//                         />
//                       </div>

//                       <div className="relative">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
//                         <FiPhone className="absolute left-3 top-9 text-gray-400 text-sm" />
//                         <input
//                           type="tel"
//                           name="phoneNumber"
//                           value={newAddress.phoneNumber}
//                           onChange={handleNewAddressChange}
//                           placeholder="Phone Number"
//                           required
//                           maxLength={10}
//                           className="pl-10 block w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
//                         />
//                       </div>

//                       <div className="relative">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
//                         <select
//                           name="addressType"
//                           value={newAddress.addressType}
//                           onChange={handleNewAddressChange}
//                           className="pl-10 block w-full border border-gray-300 rounded-lg py-2.5 px-3 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
//                         >
//                           <option value="Home">Home</option>
//                           <option value="Work">Work</option>
//                           <option value="Other">Other</option>
//                         </select>
//                         <FiHome className="absolute left-3 top-9 text-gray-400 text-sm" />
//                         <FiChevronDown className="absolute right-3 top-9 text-gray-400 pointer-events-none text-sm" />
//                       </div>

//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
//                         <input
//                           type="text"
//                           name="addressLine1"
//                           value={newAddress.addressLine1}
//                           onChange={handleNewAddressChange}
//                           placeholder="Address Line 1"
//                           required
//                           className="block w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
//                         />
//                       </div>

//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
//                         <input
//                           type="text"
//                           name="addressLine2"
//                           value={newAddress.addressLine2}
//                           onChange={handleNewAddressChange}
//                           placeholder="Address Line 2"
//                           className="block w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
//                         <input
//                           type="text"
//                           name="city"
//                           value={newAddress.city}
//                           onChange={handleNewAddressChange}
//                           placeholder="City"
//                           required
//                           className="block w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
//                         <input
//                           type="text"
//                           name="state"
//                           value={newAddress.state}
//                           onChange={handleNewAddressChange}
//                           placeholder="State"
//                           required
//                           className="block w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
//                         <input
//                           type="text"
//                           name="pincode"
//                           value={newAddress.pincode}
//                           onChange={handleNewAddressChange}
//                           placeholder="Pincode"
//                           required
//                           maxLength={6}
//                           className="block w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
//                         />
//                       </div>

//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
//                         <input
//                           type="text"
//                           name="landmark"
//                           value={newAddress.landmark}
//                           onChange={handleNewAddressChange}
//                           placeholder="Landmark"
//                           className="block w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
//                         />
//                       </div>
//                     </div>

//                     <div className="flex justify-end space-x-3 pt-4">
//                       {!isFirstTimeUser && (
//                         <motion.button
//                           whileHover={{ scale: 1.03 }}
//                           whileTap={{ scale: 0.97 }}
//                           type="button"
//                           onClick={() => setCheckoutStep("address")}
//                           className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
//                         >
//                           Cancel
//                         </motion.button>
//                       )}
//                       <motion.button
//                         whileHover={{ scale: 1.03 }}
//                         whileTap={{ scale: 0.97 }}
//                         type="submit"
//                         className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
//                       >
//                         {isFirstTimeUser ? "Continue to Payment" : "Save Address"}
//                       </motion.button>
//                     </div>
//                   </motion.form>
//                 ) : checkoutStep === "payment" ? (
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     className="space-y-5"
//                   >
//                     <div className="border rounded-lg p-4 bg-gray-50">
//                       <div className="flex items-center justify-between mb-2">
//                         <h3 className="font-semibold text-gray-800 text-sm">Delivery Address</h3>
//                         <button
//                           onClick={() => setCheckoutStep("address")}
//                           className="text-blue-600 text-xs font-medium hover:text-blue-800 transition-colors"
//                         >
//                           Change
//                         </button>
//                       </div>
//                       <div className="text-gray-700 text-xs">
//                         <div className="font-medium">{selectedAddress?.fullName}</div>
//                         <div className="mt-1">{selectedAddress?.address1}, {selectedAddress?.address2}</div>
//                         <div>{selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.postalCode}</div>
//                         <div className="mt-2 flex items-center">
//                           <FiPhone className="mr-1.5 text-gray-500" />
//                           {selectedAddress?.phone}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="space-y-4">
//                       <h3 className="font-semibold text-gray-800 text-sm">Select Payment Method</h3>

//                       <motion.div
//                         whileHover={{ scale: 1.01 }}
//                         className={`p-4 border rounded-lg cursor-pointer ${paymentMethod === "cod"
//                           ? "border-blue-500 bg-blue-50"
//                           : "border-gray-200 hover:border-blue-300"
//                           }`}
//                         onClick={() => setPaymentMethod("cod")}
//                       >
//                         <div className="flex items-center gap-3">
//                           <div className={`p-2 rounded-full ${paymentMethod === "cod" ? "bg-blue-100" : "bg-gray-100"}`}>
//                             <FiDollarSign className={`text-sm ${paymentMethod === "cod" ? "text-blue-600" : "text-gray-600"}`} />
//                           </div>
//                           <div className="flex-1">
//                             <div className="font-semibold text-sm">Cash on Delivery</div>
//                             <div className="text-gray-600 text-xs">Pay when you receive your order</div>
//                           </div>
//                           {paymentMethod === "cod" && (
//                             <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
//                               <FiCheck className="text-white text-xs" />
//                             </div>
//                           )}
//                         </div>
//                       </motion.div>

//                       <motion.div
//                         whileHover={{ scale: 1.01 }}
//                         className={`p-4 border rounded-lg cursor-pointer ${paymentMethod === "online"
//                           ? "border-blue-500 bg-blue-50"
//                           : "border-gray-200 hover:border-blue-300"
//                           }`}
//                         onClick={() => setPaymentMethod("online")}
//                       >
//                         <div className="flex items-center gap-3">
//                           <div className={`p-2 rounded-full ${paymentMethod === "online" ? "bg-blue-100" : "bg-gray-100"}`}>
//                             <FiCreditCard className={`text-sm ${paymentMethod === "online" ? "text-blue-600" : "text-gray-600"}`} />
//                           </div>
//                           <div className="flex-1">
//                             <div className="font-semibold text-sm">Online Payment</div>
//                             <div className="text-gray-600 text-xs">Pay securely with UPI, Card or Wallet</div>
//                           </div>
//                           {paymentMethod === "online" && (
//                             <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
//                               <FiCheck className="text-white text-xs" />
//                             </div>
//                           )}
//                         </div>
//                       </motion.div>
//                     </div>

//                     <div className="border-t pt-4 mt-4">
//                       <div className="space-y-2 text-sm">
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Item Total</span>
//                           <span>₹{subtotal.toLocaleString()}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Delivery Fee</span>
//                           <span className="text-green-600">FREE</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Tax</span>
//                           <span>₹{taxAmount.toLocaleString()}</span>
//                         </div>
//                         <div className="flex justify-between font-semibold pt-3 border-t">
//                           <span>Total Amount</span>
//                           <span className="text-blue-600">₹{finalTotal.toLocaleString()}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ) : null}
//               </div>
//             </div>

//             {checkoutStep === "payment" && (
//               <div className="p-5 border-t bg-gray-50">
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handlePlaceOrder}
//                   className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 text-sm shadow-md"
//                 >
//                   {paymentMethod === "cod" ? "Place Order" : "Pay Now"}
//                 </motion.button>
//               </div>
//             )}
//           </motion.div>
//         </div>
//       )}

//     </>
//   );
// };

// export default OrderSummary;





"use client";
import React, { useContext, useState, useEffect, useCallback } from "react";
import { AppContext } from "../context/AppContext";
import {
  FiChevronDown,
  FiPlus,
  FiX,
  FiUser,
  FiPhone,
  FiHome,
  FiBriefcase,
  FiCreditCard,
  FiDollarSign,
  FiCheck,
  FiMapPin,
  FiTruck,
  FiInfo,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { MdOutlineEmail, MdLocationOn } from "react-icons/md";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { FiChevronUp, FiTag } from "react-icons/fi"; // Add these icons
import PaymentLoader from "./PaymentLoader";

let razorpayScriptPromise = null;
function loadRazorpayScript() {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }
  return razorpayScriptPromise;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const OrderSummary = ({ subtotal = 0 }) => {
  const router = useRouter();
  const { cartItems = [], clearCart = () => { }, user = null } = useContext(AppContext) || {};

  // Checkout UI state
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("address"); // address | add-address | payment
  const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod' or 'online'
  const [editAddressId, setEditAddressId] = useState(null);
  const [isCouponDrawerOpen, setIsCouponDrawerOpen] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);


  // Addresses
  const [userAddresses, setUserAddresses] = useState([]);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  // New address form state
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    addressType: "Home",
  });

  // Coupon & discount
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [discount, setDiscount] = useState(0);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [coupons, setCoupons] = useState([]); // list of available coupons
  const [loading, setLoading] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);



  // submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // computed values
  const taxAmount = Math.floor(subtotal * 0.02);
  const grossTotal = subtotal + taxAmount;
  const total = grossTotal - (Number(discount) || 0);

  useEffect(() => {
    try {
      const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (storedToken) {
        const decoded = jwtDecode(storedToken);
        const uid = decoded?._id || decoded?.id || null;
        setToken(storedToken);
        setUserId(uid);
      }
    } catch (err) {
      console.error("Invalid token", err);
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      setToken(null);
      setUserId(null);
    }
  }, []);

  // Add this function to handle coupon selection
  const handleCouponSelect = (coupon) => {
    setCouponCode(coupon.couponCode);
    setDiscount(coupon.discountValue);
    setIsCouponDrawerOpen(false);
    handleApplyCoupon(coupon.couponCode);
    toast.success(`Coupon applied: ₹${coupon.discountValue} off`);
  };

  // useEffect - fetch addresses when component mounts
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    axios
      .get(`${API_BASE}/api/users/getaddress`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        const addresses = res?.data?.address || res?.data?.user?.address || [];
        setUserAddresses(addresses);
        if (!addresses.length) {
          setIsFirstTimeUser(true);
          setCheckoutStep("add-address");
        } else {
          setIsFirstTimeUser(false);
        }
      })
      .catch((err) => {
        console.warn("Get address error:", err?.response?.data || err?.message);
        // assume first time user if fetch fails
        setIsFirstTimeUser(true);
        setUserAddresses([]);
        setCheckoutStep("add-address");
      });
  }, []);

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };


  const deleteAddress = async (addressId) => {
    if (!addressId) return;
    const token = localStorage.getItem("token");

    try {
      const res = await axios.delete(`${API_BASE}/api/users/deleteaddress/${addressId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res?.data?.success) {
        const updatedAddresses = res?.data?.address || [];
        setUserAddresses(updatedAddresses);

        if (selectedAddress?._id === addressId) {
          setSelectedAddress(updatedAddresses[0] || null);
        }

        toast.success("Address deleted successfully");

        if (!updatedAddresses.length) {
          setIsFirstTimeUser(true);
          setCheckoutStep("add-address");
        }
      } else {
        throw new Error(res?.data?.message || "Failed to delete address");
      }
    } catch (err) {
      console.error("Delete address error:", {
        status: err?.response?.status,
        data: err?.response?.data,
        message: err?.message,
      });
      toast.error(err?.response?.data?.message || "Failed to delete address");
    }
  };






  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const payload = {
      fullName: newAddress.fullName,
      email: newAddress.email,
      phone: newAddress.phoneNumber,
      address1: newAddress.addressLine1,
      address2: newAddress.addressLine2,
      addresstype: newAddress.addressType,
      city: newAddress.city,
      state: newAddress.state,
      postalCode: newAddress.pincode,
      landmark: newAddress.landmark,
    };

    try {
      const res = editAddressId
        ? await axios.put(`${API_BASE}/api/users/editaddress/${editAddressId}`, payload, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        : await axios.post(`${API_BASE}/api/users/addaddress`, payload, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

      if (res?.data?.success) {
        const updatedAddresses = res?.data?.user?.address || res?.data?.address || [];
        setUserAddresses(updatedAddresses);
        setSelectedAddress(updatedAddresses[updatedAddresses.length - 1]);
        toast.success(editAddressId ? "Address updated successfully!" : "Address added successfully!");
        setCheckoutStep("address");
        setIsFirstTimeUser(false);
        setNewAddress({ fullName: "", email: "", phoneNumber: "", addressLine1: "", addressLine2: "", city: "", state: "", pincode: "", landmark: "", addressType: "Home" });
        setEditAddressId(null);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save address");
    }
  };


  const handleCheckout = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/frontend/signin?from=checkout");
      return;
    }
    setIsCheckoutModalOpen(true);
    // ensure correct step
    if (!userAddresses.length) setCheckoutStep("add-address");
    else setCheckoutStep("address");
  };

  const handleApplyCoupon = async (coupon) => {
    setCouponError("");
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/api/coupons/apply`, {
        couponCode: couponCode.trim(),
        totalAmount: subtotal,
      });
      if (res?.data?.success) {
        const amt = Number(res.data.discount) || 0;
        setDiscount(amt);
        setCouponError("");
        toast.success(`Coupon applied: ₹${amt} off`);
      } else {
        setDiscount(0);
        setCouponError(res?.data?.message || "Invalid coupon");
      }
    } catch (err) {
      console.error("Coupon error details:", err?.response?.data || err?.message);
      setDiscount(0);
      setCouponError(err?.response?.data?.message || "Error validating coupon");
    }
  };

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/api/coupons/active`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // normalize response to an array
      let coupons = [];
      if (Array.isArray(data.coupons)) {
        coupons = data.coupons;
      } else if (data.coupon) {
        coupons = [data.coupon];
      } else if (data.coupons && typeof data.coupons === "object") {
        // fallback if backend accidentally returned an object
        coupons = [data.coupons];
      } else {
        coupons = [];
      }

      setCoupons(coupons);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };




  useEffect(() => {
    if (token) {
      fetchCoupons();
    }
  }, [token]);

  console.log("Available coupons:", coupons);







  const handleRazorpay = useCallback(
    async (orderPayload) => {
      const ready = await loadRazorpayScript();
      if (!ready || typeof window === "undefined" || !window.Razorpay) {
        toast.error("Unable to load Razorpay checkout. Try again.");
        return;
      }
      try {
        setLoadingPayment(true); // 🚀 Start loader

        const res = await axios.post(`${API_BASE}/api/order/razorpay`, orderPayload);
        if (!res?.data?.success || !res?.data?.order?.id) {
          console.error("Failed to create Razorpay order:", res?.data);
          toast.error("Failed to create Razorpay order. Try again.");
          setLoadingPayment(false);
          return;
        }

        const order = res.data.order;
        const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!key) {
          console.error("Missing NEXT_PUBLIC_RAZORPAY_KEY_ID");
          toast.error("Payment configuration error");
          setLoadingPayment(false);
          return;
        }

        const options = {
          key,
          amount: order.amount,
          currency: order.currency || "INR",
          name: "My Shop",
          description: "Order Payment",
          order_id: order.id,
          handler: async (response) => {
            try {
              const verifyRes = await axios.post(`${API_BASE}/api/order/verify`, {
                ...response,
                orderId: order.id,
              });
              if (verifyRes?.data?.success) {
                router.push(`/frontend/order-success/${order.id}`);
                clearCart();
              } else {
                toast.error("Payment verification failed!");
                setLoadingPayment(false); // ❌ stop loader
              }
            } catch (e) {
              console.error("Verification error:", e);
              toast.error("Payment verification error. Contact support.");
              setLoadingPayment(false);
            }
          },
          prefill: {
            name: selectedAddress?.fullName || user?.name || "",
            email: selectedAddress?.email || user?.email || "",
            contact: selectedAddress?.phone || "",
          },
          theme: { color: "#ec4899" },
          modal: {
            ondismiss: function () {
              toast("Payment cancelled.");
              setLoadingPayment(false);
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        console.error("Razorpay error:", error?.response?.data || error?.message);
        toast.error("Error processing payment. Try again.");
        setLoadingPayment(false);
      }
    },
    [selectedAddress, user, clearCart, router]
  );

  


  // Validate before placing order
  const validateBeforePlace = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return false;
    }
    if (!cartItems.length) {
      toast.error("Your cart is empty.");
      return false;
    }
    return true;
  };

  // Place order - handles COD and online
  const handlePlaceOrder = async () => {
    if (!validateBeforePlace()) return;
    setIsSubmitting(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const orderPayload = {
      userId: userId || user?._id || null,   // 👈 use decoded userId here
      items: cartItems.map((item) => ({
        productId: item._id || item.id,
        name: item.name,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        image: item.image || "/default-product-image.jpg",
      })),
      amount: total,
      address: {
        fullName: selectedAddress.fullName,
        email: selectedAddress.email,
        phone: selectedAddress.phone,
        address1: selectedAddress.address1,
        address2: selectedAddress.address2,
        city: selectedAddress.city,
        state: selectedAddress.state,
        postalCode: selectedAddress.postalCode,
        landmark: selectedAddress.landmark,
        addresstype: selectedAddress.addresstype,
      },
      couponCode: couponCode.trim() || "",
      discount: Number(discount) || 0,
      paymentMethod: paymentMethod === "cod" ? "COD" : "RAZORPAY",
    };


    try {
      if (paymentMethod === "cod") {
        const res = await axios.post(`${API_BASE}/api/order/cod`, orderPayload, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res?.data?.success) {

          const orderId =
            res?.data?.order?._id ||
            res?.data?.order?.id ||
            res?.data?.orderId ||
            res?.data?.orderid;
          if (orderId) {
            toast.success("Order placed successfully!");
            router.push(`/frontend/order-success/${orderId}`);
            clearCart();
          } else {
            // fallback if backend doesn't return id consistently
            toast.success("Order placed successfully!");
            router.push(`/frontend/order-confirmation`);
          }
        } else {
          throw new Error(res?.data?.message || "Failed to place order");
        }
      } else {
        // online payment -> create razorpay order via backend and open checkout
        await handleRazorpay(orderPayload);
      }
    } catch (err) {
      console.error("Order error:", err?.response?.data || err?.message);
      toast.error(err?.response?.data?.message || "Something went wrong. Try again!");
    } finally {
      setIsSubmitting(false);
      setIsCheckoutModalOpen(false);
    }
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case "Home":
        return <FiHome className="text-blue-500" />;
      case "Work":
        return <FiBriefcase className="text-green-500" />;
      default:
        return <MdLocationOn className="text-purple-500" />;
    }
  };

  const getAddressTypeText = (type) => {
    switch (type) {
      case "Home":
        return "Home";
      case "Work":
        return "Work";
      default:
        return "Other";
    }
  };

  // Step indicator component
  const StepIndicator = () => (
    <div className=" justify-center mb-2 hidden">
      <div className="flex items-center">
        <div
          className={`flex flex-col items-center ${checkoutStep === "address" || checkoutStep === "add-address" ? "text-blue-600" : "text-gray-400"
            }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${checkoutStep === "address" || checkoutStep === "add-address" ? "bg-blue-100 border-2 border-blue-600" : "bg-gray-100"
              }`}
          >
            {checkoutStep === "payment" ? <FiCheck className="w-4 h-4 " /> : <FiMapPin className="w-4 h-4" />}
          </div>
          <span className="text-xs mt-1 font-medium">Address</span>
        </div>
        <div className={`w-8 h-1  mx-2 ${checkoutStep === "payment" ? "bg-blue-600" : "bg-gray-300"}`}></div>
        <div className={`flex flex-col  items-center ${checkoutStep === "payment" ? "text-blue-600" : "text-gray-400"}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${checkoutStep === "payment" ? "bg-blue-100 border-2 border-blue-600" : "bg-gray-100"}`}>
            <FiCreditCard className="w-4 h-4" />
          </div>
          <span className="text-xs mt-1 font-medium">Payment</span>
        </div>
      </div>
    </div>
  );

  return (

    <>
      {loadingPayment && <PaymentLoader />}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-6 border border-gray-200">
        <div className="p-6 ">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-3 border-b">Order Summary</h2>

          <div className="space-y-3 mb-5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
              <span className="font-medium">₹{subtotal.toLocaleString()}</span>
            </div>
            {/* <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-green-600">FREE</span>
            </div> */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (2%)</span>
              <span className="font-medium">₹{taxAmount.toLocaleString()}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-700">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium">-₹{Number(discount).toLocaleString()}</span>
              </div>
            )}

            <div className="border-t border-gray-200 pt-3 mt-2 flex justify-between text-base font-semibold">
              <span>Total</span>
              <span className="text-[#6d52bd]">₹{total.toLocaleString()}</span>
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.00 }} whileTap={{ scale: 0.98 }} onClick={handleCheckout} className="w-full py-3 bg-[#8D6AF8] hover:bg-[#694fb8] text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md">
            <FiCreditCard className="text-sm" />
            Proceed to Checkout
          </motion.button>

          {/* <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
            <FiTruck className="mr-1" />
            <span>Free delivery on orders above ₹499</span>
          </div> */}
        </div>
      </motion.div>

      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center shadow-lg bg-black/40 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] relative overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 ">
              <h2 className="text-xl font-semibold text-gray-800">{checkoutStep === "address" ? "Select Delivery Address" : checkoutStep === "add-address" ? "Add Delivery Address" : "Payment Method"}</h2>
              <button onClick={() => setIsCheckoutModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="px-4 pt-3 flex-1 bg-gray-100  flex flex-col overflow-y-scroll scrollbar-hide">
              <StepIndicator />


              <div className="flex-1 overflow-y-auto scrollbar-hide pr-2">
                {checkoutStep === "address" ? (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-3">
                        {userAddresses.length ? (
                          userAddresses.map((address) => (
                            <motion.div key={address._id || `${address.postalCode}-${address.phone}`} whileHover={{ scale: 1.00 }} className={`p-4 bg-white border rounded-lg cursor-pointer transition-all ${selectedAddress?._id === address._id ? "border-[#7a1113] bg-blue-50" : "border-gray-200 hover:border-blue-300"}`} onClick={() => setSelectedAddress(address)}>
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={`p-1.5 rounded-full ${selectedAddress?._id === address._id ? "bg-blue-100" : "bg-gray-100"}`}>{getAddressIcon(address.addresstype)}</div>
                                  <span className="font-medium text-gray-800 text-sm capitalize">{getAddressTypeText(address.addresstype)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div>
                                    {selectedAddress?._id === address._id && (
                                      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={(e) => { e.stopPropagation(); setCheckoutStep("payment"); }} className="text-white bg-[#7a1113] hover:bg-[#7a1113] px-3 py-1.5 rounded text-xs font-medium transition-colors">
                                        Deliver Here
                                      </motion.button>
                                    )}
                                  </div>
                                  <div>
                                    {selectedAddress?._id === address._id && (
                                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white bg-green-400 hover:bg-green-700 px-3 py-1.5 rounded text-xs font-medium transition-colors">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setCheckoutStep("add-address");
                                            setEditAddressId(address._id);
                                            setNewAddress({
                                              fullName: address.fullName,
                                              email: address.email,
                                              phoneNumber: address.phone,
                                              addressLine1: address.address1,
                                              addressLine2: address.address2,
                                              city: address.city,
                                              state: address.state,
                                              pincode: address.postalCode,
                                              landmark: address.landmark,
                                              addressType: address.addresstype || "Home",
                                            });
                                          }}
                                          className="hover:text-white transition-colors"
                                        >
                                          Edit
                                        </button>

                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex relative justify-between items-start">
                                <div className="text-gray-700 text-xs">
                                  <div className="font-medium">{address.fullName}</div>
                                  <div className="mt-1">{address.address1}{address.address2 ? `, ${address.address2}` : ""}</div>
                                  <div>{address.city}, {address.state} - {address.postalCode}</div>
                                  <div className="mt-2 flex items-center">
                                    <FiPhone className="mr-1.5 text-gray-500 text-xs" />
                                    {address.phone}
                                  </div>
                                  {address.landmark && (
                                    <div className="mt-1 flex items-center">
                                      <FiMapPin className="mr-1.5 text-gray-500 text-xs" />
                                      Landmark: {address.landmark}
                                    </div>
                                  )}
                                </div>
                                <div className=" absolute bottom-0 right-0">
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center"
                                  >
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteAddress(address._id);
                                      }}
                                      className="text-red-500 px-3 py-1.5 rounded-md text-xs border border-gray-400 font-medium transition-colors flex items-center gap-1 shadow-md"
                                    >
                                      <FiX className="text-sm" /> Delete
                                    </button>
                                  </motion.div>
                                </div>

                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center text-sm text-gray-500">No saved addresses. Please add one.</div>
                        )}
                      </div>


                    </div>



                  </>

                ) : checkoutStep === "add-address" ? (
                  <motion.form initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} onSubmit={handleSaveAddress} className="space-y-4">
                    {isFirstTimeUser && (
                      <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2 mb-2">
                        <FiInfo className="text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-blue-700 text-xs">Please add your delivery address to continue with your order.</p>
                      </div>
                    )}

                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Add Delivery Address</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <FiUser className="absolute left-3 top-9 text-gray-400 text-sm" />
                        <input type="text" name="fullName" value={newAddress.fullName} onChange={handleNewAddressChange} placeholder="Full Name" required className="pl-10 block bg-white w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm" />
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <MdOutlineEmail className="absolute left-3 top-9 text-gray-400 text-sm" />
                        <input type="email" name="email" value={newAddress.email} onChange={handleNewAddressChange} placeholder="Email" required className="pl-10 block w-full bg-white  border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm" />
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                        <FiPhone className="absolute left-3 top-9 text-gray-400 text-sm" />
                        <input type="tel" name="phoneNumber" value={newAddress.phoneNumber} onChange={handleNewAddressChange} placeholder="Phone Number" required maxLength={10} className="pl-10 block bg-white  w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm" />
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                        <select name="addressType" value={newAddress.addressType} onChange={handleNewAddressChange} className="pl-10 block bg-white  w-full border border-gray-300 rounded-lg py-2.5 px-3 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm">
                          <option value="Home">Home</option>
                          <option value="Work">Work</option>
                          <option value="Other">Other</option>
                        </select>
                        <FiHome className="absolute left-3 top-9 text-gray-400 text-sm" />
                        <FiChevronDown className="absolute right-3 top-9 text-gray-400 pointer-events-none text-sm" />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                        <input type="text" name="addressLine1" value={newAddress.addressLine1} onChange={handleNewAddressChange} placeholder="Address Line 1" required className="block w-full bg-white  border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm" />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                        <input type="text" name="addressLine2" value={newAddress.addressLine2} onChange={handleNewAddressChange} placeholder="Address Line 2" className="block w-full bg-white   border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                        <input type="text" name="city" value={newAddress.city} onChange={handleNewAddressChange} placeholder="City" required className="block w-full border bg-white  border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                        <input type="text" name="state" value={newAddress.state} onChange={handleNewAddressChange} placeholder="State" required className="block w-full bg-white  border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                        <input type="text" name="pincode" value={newAddress.pincode} onChange={handleNewAddressChange} placeholder="Pincode" required maxLength={6} className="block w-full bg-white  border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm" />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
                        <input type="text" name="landmark" value={newAddress.landmark} onChange={handleNewAddressChange} placeholder="Landmark" className="block w-full border bg-white  border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm" />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 mb-3 pt-4">
                      {!isFirstTimeUser && (
                        <motion.button whileHover={{ scale: 1.00 }} whileTap={{ scale: 0.97 }} type="button" onClick={() => setCheckoutStep("address")} className="px-5 py-2.5 border bg-white  border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors">
                          Cancel
                        </motion.button>
                      )}
                      <motion.button whileHover={{ scale: 1.00 }} whileTap={{ scale: 0.97 }} type="submit" className="px-5 py-2.5 bg-[#7a1113] text-white rounded-lg font-medium text-sm hover:bg-[#7a1113] transition-colors">
                        {isFirstTimeUser ? "Continue to Payment" : "Save Address"}
                      </motion.button>
                    </div>
                  </motion.form>
                ) : checkoutStep === "payment" ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }} className="space-y-5">
                    <div className="border rounded-lg p-4 bg-white ">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800 text-sm">Delivery Address</h3>
                        <button onClick={() => setCheckoutStep("address")} className="text-blue-600 text-xs font-medium hover:text-blue-800 transition-colors">
                          Change
                        </button>
                      </div>
                      <div className="text-gray-700 text-xs">
                        <div className="font-medium">{selectedAddress?.fullName}</div>
                        <div className="mt-1">{selectedAddress?.address1}{selectedAddress?.address2 ? `, ${selectedAddress?.address2}` : ""}</div>
                        <div>{selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.postalCode}</div>
                        <div className="mt-2 flex items-center">
                          <FiPhone className="mr-1.5 text-gray-500" />
                          {selectedAddress?.phone}
                        </div>
                      </div>
                    </div>


                    {/* <div className="mb-6">
                      <label className=" text-sm font-semibold text-gray-800 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        Apply Coupon Code
                      </label>
                      <div className="flex gap-0 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-opacity-50">
                        <input
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter your coupon code"
                          className="flex-1 border border-gray-300 px-4 py-3 text-gray-700 bg-white focus:ring-0 focus:outline-none placeholder-gray-400"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          className="px-6 py-3 text-sm font-semibold text-white bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-md"
                        >
                          Apply
                        </button>
                      </div>
                      {
                        couponCode && !couponError && discount > 0 && (
                          <div className="flex items-center mt-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xs text-green-600 font-medium">Coupon applied! You saved ₹{Number(discount).toLocaleString()}</p>
                          </div>
                        )
                      }
                      {couponError && (
                        <div className="flex items-center mt-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-xs text-red-600 font-medium">{couponError}</p>
                        </div>
                      )}
                    </div> */}

                    <div className="mb-6">
                      <label className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        Apply Coupon Code
                      </label>
                      <div className="flex gap-0 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-opacity-50">
                        <input
                          value={couponCode || ''} // Ensure it's always a string
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter your coupon code"
                          className="flex-1 border border-gray-300 px-4 py-3 text-gray-700 bg-white focus:ring-0 focus:outline-none placeholder-gray-400"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          className="px-6 py-3 text-sm font-semibold text-white bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-md"
                        >
                          Apply
                        </button>
                      </div>

                      {/* View All Coupons Button */}
                      <button
                        onClick={() => setIsCouponDrawerOpen(true)}
                        className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
                      >
                        <FiTag className="text-indigo-500" />
                        View All Available Coupons
                        <FiChevronDown className="text-gray-500" />
                      </button>

                      {/* Coupon Status Messages */}
                      {couponCode && !couponError && discount > 0 && (
                        <div className="flex items-center mt-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-xs text-green-600 font-medium">Coupon applied! You saved ₹{Number(discount).toLocaleString()}</p>
                        </div>
                      )}
                      {couponError && (
                        <div className="flex items-center mt-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-xs text-red-600 font-medium">{couponError}</p>
                        </div>
                      )}
                    </div>


                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-800 text-sm">Select Payment Method</h3>

                      <motion.div whileHover={{ scale: 1.00 }} className={`p-4 bg-white border rounded-lg cursor-pointer ${paymentMethod === "cod" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`} onClick={() => setPaymentMethod("cod")}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${paymentMethod === "cod" ? "bg-blue-100" : "bg-gray-100"}`}>
                            <FiDollarSign className={`text-sm ${paymentMethod === "cod" ? "text-blue-600" : "text-gray-600"}`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm">Cash on Delivery</div>
                            <div className="text-gray-600 text-xs">Pay when you receive your order</div>
                          </div>
                          {paymentMethod === "cod" && (
                            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                              <FiCheck className="text-white text-xs" />
                            </div>
                          )}
                        </div>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.00 }} className={`p-4 bg-white border rounded-lg cursor-pointer ${paymentMethod === "online" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`} onClick={() => setPaymentMethod("online")}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${paymentMethod === "online" ? "bg-blue-100" : "bg-gray-100"}`}>
                            <FiCreditCard className={`text-sm ${paymentMethod === "online" ? "text-blue-600" : "text-gray-600"}`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm">Online Payment</div>
                            <div className="text-gray-600 text-xs">Pay securely with UPI, Card or Wallet</div>
                          </div>
                          {paymentMethod === "online" && (
                            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                              <FiCheck className="text-white text-xs" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </div>

                    <div className="border-t pt-4  mt-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Item Total</span>
                          <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivery Fee</span>
                          <span className="text-green-600 text-xs">FREE</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax</span>
                          <span>₹{taxAmount.toLocaleString()}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-green-700">
                            <span>Discount</span>
                            <span>-₹{Number(discount).toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold pt-3 border-t">
                          <span>Total Amount</span>
                          <span className="text-blue-600">₹{total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </div>
            </div>


            {checkoutStep === "payment" && (
              <div className="flex items-center w-[100%] bg-white  justify-between gap-4 p-3 border-t  border-gray-300">
                {/* Total Amount with shimmer effect */}
                <div className="w-[25%]">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative flex-1 py-2  text-center bg-black text-white font-bold rounded-lg text-lg shadow-md overflow-hidden shimmer-wrapper"
                  >
                    <span className="relative z-10 text-sm">
                      ₹{total.toLocaleString()}
                    </span>
                    {/* shimmer overlay */}
                    <div className="shimmer"></div>
                  </motion.div>
                </div>
                {/* Place Order / Pay Now Button */}
                <div className="w-[75%]">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="flex-1 py-3 w-full  bg-[#7a1113] hover:bg-[#7a1113] text-white font-medium rounded-lg transition-all duration-200 text-sm shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {paymentMethod === "cod"
                      ? isSubmitting
                        ? "Placing..."
                        : "Place Order"
                      : isSubmitting
                        ? "Processing..."
                        : "Pay Now"}
                  </motion.button>
                </div>
              </div>
            )}

            {checkoutStep == "address" && (
              <div className=" w-[100%] bg-white   gap-4 p-3 border-t  border-gray-300">
                <motion.button whileHover={{ scale: 0.98 }} whileTap={{ scale: 0.99 }} onClick={() => setCheckoutStep("add-address")} className="w-full sticky bottom-0  px-4 py-3 border bg-white border-dashed border-gray-300 rounded-lg text-[#7a1113] font-medium flex items-center justify-center hover:border-blue-400 transition-colors text-sm">
                  <FiPlus className="mr-2" /> Add New Address
                </motion.button>
              </div>
            )

            }


            {/* Coupons Drawer */}
            {isCouponDrawerOpen && (
              <div className="absolute bottom-0 inset-0 z-50  overflow-hidden  rounded-2xl  flex items-end justify-center ">
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="bg-gray-100 rounded-2xl shadow-2xl  shadow-gray-50 w-full max-w-md h-[70%] border-t border-gray-300 flex flex-col"
                >
                  {/* Drawer Header */}
                  <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Available Coupons</h2>
                    <button
                      onClick={() => setIsCouponDrawerOpen(false)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Coupons List */}
                  <div className="flex-1 overflow-y-auto p-4">
                    {couponLoading ? (
                      <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    ) : coupons.length > 0 ? (
                      <div className="space-y-4">

                        {coupons.map((coupon) => (
                          <motion.div
                            key={coupon._id}
                            whileHover={{ scale: 1.01 }}
                            className={`p-4 border rounded-lg bg-white cursor-pointer transition-all ${couponCode === coupon.code ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-blue-300"
                              }`}
                            onClick={() => {

                              setCouponCode(`${coupon.couponCode}`);
                              setDiscount(coupon.discountValue);
                              setIsCouponDrawerOpen(false);


                              toast.success(`Coupon applied: ₹${coupon.discountValue} off`);
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-full">
                                  <FiTag className="text-blue-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-800">{coupon.couponCode}</h3>
                                  <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
                                  <div className="flex items-center mt-2">
                                    <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                      Min. order: ₹{coupon.minPurchaseAmount}
                                    </span>
                                    {coupon.maxDiscountAmount && (
                                      <span className="text-xs font-medium bg-purple-100 text-purple-800 px-2 py-1 rounded ml-2">
                                        Max. discount: ₹{coupon.maxDiscountAmount}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-[#7a1113]">
                                  ₹{coupon.discount} OFF
                                </div>
                                {couponCode === coupon.code && (
                                  <div className="text-xs text-green-600 font-medium mt-1 flex items-center">
                                    <FiCheck className="mr-1" /> Applied
                                  </div>
                                )}
                              </div>
                            </div>
                            {coupon.validUntil && (
                              <div className="text-xs text-gray-500 mt-3">
                                Valid until: {new Date(coupon.validUntil).toLocaleDateString()}
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                        <FiTag className="h-12 w-12 mb-3 opacity-50" />
                        <p className="text-lg font-medium">No coupons available</p>
                        <p className="text-sm mt-1">Check back later for new offers</p>
                      </div>
                    )}
                  </div>

                  {/* Drawer Footer */}
                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={() => setIsCouponDrawerOpen(false)}
                      className="w-full py-3 bg-[#7a1113] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#7a1113] text-sm"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </div>
            )}


          </motion.div>
        </div>
      )}

    </>
  );
};

export default OrderSummary;
