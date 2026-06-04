// "use client";
// import React, { useContext, useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import Navbar from "../components/Navbar";
// import { AppContext } from "../context/AppContext";
// import Footer from "../components/Footer";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { jwtDecode } from "jwt-decode";

// const CheckoutPage = () => {
//   const [form, setForm] = useState({
//     email: "",
//     firstName: "",
//     lastName: "",
//     company: "",
//     address1: "",
//     address2: "",
//     city: "",
//     country: "India",
//     postalCode: "",
//     phone: ""
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState("COD");
//   const [token, setToken] = useState(null);
//   const [userId, setUserId] = useState(null);


//   const [couponCode, setCouponCode] = useState("");
//   const [discount, setDiscount] = useState(0);
//   const [couponError, setCouponError] = useState("");

//   // useEffect(() => {
//   //   if (typeof window !== "undefined") {
//   //     const storedToken = localStorage.getItem("token");
//   //     if (storedToken) {
//   //       setToken(storedToken);
//   //       const decoded = jwtDecode(storedToken);
//   //       setUserId(decoded._id || decoded.id);
//   //     }
//   //   }
//   // }, []);

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) {
//       try {
//         const decoded = jwtDecode(storedToken);
//         setToken(storedToken);
//         setUserId(decoded._id || decoded.id);
//       } catch (err) {
//         console.error("Invalid token", err);
//         localStorage.removeItem("token");
//       }
//     }
//   }, []);


//   const { cartItems, clearCart } = useContext(AppContext);
//   const router = useRouter();



//   const subtotal = cartItems.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0
//   );

//   const subtotalWithDiscount = subtotal - discount;

//   const decoded = token ? jwtDecode(token) : null;

//   useEffect(() => {
//     if (!window.Razorpay) {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.async = true;
//       document.body.appendChild(script);
//     }
//   }, []);


//   // const handleApplyCoupon = async () => {
//   //   if (!couponCode.trim()) {
//   //     setCouponError("Please enter a coupon code");
//   //     return;
//   //   }
//   //   try {
//   //     const res = await axios.post("${process.env.NEXT_PUBLIC_BACKEND_URL}/api/coupons/apply", {
//   //       code: couponCode,
//   //       subtotal,
//   //     });

//   //     if (res.data.success) {
//   //       setDiscount(res.data.discountAmount);
//   //       setCouponError("");
//   //     } else {
//   //       setDiscount(0);
//   //       setCouponError(res.data.message || "Invalid coupon");
//   //     }
//   //   } catch (err) {
//   //     console.error(err);
//   //     setDiscount(0);
//   //     setCouponError("Error validating coupon");
//   //   }
//   // };


//   const handleApplyCoupon = async () => {
//     if (!couponCode.trim()) {
//       setCouponError("Please enter a coupon code");
//       return;
//     }
//     try {
//       const res = await axios.post("${process.env.NEXT_PUBLIC_BACKEND_URL}/api/coupons/apply", {
//         couponCode: couponCode,
//         totalAmount: subtotal,
//       });


//       if (res.data.success) {
//         setDiscount(res.data.discountAmount);
//         setCouponError("");
//       } else {
//         setDiscount(0);
//         setCouponError(res.data.message || "Invalid coupon");
//       }
//     } catch (err) {
//       console.error("Coupon error details:", err.response?.data); // Add this line
//       setDiscount(0);
//       setCouponError(err.response?.data?.message || "Error validating coupon");
//     }
//   };
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//     if (errors[name]) setErrors({ ...errors, [name]: "" });
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!form.email) newErrors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email is invalid";
//     if (!form.firstName) newErrors.firstName = "First name is required";
//     if (!form.lastName) newErrors.lastName = "Last name is required";
//     if (!form.address1) newErrors.address1 = "Address is required";
//     if (!form.city) newErrors.city = "City is required";
//     if (!form.postalCode) newErrors.postalCode = "Postal code is required";
//     if (!form.phone) newErrors.phone = "Phone number is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleRazorpay = async (orderPayload) => {
//     try {
//       const res = await axios.post("${process.env.NEXT_PUBLIC_BACKEND_URL}/api/order/razorpay", orderPayload);

//       if (!res.data.success) {
//         alert("Failed to create Razorpay order");
//         return;
//       }

