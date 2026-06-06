// 'use client';

// import React, { useContext, useState, useEffect } from 'react';
// import Link from 'next/link';
// import { AppContext } from '../context/AppContext';

// const CategoryShowcase = () => {
//   const {
//     toggleWishlist,
//     isInWishlist,
//     addToCart,
//     categories,
//     products
//   } = useContext(AppContext);

//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [activeCategoryId, setActiveCategoryId] = useState(null);

//   // ✅ set default category only after categories load
//   useEffect(() => {
//     if (categories.length > 0 && !activeCategoryId) {
//       setActiveCategoryId(categories[0]._id);
//     }
//   }, [categories, activeCategoryId]);

//   const getProductsByCategory = (categoryId) => {
//     if (!categoryId) return []; // ✅ guard against null/undefined

//     return products
//       .filter(product =>
//         Array.isArray(product.category) &&
//         product.category.some(catId => catId?.toString() === categoryId.toString())
//       )
//       .sort((a, b) => {
//         const priority = (product) => {
//           if (product.section?.includes('bestseller')) return 0;
//           if (product.section?.includes('newarrival')) return 1;
//           return 2;
//         };
//         return priority(a) - priority(b);
//       })
//       .slice(0, 8);
//   };

//   const getDiscountPercentage = (price, discountPrice) => {
//     return Math.round(((price - discountPrice) / price) * 100);
//   };

//   const handleVariantClick = (productId, variantIndex) => {
//     setSelectedVariants(prev => ({ ...prev, [productId]: variantIndex }));
//   };

//   const handleAddToCart = (product) => {
//     const selectedVariantIndex = selectedVariants[product._id] ?? 0;
//     const variant = product.variant?.[selectedVariantIndex];
//     if (variant) {
//       addToCart(product, variant, 1);
//     }
//   };

//   const activeCategory = categories.find(c => c._id === activeCategoryId);
//   const activeProducts = getProductsByCategory(activeCategoryId);

//   // 🚨 Show loading until categories/products are ready
//   if (categories.length === 0 || !activeCategoryId) {
//     return <p className="text-center py-10">Loading categories...</p>;
//   }

//   return (
//     <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//       {/* Section Heading */}
//       <div className="text-center mb-10">
//         <h2 className="text-4xl font-bold text-gray-900 mb-2">SHOP BY STYLE</h2>
//         <p className="text-gray-600 text-lg">Browse trending collections by category</p>
//       </div>

//       {/* Category Tabs */}
//       <div className="flex justify-center flex-wrap gap-4 mb-10">
//         {categories.map((category) => (
//           <button
//             key={category._id}
//             onClick={() => setActiveCategoryId(category._id)}
//             className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${activeCategoryId === category._id
//               ? 'bg-gray-900 text-white border-gray-900'
//               : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
//               }`}
//           >
//             {category.name}
//           </button>
//         ))}
//       </div>

//       {/* Product Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
//         {activeProducts.map((product) => {
//           const selectedIndex = selectedVariants[product._id] ?? 0;
//           const variant = product.variant[selectedIndex];

//           return (
//             <Link
//               key={product._id}
//               href={`/frontend/ProductDetail/${product.slug}`}
//               className="group block border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
//             >
//               <div className="relative aspect-square overflow-hidden bg-gray-50">
//                 <img
//                   src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.thumbImg}`}
//                   alt={product.name}
//                   className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
//                 />
//                 <img
//                   src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.galleryImg?.[1] || product.thumbImg}`}
//                   alt={product.name}
//                   className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//                 />
//               </div>

//               <div className="p-4">
//                 <h4 className="text-md font-semibold text-gray-900 line-clamp-2 mb-1">
//                   {product.name}
//                 </h4>

//                 {/* <div className="flex space-x-1 my-2">
//                   {product.variant.slice(0, 3).map((v, idx) => (
//                     <button
//                       type="button"
//                       key={idx}
//                       onClick={(e) => {
//                         e.preventDefault();
//                         handleVariantClick(product._id, idx);
//                       }}
//                       className={`w-4 h-4 rounded-full border ${
//                         selectedIndex === idx ? 'border-gray-900' : 'border-gray-300'
//                       }`}
//                       style={{ backgroundColor: v.colorcode }}
//                       title={v.color}
//                     />
//                   ))}
//                   {product.variant.length > 3 && (
//                     <div className="w-4 h-4 bg-gray-200 text-[10px] flex items-center justify-center rounded-full">
//                       +{product.variant.length - 3}
//                     </div>
//                   )}
//                 </div> */}

