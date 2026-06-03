'use client';
import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiFilter, FiX, FiChevronDown, FiChevronUp, FiHeart, FiShoppingCart } from 'react-icons/fi';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AppContext } from '../context/AppContext';

export default function FeaturedCollection() {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filters, setFilters] = useState({
        availability: false,
        colors: [],
        categories: [],
        priceRange: [0, 5599],
        sortBy: 'featured'
    });
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [expandedFilters, setExpandedFilters] = useState({
        color: true,
        category: true,
        price: true
    });
    const [selectedVariants, setSelectedVariants] = useState({});

    const { 
        toggleWishlist,
        isInWishlist,
        addToCart,
        products, categories
    } = useContext(AppContext);

    const handleAddToCart = (product) => {
        const selectedVariantIndex = selectedVariants[product._id] ?? 0;
        const variant = product.variant?.[selectedVariantIndex];
        if (variant) {
            addToCart(product, variant, 1);
            // You can add a toast notification here if you want
        }
    };

    const handleWishlistToggle = (product) => {
        const selectedVariantIndex = selectedVariants[product._id] ?? 0;
        toggleWishlist(product, selectedVariantIndex);
        // You can add a toast notification here if you want
    };
                  
    // Initialize with new arrival products
    useEffect(() => {
        const newArrivals = products.filter(product =>
            product.section.includes('featuredcollection')
        );
        setFilteredProducts(newArrivals);
    }, []);

    // Apply filters
    useEffect(() => {
        let result = products.filter(product =>
            product.section.includes('featuredcollection')
        );

        if (filters.availability) {
            result = result.filter(product => parseInt(product.stock) > 0);
        }

        if (filters.colors.length > 0) {
            result = result.filter(product =>
                product.variant.some(v => filters.colors.includes(v.color)))
        }

        if (filters.categories.length > 0) {
            result = result.filter(product =>
                filters.categories.some(cat => product.category.includes(cat.toString())))
        }

        result = result.filter(product => {
            const minPrice = Math.min(...product.variant.map(v => v.discountPrice || v.price));
            const maxPrice = Math.max(...product.variant.map(v => v.discountPrice || v.price));
            return minPrice >= filters.priceRange[0] && maxPrice <= filters.priceRange[1];
        });

        switch (filters.sortBy) {
            case 'price-low':
                result.sort((a, b) => {
                    const aMin = Math.min(...a.variant.map(v => v.discountPrice || v.price));
                    const bMin = Math.min(...b.variant.map(v => v.discountPrice || v.price));
                    return aMin - bMin;
                });
                break;
            case 'price-high':
                result.sort((a, b) => {
                    const aMax = Math.max(...a.variant.map(v => v.discountPrice || v.price));
                    const bMax = Math.max(...b.variant.map(v => v.discountPrice || v.price));
                    return bMax - aMax;
                });
                break;
            case 'newest':
                result.sort((a, b) => parseInt(b._id) - parseInt(a._id));
                break;
            default:
                break;
        }

        setFilteredProducts(result);
    }, [filters]);

    const allColors = [...new Set(
        products.flatMap(product =>
            product.variant.map(v => v.color)
        )
    )];

    const handleColorChange = (color) => {
        setFilters(prev => {
            const newColors = prev.colors.includes(color)
                ? prev.colors.filter(c => c !== color)
                : [...prev.colors, color];
            return { ...prev, colors: newColors };
        });
    };

    const handleCategoryChange = (categoryId) => {
        setFilters(prev => {
            const newCategories = prev.categories.includes(categoryId)
                ? prev.categories.filter(c => c !== categoryId)
                : [...prev.categories, categoryId];
            return { ...prev, categories: newCategories };
        });
    };

    const toggleFilterSection = (section) => {
        setExpandedFilters(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const resetFilters = () => {
        setFilters({
            availability: false,
            colors: [],
            categories: [],
            priceRange: [0, 5599],
            sortBy: 'featured'
        });
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar/>

            <div className="w-full">
                <img
                    src="/banner/featurecollection.png"
                    alt="New Arrivals"
                    className="w-full object-cover"
                />
            </div>

            <div className='text-center sm:mt-6 mt-5'>
                <h1 className="text-2xl md:text-4xl font-bold mb-4">Featured Collection</h1>
            </div>

            <div className="container mx-auto px-4 sm:py-8 py-5">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Mobile Filters Button */}
                    <div className="lg:hidden flex justify-between items-center sm:mb-6 mb-3">
                        <button
                            onClick={() => setMobileFiltersOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#7a1113] text-white rounded-lg"
                        >
                            <FiFilter /> Filters
                        </button>
                        <div className="w-48">
                            <select
                                className="w-full border rounded-lg px-3 py-2 bg-white"
                                value={filters.sortBy}
                                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="newest">Newest</option>
                            </select>
                        </div>
                    </div>

                    {/* Mobile Filters Overlay */}
                    {mobileFiltersOpen && (
                        <div className="fixed inset-0 z-50  bg-opacity-50 lg:hidden">
                            <div className="absolute right-0 top-0 h-full w-4/5 bg-white overflow-y-auto p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">Filters</h2>
                                    <button onClick={() => setMobileFiltersOpen(false)}>
                                        <FiX size={24} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Availability */}
                                    <div className="pb-4 border-b border-gray-200">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="mobile-in-stock"
                                                checked={filters.availability}
                                                onChange={() => setFilters({ ...filters, availability: !filters.availability })}
                                                className="h-4 w-4 text-gray-600 rounded"
                                            />
                                            <label htmlFor="mobile-in-stock" className="ml-2 text-gray-700">
                                                In stock only
                                            </label>
                                        </div>
                                    </div>

                                    {/* Color */}
                                    <div className="pb-4 border-b border-gray-200">
                                        <button
                                            className="flex justify-between items-center w-full"
                                            onClick={() => toggleFilterSection('color')}
                                        >
                                            <h3 className="font-medium">COLOR</h3>
                                            {expandedFilters.color ? <FiChevronUp /> : <FiChevronDown />}
                                        </button>
                                        {expandedFilters.color && (
                                            <div className="mt-3 space-y-2">
                                                {allColors.map(color => {
                                                    const colorCount = products.filter(product =>
                                                        product.section.includes('featuredcollection') &&
                                                        product.variant.some(v => v.color === color)
                                                    ).length;

                                                    return (
                                                        <div key={color} className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                id={`mobile-color-${color}`}
                                                                checked={filters.colors.includes(color)}
                                                                onChange={() => handleColorChange(color)}
                                                                className="h-4 w-4 text-gray-600 rounded focus:ring-gray-500"
                                                            />
                                                            <label htmlFor={`mobile-color-${color}`} className="ml-2 text-gray-700 flex justify-between w-full">
                                                                <span>{color}</span>
                                                                <span className="text-gray-500">({colorCount})</span>
                                                            </label>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {/* Category */}
                                    <div className="pb-4 border-b border-gray-200">
                                        <button
                                            className="flex justify-between items-center w-full"
                                            onClick={() => toggleFilterSection('category')}
                                        >
                                            <h3 className="font-medium">CATEGORY</h3>
                                            {expandedFilters.category ? <FiChevronUp /> : <FiChevronDown />}
                                        </button>
                                        {expandedFilters.category && (
                                            <div className="mt-3 space-y-2">
                                                {categories.map(category => (
                                                    <div key={category._id} className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id={`mobile-category-${category._id}`}
                                                            checked={filters.categories.includes(category._id.toString())}
                                                            onChange={() => handleCategoryChange(category._id.toString())}
                                                            className="h-4 w-4 text-gray-600 rounded"
                                                        />
                                                        <label htmlFor={`mobile-category-${category._id}`} className="ml-2 text-gray-700">
                                                            {category.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Price */}
                                    <div className="pb-4 border-b border-gray-200">
                                        <button
                                            className="flex justify-between items-center w-full"
                                            onClick={() => toggleFilterSection('price')}
                                        >
                                            <h3 className="font-medium">PRICE</h3>
                                            {expandedFilters.price ? <FiChevronUp /> : <FiChevronDown />}
                                        </button>
                                        {expandedFilters.price && (
                                            <div className="mt-3 space-y-4">
                                                <div className="flex justify-between text-sm">
                                                    <span>₹{filters.priceRange[0]}</span>
                                                    <span>₹{filters.priceRange[1]}</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="5599"
                                                    value={filters.priceRange[1]}
                                                    onChange={(e) => setFilters({
                                                        ...filters,
                                                        priceRange: [filters.priceRange[0], parseInt(e.target.value)]
                                                    })}
                                                    className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-800"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={resetFilters}
                                            className="px-4 py-2 border border-gray-300 rounded-lg flex-1"
                                        >
                                            Reset
                                        </button>
                                        <button
                                            onClick={() => setMobileFiltersOpen(false)}
                                            className="px-4 py-2 bg-[#7a1113] text-white rounded-lg flex-1"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Desktop Filters */}
                    <div className="hidden lg:block w-1/4 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-semibold text-lg">FILTERS</h3>
                                <button
                                    onClick={resetFilters}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    Reset All
                                </button>
                            </div>

                            {/* Availability */}
                            <div className="mb-6 pb-6 border-b border-gray-100">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="in-stock"
                                        checked={filters.availability}
                                        onChange={() => setFilters({ ...filters, availability: !filters.availability })}
                                        className="h-4 w-4 text-gray-600 rounded focus:ring-gray-500"
                                    />
                                    <label htmlFor="in-stock" className="ml-2 text-gray-700">
                                        In stock only
                                    </label>
                                </div>
                            </div>

                            {/* Color */}
                            <div className="mb-6 pb-6 border-b border-gray-100">
                                <button
                                    className="flex justify-between items-center w-full mb-3"
                                    onClick={() => toggleFilterSection('color')}
                                >
                                    <h4 className="font-medium">COLOR</h4>
                                    {expandedFilters.color ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                                </button>
                                {expandedFilters.color && (
                                    <div className="space-y-2">
                                        {allColors.map(color => {
                                            const colorCount = products.filter(product =>
                                                product.section.includes('featuredcollection') &&
                                                product.variant.some(v => v.color === color)
                                            ).length;

                                            return (
                                                <div key={color} className="flex items-center justify-between w-full mb-2">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id={`color-${color}`}
                                                            checked={filters.colors.includes(color)}
                                                            onChange={() => handleColorChange(color)}
                                                            className="h-4 w-4 text-gray-600 rounded focus:ring-gray-500"
                                                        />
                                                        <label
                                                            htmlFor={`color-${color}`}
                                                            className="ml-2 text-gray-700 flex items-center space-x-2 cursor-pointer"
                                                        >
                                                            <span
                                                                className="h-4 w-4 rounded border"
                                                                style={{ backgroundColor: color }}
                                                            ></span>
                                                            <span>{color}</span>
                                                        </label>
                                                    </div>
                                                    <span className="text-gray-500">({colorCount})</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Category */}
                            <div className="mb-6 pb-6 border-b border-gray-100">
                                <button
                                    className="flex justify-between items-center w-full mb-3"
                                    onClick={() => toggleFilterSection('category')}
                                >
                                    <h4 className="font-medium">CATEGORY</h4>
                                    {expandedFilters.category ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                                </button>
                                {expandedFilters.category && (
                                    <div className="space-y-2">
                                        {categories.map(category => (
                                            <div key={category._id} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`category-${category._id}`}
                                                    checked={filters.categories.includes(category._id.toString())}
                                                    onChange={() => handleCategoryChange(category._id.toString())}
                                                    className="h-4 w-4 text-gray-600 rounded focus:ring-gray-500"
                                                />
                                                <label htmlFor={`category-${category._id}`} className="ml-2 text-gray-700">
                                                    {category.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Price */}
                            <div className="mb-2">
                                <button
                                    className="flex justify-between items-center w-full mb-3"
                                    onClick={() => toggleFilterSection('price')}
                                >
                                    <h4 className="font-medium">PRICE</h4>
                                    {expandedFilters.price ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                                </button>
                                {expandedFilters.price && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span>₹{filters.priceRange[0]}</span>
                                            <span>₹{filters.priceRange[1]}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="5599"
                                            value={filters.priceRange[1]}
                                            onChange={(e) => setFilters({
                                                ...filters,
                                                priceRange: [filters.priceRange[0], parseInt(e.target.value)]
                                            })}
                                            className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-800"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="w-full lg:w-3/4">
                        {/* Sort By - Desktop */}
                        <div className="hidden lg:flex justify-between items-center sm:mb-4 mb-3">
                            <span className="text-gray-600">{filteredProducts.length} products</span>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Sort by:</span>
                                <select
                                    className="border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                    value={filters.sortBy}
                                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                >
                                    <option value="featured">Featured</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="newest">Newest</option>
                                </select>
                            </div>
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className="text-center sm:py-16 py-6 bg-white rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-xl font-medium text-gray-700 mb-4">No products match your filters</h3>
                                <button
                                    onClick={resetFilters}
                                    className="px-6 py-2 bg-[#7a1113] text-white rounded-lg hover:bg-[#7a1113] transition"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 gap-2">
                                {filteredProducts.map(product => {
                                    const minPrice = Math.min(...product.variant.map(v => v.discountPrice || v.price));
                                    const maxPrice = Math.max(...product.variant.map(v => v.discountPrice || v.price));
                                    const hasDiscount = product.variant.some(v => v.discountPrice);
                                    const discountPercentage = hasDiscount
                                        ? Math.round(
                                            (1 -
                                                (product.variant.find(v => v.discountPrice)?.discountPrice /
                                                    product.variant.find(v => v.discountPrice)?.price)) * 100
                                        )
                                        : 0;

                                    const inStock = parseInt(product.stock) > 0;

                                    return (
                                        <div key={product._id} className="group relative">
                                            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 h-full flex flex-col border border-[#7a1113]">

                                                {/* Wishlist Button */}
                                                <button
                                                    onClick={() => handleWishlistToggle(product)}
                                                    className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
                                                    aria-label={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                                                >
                                                    <FiHeart
                                                        size={20}
                                                        className={isInWishlist(product._id) ? "text-red-500 fill-red-500" : "text-[#7a1113]"}
                                                    />
                                                </button>

                                                <Link href={`/frontend/ProductDetail/${product.slug}`} className="block">
                                                    <div className="relative aspect-square overflow-hidden">
                                                        <Image
                                                            src={`http://localhost:5000${product.thumbImg}`}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover transition duration-300 group-hover:scale-105"
                                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                                            priority={filteredProducts.indexOf(product) < 6}
                                                        />

                                                        {/* Discount Badge */}
                                                        {/* {hasDiscount && (
                                                            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                                                                -{discountPercentage}%
                                                            </div>
                                                        )} */}

                                                        {/* Out of Stock Badge */}
                                                        {!inStock && (
                                                            <div className="absolute inset-0  bg-opacity-50 flex items-center justify-center">
                                                                <span className="text-white font-semibold text-sm bg-red-600 px-3 py-1 rounded-md">
                                                                    Out of Stock
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>

                                                <div className="p-3 flex-grow flex flex-col">
                                                    <Link href={`/products/${product.slug}`}>
                                                        <h3 className="font-semibold line-clamp-2 text-gray-900 mb-1 hover:text-gray-600 transition">
                                                            {product.name}
                                                        </h3>
                                                    </Link>

                                                    <div className="mt-auto">
                                                        <div className="flex items-center">
                                                            {minPrice !== maxPrice ? (
                                                                <span className="text-gray-900 font-bold">
                                                                    ₹{minPrice}
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-900 font-semibold">₹{maxPrice}</span>
                                                            )}
                                                            {hasDiscount && (
                                                                <span className="ml-2 text-sm text-gray-500 line-through">
                                                                    ₹{product.variant.find(v => v.discountPrice)?.price}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="mt-2">
                                                            {inStock ? (
                                                                <button
                                                                    onClick={() => handleAddToCart(product)}
                                                                    className="w-full py-2 text-sm bg-[#7a1113] text-white rounded-md hover:bg-[#7a1113] transition-colors"
                                                                    aria-label="Add to cart"
                                                                >
                                                                    Add To Cart
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    disabled
                                                                    className="w-full py-2 text-sm bg-gray-300 text-gray-600 rounded-md cursor-not-allowed"
                                                                >
                                                                    Out of Stock
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};