//       console.log(res.data.order);
//       console.log(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         amount: res.data.order.amount,
//         currency: "INR",
//         name: "My Shop",
//         description: "Order Payment",
//         order_id: res.data.order.id,
//         handler: async (response) => {
//           const verifyRes = await axios.post("${process.env.NEXT_PUBLIC_BACKEND_URL}/api/order/verify", {
//             ...response,
//             orderId: res.data.order.id
//           });

//           if (verifyRes.data.success) {
//             clearCart();
//             router.push(`/frontend/order-success/${res.data.order.id}`);
//           } else {
//             alert("Payment verification failed!");
//           }
//         },
//         prefill: {
//           name: `${form.firstName} ${form.lastName}`,
//           email: form.email,
//           contact: form.phone
//         },
//         theme: { color: "#ec4899" },
//         modal: {
//           ondismiss: function () {
//             alert("Payment cancelled. You can try again.");
//           }
//         }
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.open();
//     } catch (error) {
//       console.error("Razorpay error:", error);
//       alert("Error processing Razorpay payment");
//     }
//   };






//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setIsSubmitting(true);

//     // In a real app, you would get the user ID from your authentication system
//     // const orderPayload = {
//     //   userId: decoded ? (decoded._id || decoded.id) : null,
//     //   items: cartItems.map((item) => ({
//     //     productId: item._id || item.id,
//     //     name: item.name,
//     //     price: item.price,
//     //     quantity: item.quantity,
//     //     image: item.image || "/default-product-image.jpg"
//     //   })),
//     //   amount: subtotal,
//     //   address: form,
//     //   couponCode: "",
//     //   discount: 0,
//     //   paymentMethod: paymentMethod
//     // };

//     const orderPayload = {
//       userId,
//       items: cartItems.map((item) => ({
//         productId: item._id || item.id,
//         name: item.name,
//         price: item.price,
//         quantity: item.quantity,
//         image: item.image || "/default-product-image.jpg"
//       })),
//       amount: subtotal - discount,
//       address: form,
//       couponCode,
//       discount,
//       paymentMethod
//     };


//     try {
//       if (paymentMethod === "COD") {
//         const res = await axios.post("${process.env.NEXT_PUBLIC_BACKEND_URL}/api/order/cod", orderPayload);

//         if (res.data.success) {
//           clearCart();
//           const orderId =
//             res.data.order?._id ||
//             res.data.order?.id ||
//             res.data.orderId ||
//             res.data.orderid;
//           if (!orderId) {
//             console.error("Order ID missing in COD response:", res.data);
//             alert("Order placed, but could not fetch order ID.");
//             return;
//           }
//           router.push(`/frontend/order-success/${orderId}`);
//         } else {
//           alert("Failed to place order.");
//         }
//       } else {
//         await handleRazorpay(orderPayload);
//       }

//     } catch (err) {
//       console.error("Order error:", err);
//       alert("Something went wrong. Try again!");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <Navbar />

//       {/* Progress Bar */}
//       <div className="bg-white border-b border-gray-200 py-4">
//         <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-center">
//             <div className="flex items-center text-pink-600">
//               <span className="bg-pink-600 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium">1</span>
//               <span className="ml-2 text-sm font-medium">Cart</span>
//             </div>
//             <div className="h-0.5 w-12 bg-gray-300 mx-2"></div>
//             <div className="flex items-center text-pink-600">
//               <span className="bg-pink-600 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium">2</span>
//               <span className="ml-2 text-sm font-medium">Information</span>
//             </div>
//             <div className="h-0.5 w-12 bg-gray-300 mx-2"></div>
//             <div className="flex items-center text-gray-500">
//               <span className="border border-gray-300 rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium">3</span>
//               <span className="ml-2 text-sm font-medium">Shipping</span>
//             </div>
//             <div className="h-0.5 w-12 bg-gray-300 mx-2"></div>
//             <div className="flex items-center text-gray-500">
//               <span className="border border-gray-300 rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium">4</span>
//               <span className="ml-2 text-sm font-medium">Payment</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Section */}
//       <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12">
//         {/* Left - Form */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
//           <p className="text-gray-500 mb-6">Complete your purchase by filling the information below</p>

//           <form onSubmit={handleSubmit}>
//             <div className="mb-8">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                 <span className="bg-pink-100 text-pink-800 rounded-full p-2 mr-2">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                     <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                     <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//                   </svg>
//                 </span>
//                 Contact information
//               </h2>
//               <div className="mb-4">
//                 <input
//                   type="email"
//                   name="email"
//                   value={form.email}
//                   onChange={handleChange}
//                   placeholder="Email or mobile phone number"
//                   className={`w-full border rounded-lg p-3.5 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-pink-500'} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
//                 />
//                 {errors.email && <p className="text-red-500 text-xs mt-1.5 flex items-center">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                   {errors.email}
//                 </p>}
//               </div>
//               <label className="flex items-center text-sm text-gray-600">
//                 <input type="checkbox" className="mr-2 rounded text-pink-600 focus:ring-pink-500" />
//                 Email me with news and offers
//               </label>
//             </div>

