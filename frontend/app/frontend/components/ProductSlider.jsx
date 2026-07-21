// 'use client';

// import React, { useContext, useState } from 'react';
// import Slider from 'react-slick';

// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Link from 'next/link';
// import { AppContext } from '../context/AppContext';
// import { FiHeart } from 'react-icons/fi';

// const TABS = [
//   { id: 'newarrival', label: 'New Arrivals' },
//   { id: 'bestseller', label: 'Bestsellers' }
// ];

// const ProductTabsSlider = () => {
//   const [activeTab, setActiveTab] = useState(TABS[0].id);

//   const [selectedVariants, setSelectedVariants] = useState({});
//   const {
//     toggleWishlist,
//     isInWishlist,
//     addToCart,
//     products
//   } = useContext(AppContext);

//   const filteredProducts = products.filter(product =>
//     product.section.includes(activeTab)
//   );

//   const selectVariant = (productId, variantIndex) => {
//     setSelectedVariants(prev => ({
//       ...prev,
//       [productId]: variantIndex
//     }));
//   };

//    const handleAddToCart = (product) => {
//         const selectedVariantIndex = selectedVariants[product._id] ?? 0;
//         const variant = product.variant?.[selectedVariantIndex];
//         if (variant) {
//             addToCart(product, variant, 1);
//             // You can add a toast notification here if you want
//         }
//     };

//   const settings = {
//     dots: false,
//     infinite: false,
//     speed: 500,
//     slidesToShow: 4,
//     slidesToScroll: 1,
//     arrows: true,
//     responsive: [
//       {
//         breakpoint: 1280,
//         settings: {
//           slidesToShow: 3,
//           arrows: true
//         }
//       },
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 2,
//           arrows: true
//         }
//       },
//       {
//         breakpoint: 640,
//         settings: {
//           slidesToShow: 1,
//           arrows: false,
//           dots: true
//         }
//       }
//     ]
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       {/* Tabs */}
//       <div className="flex gap-8 mb-10 border-b border-gray-200">
//         {TABS.map(tab => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`pb-4 px-1 relative text-sm font-medium transition-colors duration-200 ${activeTab === tab.id
//                 ? 'text-indigo-600'
//                 : 'text-gray-500 hover:text-gray-700'
//               }`}
//           >
//             {tab.label}
//             {activeTab === tab.id && (
//               <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* Product Slider */}
//       <div className="relative">
//         <Slider {...settings}>
//           {filteredProducts.map((product) => {
//             const defaultVariantIndex = 0;
//             const selectedVariantIndex = selectedVariants[product._id] ?? defaultVariantIndex;
//             const variant = product.variant[selectedVariantIndex];
//             const discount = Math.round(
//               ((variant.price - variant.discountPrice) / variant.price) * 100
//             );
//             const isWishlisted = isInWishlist(product._id);

//             return (
//               <div key={product.id} className="px-3 focus:outline-none">
//                 <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group h-full flex flex-col">
//                   {/* Image Container */}
//                   <div className="relative aspect-square overflow-hidden">
//                     <Link href={`/frontend/ProductDetail/${product.slug}`} >
//                     <div className="relative h-full w-full transition-transform duration-500 group-hover:scale-105">
//                       <img
//                         src={`http://localhost:5000${product.thumbImg}`}

//                         alt={product.name}
//                         className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
//                       />
//                       <img
//                         src={`http://localhost:5000${product.galleryImg[1] || product.thumbImg }`}
//                         alt={product.name}
//                         className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//                       />
//                     </div>
//                     </Link>
//                     {/* Badges */}
//                     <div className="absolute top-3 left-3 flex gap-2">

//                       {/* {product.section.includes('newarrival') && (
//                         <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full">
//                           NEW
//                         </span>
//                       )} */}
//                     </div>

//                     {/* Wishlist Button */}
//                     <button
//                       onClick={() => toggleWishlist(product)}
//                       className={`absolute top-3 right-3 p-2 rounded-full shadow-sm transition-all z-10 ${isWishlisted
//                           ? 'text-red-500 bg-white'
//                           : 'text-gray-400 hover:text-red-500 bg-white hover:bg-gray-50'
//                         }`}
//                       aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
//                     >
//                       <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
//                     </button>
//                   </div>

//                   {/* Product Details */}
//                   <div className="p-4 flex-grow flex flex-col">
//                     <h3 className="text-md font-medium text-gray-900 mb-1 line-clamp-2">
//                       {product.name}
//                     </h3>