//                 <div className="flex items-center gap-2 mb-2">
//                   <span className="text-xl font-bold text-gray-900">₹{variant.discountPrice}</span>
//                   {variant.price > variant.discountPrice && (
//                     <>
//                       <span className="text-lg text-gray-500 line-through">₹{variant.price}</span>
//                       <span className="text-xs font-medium text-red-600">
//                         {getDiscountPercentage(variant.price, variant.discountPrice)}% OFF
//                       </span>
//                     </>
//                   )}
//                 </div>

//                 <div className="my-3">
//                   <button
//                     onClick={() => handleAddToCart(product)}
//                     className="w-full py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
//                   >
//                     Add to Cart
//                   </button>
//                 </div>
//               </div>
//             </Link>
//           );
//         })}
//       </div>

//       {activeProducts.length > 0 && (
//         <div className="mt-8 text-center">
//           <Link
//             href="/frontend/view-all"
//             className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 transition"
//           >
//             View all {activeCategory?.name}
//             <svg
//               className="w-4 h-4 ml-1"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//             </svg>
//           </Link>
//         </div>
//       )}
//     </section>
//   );
// };

// export default CategoryShowcase;

"use client";

import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const CategoryShowcase = () => {
  const { addToCart, categories, products } = useContext(AppContext);

  const [selectedVariants, setSelectedVariants] = useState({});
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  // ✅ Set default category
  useEffect(() => {
    if (categories.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categories[0]._id);
    }
  }, [categories, activeCategoryId]);

  const getProductsByCategory = (categoryId) => {
    if (!categoryId) return [];

    return products
      .filter(
        (product) =>
          Array.isArray(product.category) &&
          product.category.some(
            (catId) => catId?.toString() === categoryId.toString(),
          ),
      )
      .sort((a, b) => {
        const priority = (product) => {
          if (product.section?.includes("bestseller")) return 0;
          if (product.section?.includes("newarrival")) return 1;
          return 2;
        };
        return priority(a) - priority(b);
      })
      .slice(0, 8);
  };

  const getDiscountPercentage = (price, discountPrice) =>
    Math.round(((price - discountPrice) / price) * 100);

  const handleVariantClick = (productId, variantIndex) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variantIndex }));
  };

  // const handleAddToCart = (product) => {
  //   const selectedVariantIndex = selectedVariants[product._id] ?? 0;
  //   const variant = product.variant?.[selectedVariantIndex];
  //   if (!variant || variant.stock <= 0) return; // 🚨 Prevent adding if out of stock
  //   addToCart(product, variant, 1);
  // };

  // const handleAddToCart = (product) => {
  //   const selectedVariantIndex = selectedVariants[product._id] ?? 0;
  //   const variant = product.variant?.[selectedVariantIndex];

  //   // ❌ Stop if product stock is 0 or variant stock is 0
  //   if (product.stock <= 0 || !variant || variant.stock <= 0) return;

  //   addToCart(product, variant, 1);
  // };


  const handleAddToCart = (product) => {
  const selectedVariantIndex = selectedVariants[product._id] ?? 0;
  const variant = product.variant?.[selectedVariantIndex];

  if (product.stock <= 0 || !variant || variant.stock <= 0) {
    toast.error("This product is out of stock.");
    return;
  }

  addToCart(product, variant, 1);

  toast.success(`${product.name} added to cart!`, {
    position: "top-right",
    autoClose: 2000,
  });
};

  const activeCategory = categories.find((c) => c._id === activeCategoryId);
  const activeProducts = getProductsByCategory(activeCategoryId);

  if (categories.length === 0 || !activeCategoryId) {
    return <p className="text-center py-10">Loading categories...</p>;
  }

  return (
    <section className="max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8 sm:py-16 py-6">
      {/* Section Heading */}
      <div className="text-center mb-3">
        <h2 className="sm:text-4xl text-3xl font-semibold text-center uppercase text-black">
          SHOP BY STYLE
        </h2>
        <div className="flex items-center justify-center gap-3">
     <span className="text-[#6b40c2] text-xl">✦</span>
    <span className="w-28 h-[3px] bg-gray-300"></span>
    <span className="text-[#6b40c2] text-xl">✦</span>
    <span className="w-28 h-[3px] bg-gray-300"></span>
     <span className="text-[#6b40c2] text-xl">✦</span>
  </div>
        {/* <p className="text-gray-600 sm:text-lg text-sm">
          Discover the latest Syuta bags, styled for every occasion.
        </p> */}
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center flex-wrap gap-4 sm:mb-10 mb-6">
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => setActiveCategoryId(category._id)}
            className={`px-5 py-1 text-md font-bold  border border-b-3 transition-all ${
              activeCategoryId === category._id
                ? "bg-[#9594DA] text-white border-black shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {activeProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 sm:gap-8 gap-2">
          {activeProducts.map((product) => {
            const hasVariants =
              Array.isArray(product.variant) && product.variant.length > 0;
            const selectedIndex = selectedVariants[product._id] ?? 0;
            const safeSelectedIndex = hasVariants
              ? Math.min(Math.max(selectedIndex, 0), product.variant.length - 1)
              : 0;
            const variant = hasVariants
              ? product.variant?.[safeSelectedIndex]
              : null;

            // check both product stock and variant stock
            const outOfStock =
              product.stock <= 0 || !variant || variant.stock <= 0;

            const mainCardImg = variant?.image || product.thumbImg;

            return (
              <div
                key={product._id}
                className="border border-[#5a2bb9] rounded-md overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <Link
                  href={{
                    pathname: `/frontend/ProductDetail/${product.slug}`,
                    query: hasVariants ? { v: String(safeSelectedIndex) } : {},
                  }}
                >
                  <div className="group relative aspect-square bg-gray-50 overflow-hidden">
                    <img
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${mainCardImg}`}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                    />

                    <img
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${
                        product.galleryImg?.[1] || product.thumbImg
                      }`}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />

                    {outOfStock && (
                      <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  <Link href={`/frontend/ProductDetail/${product.slug}`}>
                    <h4 className="sm:text-md text-sm font-semibold capitalize text-gray-900 line-clamp-2 mb-1 hover:text-gray-700 transition">
                      {product.name}
                    </h4>

                    <h3 className="text-sm sm:text-md font-medium capitalize mb-2 line-clamp-2">
                      {product.shortDescription?.replace(/<[^>]*>/g, "")}
                    </h3>
                  </Link>

                  {variant && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="sm:text-xl text-md font-bold text-gray-900">
                        ₹{variant.discountPrice}
                      </span>
                      {variant.price > variant.discountPrice && (
                        <>
                          <span className="sm:text-lg text-sm text-gray-500 line-through">
                            ₹{variant.price}
                          </span>
                          <span className="text-xs font-medium text-red-600">
                            {getDiscountPercentage(
                              variant.price,
                              variant.discountPrice,
                            )}
                            % OFF
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Variants (Color) */}
                  {hasVariants && (
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {product.variant.map((v, idx) => {
                        const isActive = idx === safeSelectedIndex;
                        return (
                          <button
                            key={`${product._id}-variant-${idx}`}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleVariantClick(product._id, idx);
                            }}
                            title={v?.color || `Variant ${idx + 1}`}
                            className={`w-6 h-6 rounded-full border-2 transition-all ${
                              isActive
                                ? "border-[#7a1113] ring-2 ring-[#7a1113]/20"
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
                    className={`w-full py-2 text-sm rounded-md transition-colors ${
                      outOfStock
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#6b40c2] text-white hover:bg-black"
                    }`}
                  >
                    {outOfStock ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">No products found.</p>
      )}

      {/* {activeProducts.length > 0 && (
        <div className="sm:mt-8 mt-4 text-center">
          <Link
            href="/frontend/view-all"
            className="inline-flex items-center text-sm font-medium text-[#7a1113] hover:text-[#7a1113] transition"
          >
            View all {activeCategory?.name}
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      )} */}
    </section>
  );
};

export default CategoryShowcase;