//             <div className="mb-8">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                 <span className="bg-pink-100 text-pink-800 rounded-full p-2 mr-2">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
//                   </svg>
//                 </span>
//                 Shipping address
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <input
//                     type="text"
//                     name="firstName"
//                     value={form.firstName}
//                     onChange={handleChange}
//                     placeholder="First name"
//                     className={`w-full border rounded-lg p-3.5 ${errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-pink-500'} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
//                   />
//                   {errors.firstName && <p className="text-red-500 text-xs mt-1.5 flex items-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                     </svg>
//                     {errors.firstName}
//                   </p>}
//                 </div>
//                 <div>
//                   <input
//                     type="text"
//                     name="lastName"
//                     value={form.lastName}
//                     onChange={handleChange}
//                     placeholder="Last name"
//                     className={`w-full border rounded-lg p-3.5 ${errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-pink-500'} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
//                   />
//                   {errors.lastName && <p className="text-red-500 text-xs mt-1.5 flex items-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                     </svg>
//                     {errors.lastName}
//                   </p>}
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <input
//                   type="text"
//                   name="company"
//                   value={form.company}
//                   onChange={handleChange}
//                   placeholder="Company (optional)"
//                   className="w-full border border-gray-300 rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
//                 />
//               </div>

//               <div className="mb-4">
//                 <input
//                   type="text"
//                   name="address1"
//                   value={form.address1}
//                   onChange={handleChange}
//                   placeholder="Address"
//                   className={`w-full border rounded-lg p-3.5 ${errors.address1 ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-pink-500'} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
//                 />
//                 {errors.address1 && <p className="text-red-500 text-xs mt-1.5 flex items-center">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                   {errors.address1}
//                 </p>}
//               </div>

//               <div className="mb-4">
//                 <input
//                   type="text"
//                   name="address2"
//                   value={form.address2}
//                   onChange={handleChange}
//                   placeholder="Apartment, suite, etc. (optional)"
//                   className="w-full border border-gray-300 rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <input
//                     type="text"
//                     name="city"
//                     value={form.city}
//                     onChange={handleChange}
//                     placeholder="City"
//                     className={`w-full border rounded-lg p-3.5 ${errors.city ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-pink-500'} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
//                   />
//                   {errors.city && <p className="text-red-500 text-xs mt-1.5 flex items-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                     </svg>
//                     {errors.city}
//                   </p>}
//                 </div>
//                 <div>
//                   <select
//                     name="country"
//                     value={form.country}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg p-3.5 bg-gray-50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
//                   >
//                     <option value="India">India</option>
//                     <option value="United States">United States</option>
//                     <option value="United Kingdom">United Kingdom</option>
//                     <option value="Canada">Canada</option>
//                     <option value="Australia">Australia</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <input
//                     type="text"
//                     name="postalCode"
//                     value={form.postalCode}
//                     onChange={handleChange}
//                     placeholder="Postal code"
//                     className={`w-full border rounded-lg p-3.5 ${errors.postalCode ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-pink-500'} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
//                   />
//                   {errors.postalCode && <p className="text-red-500 text-xs mt-1.5 flex items-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                     </svg>
//                     {errors.postalCode}
//                   </p>}
//                 </div>
//                 <div>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={form.phone}
//                     onChange={handleChange}
//                     placeholder="Phone number"
//                     className={`w-full border rounded-lg p-3.5 ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-pink-500'} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
//                   />
//                   {errors.phone && <p className="text-red-500 text-xs mt-1.5 flex items-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                     </svg>
//                     {errors.phone}
//                   </p>}
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-100">
//               <Link href="/cart" className="text-pink-600 hover:text-pink-700 font-medium text-sm flex items-center transition-colors">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M9.707 16.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L13.586 10H5a1 1 0 000 2h8.586l-3.293 3.293a1 1 0 001.414 1.414z" clipRule="evenodd" />
//                 </svg>
//                 Return to cart
//               </Link>
//             </div>

