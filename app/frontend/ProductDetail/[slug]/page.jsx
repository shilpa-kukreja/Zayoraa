// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import { products } from '../../../../public/assets';
// import Image from 'next/image';
// import Link from 'next/link';
// import { FiShoppingCart, FiHeart, FiShare2, FiChevronRight, FiZoomIn, FiX } from 'react-icons/fi';
// import { FaCheck, FaTruck, FaShieldAlt, FaExchangeAlt } from 'react-icons/fa';
// import { IoIosArrowForward } from 'react-icons/io';
// import { motion, AnimatePresence } from 'framer-motion';
// import Footer from '../../components/Footer';
// import Navbar from '../../components/Navbar';
// import RecentlyViewed from '../../components/RecentlyViewed';
// import RelatedProducts from '../../components/RelatedProducts';

// const ProductDetail = () => {
//   const { slug } = useParams();
//   const product = products.find((p) => p.slug === slug);
//   const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
//   const [mainImage, setMainImage] = useState(product.thumbImg);
//   const [quantity, setQuantity] = useState(1);
//   const [pincode, setPincode] = useState('');
//   const [zoomImage, setZoomImage] = useState(false);
//   const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [activeTab, setActiveTab] = useState('description');
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [cartItems, setCartItems] = useState([]);

//   // Load cart and wishlist from localStorage on component mount
//   useEffect(() => {
//     const savedCart = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart')) || [] : [];
//     setCartItems(savedCart);

//     const wishlist = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('wishlist')) || [] : [];
//     setIsWishlisted(wishlist.some(item => item.id === product.id));

//     // Track recently viewed
//     const recent = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
//     const updated = [
//       product,
//       ...recent.filter((p) => p.id !== product.id),
//     ].slice(0, 10);
//     localStorage.setItem('recentlyViewed', JSON.stringify(updated));
//   }, [product]);

//   if (!product) return <div className="text-center py-20">Product not found.</div>;

//   const selectedVariant = product.variant[selectedVariantIndex];
//   const discount = Math.round(
//     ((selectedVariant.price - selectedVariant.discountPrice) / selectedVariant.price) * 100
//   );

//   const handleVariantChange = (index) => {
//     setSelectedVariantIndex(index);
//     setMainImage(product.galleryImg[index] || product.thumbImg);
//   };

//   const handleImageChange = (img) => {
//     setMainImage(img);
//   };

//   const handleQuantityChange = (value) => {
//     const newQuantity = quantity + value;
//     if (newQuantity > 0 && newQuantity <= selectedVariant.stock) {
//       setQuantity(newQuantity);
//     }
//   };

//   const handleMouseMove = (e) => {
//     if (!zoomImage) return;

//     const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
//     const x = ((e.clientX - left) / width) * 100;
//     const y = ((e.clientY - top) / height) * 100;
//     setZoomPosition({ x, y });
//   };

//   const toggleWishlist = () => {
//     const newWishlisted = !isWishlisted;
//     setIsWishlisted(newWishlisted);

//     let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

//     if (newWishlisted) {
//       // Add to wishlist
//       wishlist = [...wishlist, product];
//     } else {
//       // Remove from wishlist
//       wishlist = wishlist.filter(item => item.id !== product.id);
//     }

//     localStorage.setItem('wishlist', JSON.stringify(wishlist));
//   };

//   const addToCart = () => {
//     const cartItem = {
//       id: product.id,
//       slug: product.slug,
//       name: product.name,
//       image: product.thumbImg,
//       variant: selectedVariant,
//       quantity: quantity,
//       price: selectedVariant.discountPrice,
//       color: selectedVariant.color,
//       colorcode: selectedVariant.colorcode
//     };

//     let updatedCart = [...cartItems];
//     const existingItemIndex = updatedCart.findIndex(
//       item => item.id === product.id && item.color === selectedVariant.color
//     );

//     if (existingItemIndex >= 0) {
//       // Update quantity if item already in cart
//       updatedCart[existingItemIndex].quantity += quantity;
//     } else {
//       // Add new item to cart
//       updatedCart.push(cartItem);
//     }

//     setCartItems(updatedCart);
//     localStorage.setItem('cart', JSON.stringify(updatedCart));
//     setIsCartOpen(true);
//   };