//                     {/* Price */}
//                     <div className="mt-auto">
//                       <div className="flex items-center gap-2 mb-3">
//                         {variant.price > variant.discountPrice && (
//                           <span className="text-lg text-gray-500 line-through">
//                             ₹{variant.price}
//                           </span>
//                         )}
//                         <span className="text-xl font-bold text-gray-900">
//                           ₹{variant.discountPrice}
//                         </span>

//                         {discount > 0 && (
//                           <span className=" text-xs font-medium text-red-600">
//                             {discount}% OFF
//                           </span>
//                         )}
//                       </div>

//                       <button  onClick={() => handleAddToCart(product)} className="w-full py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors">
//                         Add to Cart
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </Slider>
//       </div>
//     </div>
//   );
// };

// export default ProductTabsSlider;

"use client";

import React, { useContext, useState } from "react";
import Slider from "react-slick";
import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const ProductSlider = ({ title, sectionType }) => {
  const [selectedVariants, setSelectedVariants] = useState({});

  const { toggleWishlist, isInWishlist, addToCart, products } =
    useContext(AppContext);

  const filteredProducts = products.filter((product) =>
    product.section?.includes(sectionType),
  );

  const selectVariant = (productId, variantIndex) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variantIndex,
    }));
  };

  // const handleAddToCart = (product) => {
  //   const selectedVariantIndex = selectedVariants[product._id] ?? 0;
  //   const variant = product.variant?.[selectedVariantIndex];

  //   if (!variant || product.stock <= 0 || variant.stock <= 0) {
  //     alert("This product is out of stock.");
  //     return;
  //   }

  //   addToCart(product, variant, 1);
  // };

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

  const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: true,
  adaptiveHeight: true,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
        initialSlide: 0,
      },
    },
  ],
};
  return (
    <section className="max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8 py-10">
     <div className="mb-8">
  <h2 className="text-3xl sm:text-4xl font-bold text-center">{title}</h2>

  <div className="flex items-center justify-center gap-3">
     <span className="text-[#6b40c2] text-xl">✦</span>
    <span className="w-25 h-[3px] bg-gray-300"></span>
    <span className="text-[#6b40c2] text-xl">✦</span>
    <span className="w-25 h-[3px] bg-gray-300"></span>
     <span className="text-[#6b40c2] text-xl">✦</span>
  </div>
</div>

      <Slider
  key={filteredProducts.length}
  {...settings}
>
        {filteredProducts.map((product) => {
          const selectedIndex = selectedVariants[product._id] ?? 0;

          const variant = product.variant?.[selectedIndex];
          const hasVariants =
            Array.isArray(product.variant) && product.variant.length > 0;
          const safeSelectedIndex = hasVariants
            ? Math.min(Math.max(selectedIndex, 0), product.variant.length - 1)
            : 0;
          const safeVariant = hasVariants
            ? product.variant[safeSelectedIndex]
            : null;

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
          console.log("this is the product data", product);

          return (
            <div key={product._id} className="sm:px-3 px-1">
              <div className="bg-white border border-[#6b40c2] rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                <div className="relative aspect-square overflow-hidden">
                  <Link
                    href={{
                      pathname: `/frontend/ProductDetail/${product.slug}`,
                      query: hasVariants
                        ? { v: String(safeSelectedIndex) }
                        : {},
                    }}
                  >
                    <div className="relative h-full w-full group transition-transform duration-500">
                      {/* Main Image */}
                      <img
  loading="lazy"
  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${mainCardImg}`}
  alt={product.name}
  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
/>

<img
  loading="lazy"
  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${
    product.galleryImg?.[1] || mainCardImg
  }`}
  alt={product.name}
  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
/>
                    </div>
                  </Link>

                  {/* Wishlist */}
                  <button
                    onClick={() => toggleWishlist(product, safeSelectedIndex)}
                    className={`absolute top-3 right-3 p-2 rounded-full shadow-sm bg-white z-10 ${
                      isWishlisted
                        ? "text-red-500"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                  >
                    <FiHeart
                      className={`w-5 h-5 ${
                        isWishlisted ? "fill-current" : ""
                      }`}
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

                        <span className="font-bold">
                          ₹{safeVariant.discountPrice}
                        </span>

                        {discount > 0 && (
                          <span className="text-red-600 text-xs">
                            {discount}% OFF
                          </span>
                        )}
                      </div>

                      {/* Variants (Color) */}
                      {hasVariants && (
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {product.variant.map((v, i) => {
                            const isActive = i === safeSelectedIndex;
                            return (
                              <button
                                key={`${product._id}-variant-${i}`}
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
                                } flex items-center justify-center`}
                              >
                                <span
                                  className="w-4 h-4 rounded-full shadow-inner"
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
                        {outOfStock ? "Out of Stock" : "Add to Cart"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </section>
  );
};

export default ProductSlider;