//             <div className="flex justify-end mt-6">
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-3.5 px-8 rounded-lg shadow-md transition-all duration-200 disabled:bg-pink-400 disabled:cursor-not-allowed flex items-center justify-center"
//               >
//                 {isSubmitting ? "Processing..." : "Proceed to Pay"}
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Right - Order Summary */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit sticky top-4">
//           <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">Order Summary</h2>

//           <div className="max-h-80 overflow-y-auto pr-2 mb-6">
//             {cartItems.map((item) => (
//               <div key={item._id || item.id} className="flex items-center py-4 border-b border-gray-100 last:border-b-0">
//                 <div className="relative w-16 h-16 rounded-lg overflow-hidden border bg-gray-100 flex-shrink-0">
//                   <Image
//                     src={item.image || "/default-product-image.jpg"}
//                     alt={item.name}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//                 <div className="ml-4 flex-1 min-w-0">
//                   <p className="font-medium text-gray-800 truncate">{item.name}</p>
//                   <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
//                   {item.color && (
//                     <div className="flex items-center mt-1">
//                       <span className="text-xs text-gray-500 mr-2">Color:</span>
//                       <div className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: item.color }}></div>
//                     </div>
//                   )}
//                 </div>
//                 <p className="text-gray-900 font-medium whitespace-nowrap pl-2">₹{(item.price * item.quantity).toLocaleString()}.00</p>
//               </div>
//             ))}
//           </div>

//           {/* <div className="mb-6">
//             <div className="flex items-center">
//               <input
//                 type="text"
//                 placeholder="Gift card or discount code"
//                 className="flex-1 border border-gray-300 rounded-l-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//               />
//               <button className="bg-gray-800 hover:bg-gray-900 text-white py-3 px-5 rounded-r-lg font-medium transition-colors duration-200">
//                 Apply
//               </button>
//             </div>
//           </div> */}


//           {/* Coupon */}
//           <div className="flex mt-4 mb-6">
//             <input
//               type="text"
//               value={couponCode}
//               onChange={(e) => setCouponCode(e.target.value)}
//               placeholder="Coupon Code"
//               className="flex-1 border rounded-l-lg p-3"
//             />
//             <button
//               type="button"
//               disabled={!couponCode.trim()}
//               onClick={handleApplyCoupon}
//               className="bg-gray-800 text-white px-5 rounded-r-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
//             >
//               Apply
//             </button>

//           </div>
//           {couponError && (
//             <p className="text-red-500 text-sm mt-2">{couponError}</p>
//           )}
//           {discount > 0 && (
//             <p className="text-green-600 text-sm mt-2">
//               Coupon applied: -₹{discount}
//             </p>
//           )}

//           <div className="mb-4">
//             <h3 className="font-medium text-gray-800 mb-2">Payment Method</h3>
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 name="paymentMethod"
//                 value="COD"
//                 checked={paymentMethod === "COD"}
//                 onChange={() => setPaymentMethod("COD")}
//                 className="mr-2"
//               />
//               <span>Cash on Delivery</span>
//             </label>
//             <label className="flex items-center mt-2">
//               <input
//                 type="radio"
//                 name="paymentMethod"
//                 value="Razorpay"
//                 checked={paymentMethod === "Razorpay"}
//                 onChange={() => setPaymentMethod("Razorpay")}
//                 className="mr-2"
//               />
//               <span>Razorpay</span>
//             </label>
//           </div>

//           <div className="space-y-3 text-gray-700">
//             <div className="flex justify-between">
//               <span>Subtotal</span>
//               <span>₹{subtotal.toLocaleString()}.00</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Shipping</span>
//               <span className="text-gray-500">Calculated at next step</span>
//             </div>
//             <div className="flex justify-between text-sm text-gray-500">
//               <span>Taxes</span>
//               <span>Calculated at next step</span>
//             </div>
//             <div className="flex justify-between pt-4 border-t border-gray-100 font-semibold text-lg text-gray-900">
//               <span>Total</span>
//               <span>₹{(subtotal - discount).toLocaleString()}.00</span>
//             </div>
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default CheckoutPage;



"use client";
import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

/** Helper: load Razorpay script exactly once and await readiness */
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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