//   const removeFromCart = (itemId, color) => {
//     const updatedCart = cartItems.filter(
//       item => !(item.id === itemId && item.color === color)
//     );

//     setCartItems(updatedCart);
//     localStorage.setItem('cart', JSON.stringify(updatedCart));
//   };

//   const updateCartItemQuantity = (itemId, color, newQuantity) => {
//     if (newQuantity < 1) return;

//     const updatedCart = cartItems.map(item => {
//       if (item.id === itemId && item.color === color) {
//         return { ...item, quantity: newQuantity };
//       }
//       return item;
//     });

//     setCartItems(updatedCart);
//     localStorage.setItem('cart', JSON.stringify(updatedCart));
//   };

//   const calculateCartTotal = () => {
//     return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
//   };

//   return (
//     <div>
//       <Navbar cartItems={cartItems} onCartClick={() => setIsCartOpen(!isCartOpen)} />

//       {/* Shopping Cart Sidebar */}
//       <AnimatePresence>
//         {isCartOpen && (
//           <motion.div 
//             initial={{ opacity: 0, x: '100%' }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: '100%' }}
//             transition={{ type: 'tween' }}
//             className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col"
//           >
//             <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//               <h2 className="text-lg font-semibold">Your Cart ({cartItems.length})</h2>
//               <button 
//                 onClick={() => setIsCartOpen(false)}
//                 className="p-2 rounded-full hover:bg-gray-100"
//               >
//                 <FiX className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto p-4">
//               {cartItems.length === 0 ? (
//                 <div className="text-center py-10">
//                   <p className="text-gray-500 mb-4">Your cart is empty</p>
//                   <button
//                     onClick={() => setIsCartOpen(false)}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                   >
//                     Continue Shopping
//                   </button>
//                 </div>
//               ) : (
//                 <ul className="space-y-4">
//                   {cartItems.map((item, index) => (
//                     <li key={`${item.id}-${item.color}`} className="flex gap-4 border-b pb-4">
//                       <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
//                         <Image
//                           src={item.image}
//                           alt={item.name}
//                           width={80}
//                           height={80}
//                           className="object-cover w-full h-full"
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <div className="flex justify-between">
//                           <h3 className="font-medium">{item.name}</h3>
//                           <button 
//                             onClick={() => removeFromCart(item.id, item.color)}
//                             className="text-gray-500 hover:text-red-500"
//                           >
//                             <FiX />
//                           </button>
//                         </div>
//                         <p className="text-sm text-gray-600">Color: {item.color}</p>
//                         <p className="font-semibold">₹{item.price.toLocaleString()}</p>
//                         <div className="flex items-center mt-2">
//                           <button
//                             onClick={() => updateCartItemQuantity(
//                               item.id, 
//                               item.color, 
//                               item.quantity - 1
//                             )}
//                             className="px-2 py-1 border rounded-l-md"
//                             disabled={item.quantity <= 1}
//                           >
//                             -
//                           </button>
//                           <span className="px-4 py-1 border-t border-b text-center w-12">
//                             {item.quantity}
//                           </span>
//                           <button
//                             onClick={() => updateCartItemQuantity(
//                               item.id, 
//                               item.color, 
//                               item.quantity + 1
//                             )}
//                             className="px-2 py-1 border rounded-r-md"
//                           >
//                             +
//                           </button>
//                         </div>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             {cartItems.length > 0 && (
//               <div className="border-t border-gray-200 p-4">
//                 <div className="flex justify-between mb-2">
//                   <span>Subtotal:</span>
//                   <span className="font-semibold">₹{calculateCartTotal().toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between mb-4">
//                   <span>Shipping:</span>
//                   <span className="font-semibold">FREE</span>
//                 </div>
//                 <div className="flex justify-between text-lg font-bold mb-4">
//                   <span>Total:</span>
//                   <span>₹{calculateCartTotal().toLocaleString()}</span>
//                 </div>
//                 <button className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
//                   Proceed to Checkout
//                 </button>
//                 <button
//                   onClick={() => setIsCartOpen(false)}
//                   className="w-full mt-2 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
//                 >
//                   Continue Shopping
//                 </button>
//               </div>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Overlay when cart is open */}
//       {isCartOpen && (
//         <div 
//           className="fixed inset-0  bg-opacity-30 z-40"
//           onClick={() => setIsCartOpen(false)}
//         />
//       )}

//       <div className={`max-w-7xl border-t border-gray-200 mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isCartOpen ? 'blur-sm' : ''}`}>
//         {/* Breadcrumb */}
//         <nav className="flex mb-6" aria-label="Breadcrumb">
//           <ol className="inline-flex items-center space-x-1 md:space-x-2">
//             <li className="inline-flex items-center">
//               <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
//                 Home
//               </Link>
//             </li>
//             <li>
//               <div className="flex items-center">
//                 <IoIosArrowForward className="w-4 h-4 text-gray-400 mx-1" />
//                 <Link href="/products" className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 transition-colors">
//                   Products
//                 </Link>
//               </div>
//             </li>
//             <li aria-current="page">
//               <div className="flex items-center">
//                 <IoIosArrowForward className="w-4 h-4 text-gray-400 mx-1" />
//                 <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{product.name}</span>
//               </div>
//             </li>
//           </ol>
//         </nav>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
//           {/* Left - Image Gallery */}
//           <div>
//             <div className="sticky top-[100px]">
//               <div className="flex flex-col md:flex-row gap-4">
//                 {/* Thumbnail Navigation */}
//                 <div className="flex md:flex-col gap-2 order-2 md:order-1">
//                   {product.galleryImg.map((img, i) => (
//                     <motion.button
//                       key={i}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => handleImageChange(img)}
//                       className={`w-16 h-16 border rounded-md overflow-hidden transition-all ${mainImage === img ? 'ring-2 ring-blue-500' : 'border-gray-200 hover:border-gray-400'}`}
//                     >
//                       <Image
//                         src={img}
//                         alt={`${product.name} thumbnail ${i + 1}`}
//                         width={64}
//                         height={64}
//                         className="object-cover w-full h-full"
//                       />
//                     </motion.button>
//                   ))}
//                 </div>

//                 {/* Main Image */}
//                 <div 
//                   className={`flex-1 bg-white border border-gray-200 rounded-lg shadow-sm order-1 md:order-2 relative ${zoomImage ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
//                   onClick={() => setZoomImage(!zoomImage)}
//                   onMouseMove={handleMouseMove}
//                   onMouseLeave={() => setZoomImage(false)}
//                 >
//                   <div className="relative aspect-square w-full overflow-hidden">
//                     <Image
//                       src={mainImage}
//                       alt={product.name}
//                       fill
//                       className={`w-full transition-transform duration-300 ${zoomImage ? 'scale-150' : 'scale-100'}`}
//                       style={zoomImage ? { 
//                         transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
//                         transform: 'scale(2)'
//                       } : {}}
//                       priority
//                     />
//                   </div>
//                   <button 
//                     className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setZoomImage(!zoomImage);
//                     }}
//                   >
//                     <FiZoomIn className="w-5 h-5 text-gray-700" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right - Product Details */}
//           <div>
//             <div className="mb-4 flex justify-between items-start">
//               <h1 className="text-2xl font-bold text-gray-600 mb-1">{product.name}</h1>
//               <button 
//                 onClick={toggleWishlist}
//                 className={`p-2 rounded-full ${isWishlisted ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'} transition-colors`}
//               >
//                 <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
//               </button>
//             </div>

//             <p className="text-gray-600 mb-3">{product.shortDescription}</p>

//             {/* Price Section */}
//             <div className="mb-6 px-4 py-2 bg-gray-50 rounded-lg">
//               <div className="flex items-center gap-3">
//                 <span className="text-xl font-bold text-gray-900">₹{selectedVariant.discountPrice.toLocaleString()}</span>
//                 {discount > 0 && (
//                   <>
//                     <span className="text-base text-gray-500 line-through">₹{selectedVariant.price.toLocaleString()}</span>
//                     <span className="text-green-800 text-sm font-medium px-2 py-0.5 rounded">
//                       {discount}% OFF
//                     </span>
//                   </>
//                 )}
//               </div>