const CheckoutPage = () => {
  const router = useRouter();
  const { cartItems, clearCart } = useContext(AppContext);

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    country: "India",
    postalCode: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

  // ---- TOKEN / USERID (client-only, safe decode) ----
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

  // ---- COMPUTED TOTALS ----
  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0),
    [cartItems]
  );
  const total = Math.max(0, subtotal - (Number(discount) || 0));

  // ---- FORM HANDLERS ----
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email is invalid";
    if (!form.firstName) newErrors.firstName = "First name is required";
    if (!form.lastName) newErrors.lastName = "Last name is required";
    if (!form.address1) newErrors.address1 = "Address is required";
    if (!form.city) newErrors.city = "City is required";
    if (!form.postalCode) newErrors.postalCode = "Postal code is required";
    if (!form.phone) newErrors.phone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---- COUPON ----
  const handleApplyCoupon = async () => {
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
        console.log("Coupon response data:", res.data);
        const amt = Number(res.data.discount) || 0;
        console.log("Coupon applied, discount:", amt);
        setDiscount(amt);
        setCouponError("");
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

  // ---- RAZORPAY ----
  const handleRazorpay = useCallback(
    async (orderPayload) => {
      const ready = await loadRazorpayScript();
      if (!ready || typeof window === "undefined" || !window.Razorpay) {
        alert("Unable to load Razorpay. Please try again.");
        return;
      }
      try {
        const res = await axios.post(`${API_BASE}/api/order/razorpay`, orderPayload);
        if (!res?.data?.success || !res?.data?.order?.id) {
          console.error("Failed to create Razorpay order:", res?.data);
          alert("Failed to create Razorpay order");
          return;
        }

        const order = res.data.order;
        const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!key) {
          console.error("Missing NEXT_PUBLIC_RAZORPAY_KEY_ID");
          alert("Payment configuration error");
          return;
        }

        const options = {
          key,
          amount: order.amount, // in paise
          currency: "INR",
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
                clearCart();
                router.push(`/frontend/order-success/${order.id}`);
              } else {
                alert("Payment verification failed!");
              }
            } catch (e) {
              console.error("Verification error:", e);
              alert("Payment verification error. Please contact support.");
            }
          },
          prefill: {
            name: `${form.firstName} ${form.lastName}`.trim(),
            email: form.email,
            contact: form.phone,
          },
          theme: { color: "#ec4899" },
          modal: {
            ondismiss: function () {
              alert("Payment cancelled. You can try again.");
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        console.error("Razorpay error:", error);
        alert("Error processing Razorpay payment");
      }
    },
    [router, form.firstName, form.lastName, form.email, form.phone, clearCart]
  );

  // ---- SUBMIT ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      userId: userId || null,
      items: cartItems.map((item) => ({
        productId: item._id || item.id,
        name: item.name,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 0,
        image: item.image || "/default-product-image.jpg",
      })),
      amount: total,
      address: form,
      couponCode: couponCode.trim() || "",
      discount: Number(discount) || 0,
      paymentMethod,
    };

    try {
      if (paymentMethod === "COD") {
        const res = await axios.post(`${API_BASE}/api/order/cod`, orderPayload);
        if (res?.data?.success) {
          clearCart();
          const orderId =
            res?.data?.order?._id ||
            res?.data?.order?.id ||
            res?.data?.orderId ||
            res?.data?.orderid;
          if (!orderId) {
            console.error("Order ID missing in COD response:", res?.data);
            alert("Order placed, but could not fetch order ID.");
            return;
          }
          router.push(`/frontend/order-success/${orderId}`);
        } else {
          alert(res?.data?.message || "Failed to place order.");
        }
      } else {
        await handleRazorpay(orderPayload);
      }
    } catch (err) {
      console.error("Order error:", err?.response?.data || err?.message);
      alert("Something went wrong. Try again!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Progress Bar */}
      {/* <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center text-pink-600">
              <span className="bg-pink-600 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium">1</span>
              <span className="ml-2 text-sm font-medium">Cart</span>
            </div>
            <div className="h-0.5 w-12 bg-gray-300 mx-2"></div>
            <div className="flex items-center text-pink-600">
              <span className="bg-pink-600 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium">2</span>
              <span className="ml-2 text-sm font-medium">Information</span>
            </div>
            <div className="h-0.5 w-12 bg-gray-300 mx-2"></div>
            <div className="flex items-center text-gray-500">
              <span className="border border-gray-300 rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium">3</span>
              <span className="ml-2 text-sm font-medium">Shipping</span>
            </div>
            <div className="h-0.5 w-12 bg-gray-300 mx-2"></div>
            <div className="flex items-center text-gray-500">
              <span className="border border-gray-300 rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium">4</span>
              <span className="ml-2 text-sm font-medium">Payment</span>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main */}
      <main className="flex-grow max-w-[1400px] border-t border-gray-400 w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12">
        {/* Left - Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-500 mb-6">Complete your purchase by filling the information below</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-pink-100 text-pink-800 rounded-full p-2 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
                Contact information
              </h2>
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email or mobile phone number"
                  className={`w-full border rounded-lg p-3.5 ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-pink-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>
              <label className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="mr-2 rounded text-pink-600 focus:ring-pink-500" />
                Email me with news and offers
              </label>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-pink-100 text-pink-800 rounded-full p-2 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </span>
                Shipping address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className={`w-full border rounded-lg p-3.5 ${errors.firstName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-pink-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className={`w-full border rounded-lg p-3.5 ${errors.lastName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-pink-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Company (optional)"
                  className="w-full border border-gray-300 rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  name="address1"
                  value={form.address1}
                  onChange={handleChange}
                  placeholder="Address"
                  className={`w-full border rounded-lg p-3.5 ${errors.address1 ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-pink-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                />
                {errors.address1 && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.address1}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  name="address2"
                  value={form.address2}
                  onChange={handleChange}
                  placeholder="Apartment, suite, etc. (optional)"
                  className="w-full border border-gray-300 rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    className={`w-full border rounded-lg p-3.5 ${errors.city ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-pink-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.city}
                    </p>
                  )}
                </div>
                <div>
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3.5 bg-gray-50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    placeholder="Postal code"
                    className={`w-full border rounded-lg p-3.5 ${errors.postalCode ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-pink-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.postalCode}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className={`w-full border rounded-lg p-3.5 ${errors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-pink-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-100">
              <Link href="/cart" className="text-pink-600 hover:text-pink-700 font-medium text-sm flex items-center transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L13.586 10H5a1 1 0 000 2h8.586l-3.293 3.293a1 1 0 001.414 1.414z" clipRule="evenodd" />
                </svg>
                Return to cart
              </Link>
              <div className="flex-1" />
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={isSubmitting || cartItems.length === 0}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-3.5 px-8 rounded-lg shadow-md transition-all duration-200 disabled:bg-pink-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? "Processing..." : "Proceed to Pay"}
              </button>
            </div>
          </form>
        </div>

        {/* Right - Order Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit sticky top-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">Order Summary</h2>

          <div className="max-h-80 overflow-y-auto pr-2 mb-6">
            {cartItems.map((item) => (
              <div key={item._id || item.id || item.name} className="flex items-center py-4 border-b border-gray-100 last:border-b-0">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border bg-gray-100 flex-shrink-0">
                  <Image
                    src={item.image || "/default-product-image.jpg"}
                    alt={item.name || "Product"}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  {item.color && (
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500 mr-2">Color:</span>
                      <div className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: item.color }}></div>
                    </div>
                  )}
                </div>
                <p className="text-gray-900 font-medium whitespace-nowrap pl-2">
                  ₹{((Number(item.price) || 0) * (Number(item.quantity) || 0)).toLocaleString()}.00
                </p>
              </div>
            ))}
          </div>

          {/* Coupon */}
          <div className="flex mt-4 mb-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Coupon Code"
              className="flex-1 border rounded-l-lg p-3"
            />
            <button
              type="button"
              disabled={!couponCode.trim()}
              onClick={handleApplyCoupon}
              className="bg-gray-800 text-white px-5 rounded-r-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
          {couponError && <p className="text-red-500 text-sm mt-2">{couponError}</p>}
          {discount > 0 && <p className="text-green-600 text-sm mt-2">Coupon applied: -₹{Number(discount).toLocaleString()}</p>}

          <div className="mb-4 mt-4">
            <h3 className="font-medium text-gray-800 mb-2">Payment Method</h3>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
                className="mr-2"
              />
              <span>Cash on Delivery</span>
            </label>
            <label className="flex items-center mt-2">
              <input
                type="radio"
                name="paymentMethod"
                value="Razorpay"
                checked={paymentMethod === "Razorpay"}
                onChange={() => setPaymentMethod("Razorpay")}
                className="mr-2"
              />
              <span>Razorpay</span>
            </label>
          </div>

          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}.00</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className={discount > 0 ? "text-green-600" : "text-gray-600"}>
                -₹{(Number(discount) || 0).toLocaleString()}.00
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-gray-500">Calculated at next step</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Taxes</span>
              <span>Calculated at next step</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-100 font-semibold text-lg text-gray-900">
              <span>Total</span>
              <span>₹{total.toLocaleString()}.00</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