//               {discount > 0 && (
//                 <div className="mt-2">
//                   <p className="text-sm text-green-600">
//                     You save: ₹{(selectedVariant.price - selectedVariant.discountPrice).toLocaleString()} ({discount}%)
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Color Variants */}
//             <div className="mb-6">
//               <div className="flex justify-between items-center mb-2">
//                 <h3 className="text-sm font-medium text-gray-900">
//                   Color: <span className="font-normal capitalize">{selectedVariant.color}</span>
//                 </h3>
//                 <span className="text-xs text-gray-500">
//                   {selectedVariantIndex + 1} of {product.variant.length}
//                 </span>
//               </div>
//               <div className="flex gap-3">
//                 {product.variant.map((v, i) => (
//                   <motion.button
//                     key={i}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => handleVariantChange(i)}
//                     className={`w-6 h-6 rounded-full border-2 ${selectedVariantIndex === i ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} flex items-center justify-center transition-all`}
//                     title={v.color}
//                   >
//                     <span 
//                       className="w-4 h-4 rounded-full shadow-inner" 
//                       style={{ backgroundColor: v.colorcode }}
//                     ></span>
//                   </motion.button>
//                 ))}
//               </div>
//             </div>

//             {/* Quantity Selector */}
//             <div className="mb-4">
//               <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
//               <div className="flex items-center border border-gray-300 rounded-md w-fit overflow-hidden">
//                 <motion.button 
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => handleQuantityChange(-1)}
//                   className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   disabled={quantity <= 1}
//                 >
//                   -
//                 </motion.button>
//                 <span className="px-4 py-1 text-center w-12 font-medium">{quantity}</span>
//                 <motion.button 
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => handleQuantityChange(1)}
//                   className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   disabled={quantity >= selectedVariant.stock}
//                 >
//                   +
//                 </motion.button>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-3 mb-8">
//               <motion.button 
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={addToCart}
//                 className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center gap-2 transition-colors shadow-md"
//               >
//                 <FiShoppingCart className="w-5 h-5" /> Add to Cart
//               </motion.button>
//               <motion.button 
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center gap-2 transition-colors shadow-md"
//               >
//                 Buy Now
//               </motion.button>
//             </div>

//             {/* Product Details Tabs */}
//             <div className="border-t border-gray-200 pt-6">
//               <div className="flex border-b border-gray-200 mb-6">
//                 <button
//                   onClick={() => setActiveTab('description')}
//                   className={`px-4 py-2 font-medium text-sm ${activeTab === 'description' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
//                 >
//                   Description
//                 </button>
//               </div>

//               {activeTab === 'description' && (
//                 <div className="prose prose-sm max-w-none text-gray-600">
//                   <p>{product.description}</p>
//                 </div>
//               )}
//             </div>

//             {/* Share */}
//             <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
//               <button className="text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors">
//                 <FiShare2 className="w-5 h-5" />
//                 <span className="text-sm">Share Product</span>
//               </button>
//             </div>
//           </div>
//         </div>
//         <RecentlyViewed />
//         <RelatedProducts currentProduct={product} />
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default ProductDetail;


'use client';

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingCart, FiHeart, FiShare2, FiChevronRight, FiZoomIn, FiX, FiPlay, } from 'react-icons/fi';
import { FaCheck } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import RecentlyViewed from '../../components/RecentlyViewed';
import RelatedProducts from '../../components/RelatedProducts';
import { AppContext } from '../../context/AppContext';
import { useRouter } from "next/navigation";
import OrderSummary from '../../components/OrderSummary';



const ProductDetail = ({ productIDs }) => {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const initialVariantIndexParam = searchParams?.get("v");
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    calculateCartTotal,
    wishlist,
    toggleWishlist,
    products,
    isInWishlist,
    videos
  } = useContext(AppContext);
  const product = products.find((p) => p.slug === slug);

  console.log("videoshowdetail", videos)


  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [mainImage, setMainImage] = useState(product?.thumbImg || '');
  const [quantity, setQuantity] = useState(1);
  const [zoomImage, setZoomImage] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('description');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [productVideos, setProductVideos] = useState([]);
   const router = useRouter();


  useEffect(() => {

    if (product && videos) {
      const filtered = videos.filter((v) => v.productid._id === product._id.toString());
      console.log("filtered sdfsdf", videos);
      setProductVideos(filtered);
      console.log("filtered", filtered)
    }
  }, [product, videos]);

  console.log("productVideos", productVideos)


  const isWishlisted = isInWishlist(product?._id);

  useEffect(() => {
    if (product) {
      const idx = Number.isFinite(Number(initialVariantIndexParam))
        ? Number(initialVariantIndexParam)
        : 0;
      const safeIdx = Array.isArray(product.variant) && product.variant.length > 0
        ? Math.min(Math.max(idx, 0), product.variant.length - 1)
        : 0;

      setSelectedVariantIndex(safeIdx);

      const initialVariant = product.variant?.[safeIdx];
      setMainImage(initialVariant?.image || product.thumbImg);

      // Track recently viewed (one entry per product; most recent first)
      const productId = String(product._id ?? product.id ?? '');
      const recent = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
      const updated = [
        product,
        ...recent.filter((p) => String(p._id ?? p.id ?? '') !== productId),
      ].slice(0, 10);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      window.dispatchEvent(new Event('recentlyViewedUpdated'));
    }
  }, [product]);



  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-[#7a1113] border-t-transparent rounded-full animate-spin"></div>
        {/* <p className="mt-4 text-gray-600 text-lg font-medium">Loading product...</p> */}
      </div>
    );
  }


  const selectedVariant = product.variant[selectedVariantIndex];
  const discount = Math.round(
    ((selectedVariant.price - selectedVariant.discountPrice) / selectedVariant.price) * 100
  );

  const handleVariantChange = (index) => {
    setSelectedVariantIndex(index);
    const v = product.variant?.[index];
    setMainImage(v?.image || product.thumbImg);
  };

  const handleImageChange = (img) => {
    setMainImage(img);
  };

  const handleBuyNow = async () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!token) {
    router.push("/frontend/signin?from=checkout");
    return;
  }

  try {
    // Step 1: Add product to cart
    await axios.post(
      `${API_BASE}/api/cart`,
      { productId: product._id, quantity: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Step 2: Redirect to checkout page
    router.push("/frontend/checkout");
  } catch (err) {
    console.error("Error in Buy Now:", err);
  }
};



  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity > 0 && newQuantity <= selectedVariant.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/frontend/ProductDetail/${product.slug}`;
    const shareData = {
      title: product.name,
      text: `Check out this product: ${product.name}`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Product link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy link");
        console.error("Clipboard error:", err);
      }
    }
  };


  const handleMouseMove = (e) => {
    if (!zoomImage) return;

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product, selectedVariantIndex);
  };

  const matchedProducts = products.filter((p) =>
    product?.products?.map(String).includes(p._id?.toString())
  );






  return (
    <div>
      <Navbar />

      {/* Shopping Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
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
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-4 py-2 bg-[#8D6AF8] text-white rounded-md hover:bg-[#8D6AF8]"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {cartItems.map((item) => (
                    <li key={`${item.id}-${item.color}`} className="flex gap-4 border-b pb-4">
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
                            onClick={() => removeFromCart(item._id, item.color)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <FiX />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600">Color: {item.color}</p>
                        <p className="font-semibold">₹{item.price.toLocaleString()}</p>
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => updateCartItemQuantity(
                              item._id,
                              item.color,
                              item.quantity - 1
                            )}
                            className="px-2 py-1 border rounded-l-md"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-4 py-1 border-t border-b text-center w-12">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartItemQuantity(
                              item._id,
                              item.color,
                              item.quantity + 1
                            )}
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

            {/* {cartItems.length > 0 && (
              <div className="border-t border-gray-200 p-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{calculateCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span>Shipping:</span>
                  <span className="font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-bold mb-4">
                  <span>Total:</span>
                  <span>₹{calculateCartTotal().toLocaleString()}</span>
                </div>
                <Link href='/frontend/cart'> <button className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
                  Proceed to Checkout
                </button>
                </Link>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full mt-2 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Continue Shopping
                </button>
              </div>
            )} */}

            {/* {cartItems.length > 0 && (
              <div className="border-t border-gray-200 p-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{calculateCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span>Shipping:</span>
                  <span className="font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-bold mb-4">
                  <span>Total:</span>
                  <span>₹{calculateCartTotal().toLocaleString()}</span>
                </div>

               
                <button
                  onClick={() => {
                    const token =
                      typeof window !== "undefined"
                        ? localStorage.getItem("token")
                        : null;

                    if (token) {
                     
                      router.push("/frontend/checkout");
                    } else {
                      
                      router.push("/frontend/signin?from=checkout");
                    }
                  }}
                  className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full mt-2 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Continue Shopping
                </button>
              </div>
            )} */}

            {cartItems.length > 0 && (
              <div >
                <OrderSummary
                  subtotal={calculateCartTotal()} 
                  // onCheckout={() => {
                  //   setIsCartOpen(false);
                  //   router.push('/checkout');
                  // }} 
                />
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay when cart is open */}
      {isCartOpen && (
        <div
          className="fixed inset-0  bg-opacity-30 z-40"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <div className={`max-w-7xl border-t border-gray-200 mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isCartOpen ? 'blur-sm' : ''}`}>
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <IoIosArrowForward className="w-4 h-4 text-gray-400 mx-1" />
                <Link href="/products" className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 transition-colors">
                  Products
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <IoIosArrowForward className="w-4 h-4 text-gray-400 mx-1" />
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Image Gallery */}
          <div>
            <div className="sticky top-[100px]">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Thumbnail Navigation */}
                <div className="flex md:flex-col gap-2 order-2 md:order-1">
                  {(() => {
                    const base = [];
                    const vImg = selectedVariant?.image;
                    if (vImg) base.push(vImg);
                    if (product.thumbImg) base.push(product.thumbImg);
                    (product.galleryImg || []).forEach((img) => {
                      if (img) base.push(img);
                    });
                    // remove duplicates while preserving order
                    const seen = new Set();
                    const allImages = base.filter((img) => {
                      if (!img || seen.has(img)) return false;
                      seen.add(img);
                      return true;
                    });

                    return allImages.map((img, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleImageChange(img)}
                      className={`w-16 h-16 border rounded-md overflow-hidden transition-all ${mainImage === img ? 'ring-2 ring-blue-500' : 'border-gray-200 hover:border-gray-400'}`}
                    >
                      <Image
                        src={`http://localhost:5000${img}`}
                        alt={`${product.name} thumbnail ${i + 1}`}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </motion.button>
                    ));
                  })()}

                </div>

                {/* Main Image */}
                <div
                  className={`flex-1 bg-white border border-gray-200 rounded-lg shadow-sm order-1 md:order-2 relative ${zoomImage ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                  onClick={() => setZoomImage(!zoomImage)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setZoomImage(false)}
                >
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={mainImage && mainImage !== ""
                        ? `http://localhost:5000${mainImage}`
                        : "/placeholder.png"}

                      alt={product?.name || "product image"}
                      fill
                      className={`w-full transition-transform duration-300 ${zoomImage ? 'scale-150' : 'scale-100'}`}
                      style={zoomImage ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        transform: 'scale(2)'
                      } : {}}
                      priority
                    />

                  </div>
                  <button
                    className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomImage(!zoomImage);
                    }}
                  >
                    <FiZoomIn className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Product Details */}
          <div>
            <div className="sm:mb-4 mb-3 flex justify-between items-start">
              <h1 className="text-2xl font-bold text-gray-600 mb-1">{product.name}</h1>
              <button
                onClick={handleToggleWishlist}
                className={`p-2 rounded-full ${isWishlisted ? 'text-red-500 bg-red-50' : 'text-red-600 hover:text-red-700 hover:bg-gray-50'} transition-colors`}
              >
                <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="text-gray-600 mb-3" dangerouslySetInnerHTML={{ __html: product.shortDescription }} />



            {/* Price Section */}
            <div className="sm:mb-6 mb-3 px-4 py-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-gray-900">₹{selectedVariant.discountPrice.toLocaleString()}</span>
                {discount > 0 && (
                  <>
                    <span className="text-base text-gray-500 line-through">₹{selectedVariant.price.toLocaleString()}</span>
                    <span className="text-red-600 text-sm font-medium px-2 py-0.5 rounded">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {discount > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-[#7a1113]">
                    You save: ₹{(selectedVariant.price - selectedVariant.discountPrice).toLocaleString()} ({discount}%)
                  </p>
                </div>
              )}
            </div>

            {/* Color Variants */}
            <div className="sm:mb-6 mb-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-900">
                  Color: <span className="font-normal capitalize">{selectedVariant.color}</span>
                </h3>
                <span className="text-xs text-gray-500">
                  {selectedVariantIndex + 1} of {product.variant.length}
                </span>
              </div>
              <div className="flex gap-3 flex-wrap">
                {(product.variant || []).map((v, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleVariantChange(i)}
                    className={`w-7 h-7 rounded-full border-2 ${
                      selectedVariantIndex === i
                        ? 'border-[#8D6AF8] ring-2 ring-[#8D6AF8]/20'
                        : 'border-gray-200'
                    } flex items-center justify-center transition-all`}
                    title={v.color}
                  >
                    <span
                      className="w-4 h-4 rounded-full shadow-inner"
                      style={{ backgroundColor: v.colorcode }}
                    ></span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:mt-6 mt-3 sm:mb-5 mb-3 sm:w-[450px] w-[350px]">
              {matchedProducts.map((p) => (
                <Link
                  key={p._id}
                  href={`/frontend/ProductDetail/${p.slug}`}
                  className="group bg-white border border-[#8D6AF8] rounded-lg shadow-sm p-1 hover:shadow-md hover:border-[#7a1113] transition duration-300 cursor-pointer"
                >
                  <div className="sm:h-20 sm:w-20 w-20 h-20  mx-auto overflow-hidden rounded-md">
                    <img
                      src={
                        p.thumbImg?.startsWith("http")
                          ? p.thumbImg
                          : `http://localhost:5000${p.thumbImg}`
                      }
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <h3 className="mt-2 text-xs font-medium text-gray-700 truncate text-center">
                    {p.name}
                  </h3>
                </Link>
              ))}
            </div>







            {/* Quantity Selector */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
              <div className="flex items-center border border-gray-300 rounded-md w-fit overflow-hidden">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={quantity <= 1}
                >
                  -
                </motion.button>
                <span className="px-4 py-1 text-center w-12 font-medium">{quantity}</span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={quantity >= selectedVariant.stock}
                >
                  +
                </motion.button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex  flex-row gap-3 sm:mb-8 mb-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex-1 bg-[#8D6AF8] hover:bg-[#563ba5] text-white py-3 px-6 rounded-md font-medium flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <FiShoppingCart className="w-5 h-5" /> Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                Buy Now
              </motion.button>
            </div>

            {/* Product Details Tabs */}
            <div className="border-t border-gray-200 sm:pt-6 pt-3">
              <div className="flex border-b border-gray-200 sm:mb-6 mb-3">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`px-4 py-2 font-medium text-sm ${activeTab === 'description' ? 'text-[#8D6AF8] border-b-2 border-[#684db9]' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Description
                </button>
              </div>

              {activeTab === 'description' && (
                <div
                  className="prose prose-sm max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />

              )}
            </div>


            {/* Share */}
            <div className="flex justify-between items-center sm:mt-8 mt-4 pt-6  border-t border-gray-200">
              <button
                onClick={handleShare}
                className="text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors"
              >
                <FiShare2 className="w-5 h-5" />
                <span className="text-sm">Share Product</span>
              </button>
            </div>
          </div>
        </div>


        <div className="fixed top-1/2 right-4 -translate-y-1/2 flex flex-col gap-4 z-50">
          {productVideos.map((vid) => (
            <motion.div
              key={vid._id}
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              {/* Close / Cut Button */}
              <button
                onClick={() =>
                  setProductVideos((prev) => prev.filter((v) => v._id !== vid._id))
                }
                className="absolute top-2 right-2 z-10  text-[#7a1113] p-1 rounded-full hover:bg-red-600 transition"
              >
                <FiX className="w-4 h-4" />
              </button>

              {/* Video Thumbnail */}
              <button
                onClick={() => setSelectedVideo(vid.videourl)}
                className={`w-28 h-48 border rounded-md overflow-hidden relative group ${selectedVideo === vid.videourl ? "ring-2 ring-[#7a1113]" : ""
                  }`}
              >
                <video
                  src={`http://localhost:5000${vid.videourl} `}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  autoPlay
                />
                <div className="absolute inset-0 flex items-center justify-center  opacity-0 group-hover:opacity-100 transition">
                  <FiPlay className="text-white w-6 h-6" />
                </div>
              </button>
            </motion.div>
          ))}
        </div>




        {/* Video Popup Modal */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative rounded-2xl max-w-xs w-full  overflow-hidden"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-2 z-40 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition"
                >
                  <FiX className="w-4 h-4" />
                </button>

                {/* Video Player */}
                <video
                  src={`http://localhost:5000${selectedVideo} `}
                  controls
                  autoPlay
                  className="w-full max-h-[80vh] rounded-2xl"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <RecentlyViewed />
        <RelatedProducts currentProduct={product} />
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;