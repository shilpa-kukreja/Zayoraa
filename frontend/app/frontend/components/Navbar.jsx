"use client";

import React, { useContext, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AppContext } from "../context/AppContext";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { HeartPlus } from "lucide-react";

const BACKEND_URL =
  (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000").replace(
    /\/$/,
    "",
  );

const resolveMediaUrl = (path, fallback = "/logos/logo6.png") => {
  if (!path || typeof path !== "string") return fallback;
  const trimmed = path.trim();
  if (!trimmed) return fallback;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `${BACKEND_URL}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
};

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  const { wishlist, products, getCartCount, categories, setIsWishlistOpen } =
    useContext(AppContext);

  const cartCount = getCartCount();

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detect login + fetch user
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/getuser`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setUser(data.user);
        })
        .catch((err) => console.error("User fetch failed:", err));
    }
  }, []);

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSearchOpen &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
      if (
        isUserMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen, isUserMenuOpen]);

  // Handle search
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 0) {
      const filteredProducts = products
        .filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 10);

      setSearchResults(filteredProducts);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/frontend/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleResultClick = (slug) => {
    router.push(`/frontend/ProductDetail/${slug}`);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    router.push("/frontend/login");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="sm:max-w-[1650px] mx-auto h-[72px] px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          {/* <Link href="/" className="flex-shrink-0">
          <img
            src="https://miraggiolife.com/cdn/shop/files/Miraggio_Logo_1_1.png?v=1727936990&width=324"
            alt="Logo"
            className="h-10 w-auto"
          />
        </Link> */}

          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-2xl text-gray-700"
              onClick={() => setIsSidebarOpen(true)}
            >
              <FiMenu />
            </button>
            <Link
              href="/"
              className="hidden sm:block flex-shrink-0 sm:mr-2 mr-0"
            >
              <img
                src="/logo/logo.png"
                alt="Logo"
                className="sm:h-12 h-10 w-auto"
              />
            </Link>
            <Link
              href="/"
              className="block sm:hidden flex-shrink-0 sm:mr-2 mr-0"
            >
              <div className="px-5 ">
                <img
                  src="/logo/logo.png"
                  alt="Logo"
                  className="sm:h-12 h-8  w-auto"
                />
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8 text-gray-700 font-bold ">
            {/* <Link
              href="/frontend/holiday-collection"
              className="hover:text-black text-md transition"
            >
              Holiday Collection
            </Link> */}
              <Link
              href="/"
              className="hover:text-black text-md transition"
            >
              Home
            </Link>
            <Link
              href="/frontend/new-arrivals"
              className="hover:text-black text-md transition"
            >
              New Arrivals
            </Link>
            <Link
              href="/frontend/best-sellers"
              className="hover:text-black text-md transition"
            >
              Best Sellers
            </Link>

            {/* Category Dropdown */}
            <div className="relative">
              <button
                className="flex items-center text-md space-x-1 hover:text-black transition "
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              >
                <span>Shop By Category</span>
                <svg
                  className={`h-4 w-4 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isCategoryOpen && (
                <div className="absolute left-0 mt-3 w-64 bg-white rounded-lg shadow-xl z-50 p-4 grid grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      href={
                        category.slug
                          ? `/frontend/category/${category.slug}`
                          : "/frontend/view-all"
                      }
                      className="group flex flex-col items-center text-center"
                      onClick={() => setIsCategoryOpen(false)}
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden mb-2 group-hover:shadow-md">
                        <img
                          src={resolveMediaUrl(category?.img)}
                          alt={category?.name || "Category"}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700 group-hover:text-black">
                        {category.name}
                      </span>
                    </Link>
                  ))}
                  <Link
                    key="view-all"
                    href="/frontend/view-all"
                    className="group flex flex-col items-center text-center"
                  >
                    <span className="text-xs border bg-[#6b40c2] border-[#2f1466] rounded-md px-2 py-1 font-medium text-white group-hover:text-white">
                      View All
                    </span>
                  </Link>
                </div>
              )}
            </div>

            {/* <Link
              href="/frontend/featured-collection"
              className="hover:text-black text-md transition"
            >
              Featured Collection
            </Link> */}

             <Link
              href="/frontend/blogs"
              className="hover:text-black text-md transition"
            >
              Blogs
            </Link>

              <Link
              href="/frontend/contact-us"
              className="hover:text-black text-md transition"
            >
              Contact Us
            </Link>
            {/* <Link
              href="/frontend/under-400"
              className="hover:text-black text-md transition"
            >
              Under 499
            </Link> */}
          </div>

          {/* Right Section */}
          <div className="flex items-center sm:space-x-0 -2   space-x-1 gap-4">
            {/* Search */}
            <div className="relative " ref={searchRef}>
              <button
                aria-label="Search"
                className="py-2 px-1 "
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <img
                  src="https://img.icons8.com/ios-glyphs/30/000000/search--v1.png"
                  alt="Search"
                  className=" w-5  sm:h-6 sm:w-6 hover:opacity-70"
                />
              </button>
              {isSearchOpen && (
                <div className="absolute right-0 mt-3 sm:w-80 w-48 bg-white rounded-lg shadow-xl z-50 p-4">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-full p-2 border border-gray-300 rounded-md pl-9 focus:outline-none focus:ring-2 focus:ring-black"
                      autoFocus
                    />
                    <img
                      src="https://img.icons8.com/ios-glyphs/30/000000/search--v1.png"
                      alt="Search"
                      className="h-4 w-4 absolute left-2 top-3 opacity-50"
                    />
                  </form>
                  {searchResults.length > 0 && (
                    <div className="mt-3 max-h-60 overflow-y-auto">
                      {searchResults.map((product) => (
                        <div
                          key={product._id}
                          className="p-2 hover:bg-gray-100 cursor-pointer rounded-md flex items-center"
                          onClick={() => handleResultClick(product.slug)}
                        >
                          <img
                            src={resolveMediaUrl(product.thumbImg)}
                            alt={product.name}
                            className="h-10 w-10 object-cover rounded-md mr-3"
                          />
                          <p className="text-sm font-medium">{product.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User / Login */}
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none transition-all duration-200 hover:opacity-80"
                  aria-label="User menu"
                  aria-expanded={isUserMenuOpen}
                >
                  {user?.img ? (
                    <img
                      src={resolveMediaUrl(user.img)}
                      alt="User profile"
                      className="h-9 w-9 rounded-full object-cover border-2 border-white shadow-md"
                    />
                  ) : (
                    <div className="sm:h-7 sm:w-7 h-6 w-6 rounded-full bg-[#6b40c2] text-white flex items-center justify-center text-sm font-medium shadow-md">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  {/* <span className="hidden md:inline-block text-sm font-medium text-gray-700">
                  {user?.username || "User"}
                </span> */}
                  {/* <svg
                  className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg> */}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.username || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email || ""}
                      </p>
                    </div>

                    <Link
                      href="/frontend/dashboard"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-150"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <svg
                        className="h-5 w-5 text-gray-400 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      My Dashboard
                    </Link>

                    <Link
                      href="/frontend/orders"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-150"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <svg
                        className="h-5 w-5 text-gray-400 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      My Orders
                    </Link>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                    >
                      <svg
                        className="h-5 w-5 text-red-500 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/frontend/signin">
                <button
                  aria-label="Login"
                  className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <svg
                    className="h-6 w-6 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="hidden md:inline text-sm font-medium text-gray-700">
                    Sign In
                  </span>
                </button>
              </Link>
            )}

            {/* Wishlist */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-1"
              aria-label="Wishlist"
            >
              <HeartPlus className="h-6 w-6 hover:opacity-70 text-red-700" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] bg-red-500 text-white flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <Link
              href="/frontend/cart"
              className="relative p-1 mr-2"
              aria-label="Cart"
            >
              <img
                src="https://img.icons8.com/?size=100&id=3686&format=png&color=000000"
                alt="Cart"
                className="h-5 w-5 hover:opacity-70"
              />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] bg-black text-white flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-50 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0  bg-opacity-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>

        {/* Sidebar content */}
        <div className="relative w-72 bg-white h-full shadow-xl p-5 flex flex-col">
          {/* Close Button */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-black transition"
          >
            <FiX />
          </button>

          <h2 className="text-xl font-semibold mb-6 border-b pb-3 text-gray-800">
            Menu
          </h2>

          {/* Links */}
          <div className="flex flex-col space-y-4 mb-6">
            <Link
              href="/"
              className="hover:text-black text-sm text-gray-700 transition"
              onClick={() => setIsSidebarOpen(false)}
            >
              Home
            </Link>
            {/* <Link
              href="/frontend/holiday-collection"
              className="hover:text-black text-sm text-gray-700 transition"
              onClick={() => setIsSidebarOpen(false)}
            >
              Holiday Collection
            </Link> */}
            <Link
              href="/frontend/new-arrivals"
              className="hover:text-black text-sm text-gray-700 transition"
              onClick={() => setIsSidebarOpen(false)}
            >
              New Arrivals
            </Link>
            <Link
              href="/frontend/best-sellers"
              className="hover:text-black text-sm text-gray-700 transition"
              onClick={() => setIsSidebarOpen(false)}
            >
              Best Sellers
            </Link>
            {/* <Link
              href="/frontend/featured-collection"
              className="hover:text-black text-sm text-gray-700 transition"
              onClick={() => setIsSidebarOpen(false)}
            >
              Featured Collection
            </Link> */}
            {/* <Link
              href="/frontend/under-400"
              className="hover:text-black text-sm text-gray-700 transition"
              onClick={() => setIsSidebarOpen(false)}
            >
              Under 499
            </Link> */}
            <Link
              href="/frontend/blogs"
              className="hover:text-black text-sm text-gray-700 transition"
              onClick={() => setIsSidebarOpen(false)}
            >
              Blogs
            </Link>
               <Link
              href="/frontend/contact-us"
              className="hover:text-black text-sm text-gray-700 transition"
              onClick={() => setIsSidebarOpen(false)}
            >
              Contact Us
            </Link>
          </div>

          {/* Categories Dropdown */}
          <div className="border-t pt-4">
            <button
              className="w-full flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 transition"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <span className="font-medium text-gray-800">
                Shop By Category
              </span>
              <FiChevronDown
                className={`transform transition-transform duration-300 ${
                  isCategoryOpen ? "rotate-180 text-gray-900" : "text-gray-500"
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isCategoryOpen
                  ? "max-h-96 opacity-100 mt-2"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="ml-3 space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    href={
                      category.slug
                        ? `/frontend/category/${category.slug}`
                        : "/frontend/view-all"
                    }
                    className="block py-2 px-3 rounded-md text-gray-600 hover:bg-gray-100 hover:text-black transition"
                    onClick={() => {
                      setIsSidebarOpen(false);
                      setIsCategoryOpen(false);
                    }}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

// 'use client';

// import React, { useContext, useEffect, useState, useRef } from 'react';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { AppContext } from '../context/AppContext';
// import Image from 'next/image';
// import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";

// const Navbar = () => {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [scrolled, setScrolled] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isCategoryOpen, setIsCategoryOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState(null);
//   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
//   const searchRef = useRef(null);
//   const userMenuRef = useRef(null);

//   const {
//     wishlist,
//     products,
//     getCartCount,
//     categories,
//     setIsWishlistOpen,
//   } = useContext(AppContext);

//   const cartCount = getCartCount();

//   // Navbar scroll effect
//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Detect login + fetch user
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsLoggedIn(!!token);

//     if (token) {
//       fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/getuser`, {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//         .then(res => res.json())
//         .then(data => {
//           if (data.success) setUser(data.user);
//         })
//         .catch(err => console.error("User fetch failed:", err));
//     }
//   }, []);

//   // Handle click outside for dropdowns
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (isSearchOpen && searchRef.current && !searchRef.current.contains(event.target)) {
//         setIsSearchOpen(false);
//       }
//       if (isUserMenuOpen && userMenuRef.current && !userMenuRef.current.contains(event.target)) {
//         setIsUserMenuOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [isSearchOpen, isUserMenuOpen]);

//   // Handle search
//   const handleSearchChange = (e) => {
//     const query = e.target.value;
//     setSearchQuery(query);

//     if (query.length >= 0) {
//       const filteredProducts = products.filter(product =>
//         product.name.toLowerCase().includes(query.toLowerCase())
//       ).slice(0, 10);

//       setSearchResults(filteredProducts);
//       setIsSearchOpen(true);
//     } else {
//       setSearchResults([]);
//       setIsSearchOpen(false);
//     }
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       router.push(`/frontend/search?q=${encodeURIComponent(searchQuery)}`);
//       setIsSearchOpen(false);
//       setSearchQuery('');
//     }
//   };

//   const handleResultClick = (slug) => {
//     router.push(`/frontend/ProductDetail/${slug}`);
//     setIsSearchOpen(false);
//     setSearchQuery('');
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setIsLoggedIn(false);
//     setUser(null);
//     router.push("/frontend/login");
//   };

//   return (
//     <>
//       {/* Navbar */}
//       <nav className={`w-full sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
//         <div className="flex items-center justify-between px-6 md:px-12 py-4 bg-white">

//           {/* Left: Logo + Hamburger */}
//           <div className="flex items-center gap-4">
//             <button
//               className="md:hidden text-2xl text-gray-700"
//               onClick={() => setIsSidebarOpen(true)}
//             >
//               <FiMenu />
//             </button>
//             <Link href="/" className="flex-shrink-0">
//               <img
//                 src="https://miraggiolife.com/cdn/shop/files/Miraggio_Logo_1_1.png?v=1727936990&width=324"
//                 alt="Logo"
//                 className="h-10 w-auto"
//               />
//             </Link>
//           </div>

//           {/* Desktop Links */}
//           <div className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
//             <Link href="/frontend/holiday-collection" className="hover:text-black text-sm">Holiday Collection</Link>
//             <Link href="/frontend/new-arrivals" className="hover:text-black text-sm">New Arrivals</Link>
//             <Link href="/frontend/best-sellers" className="hover:text-black text-sm">Best Sellers</Link>
//             <Link href="/frontend/featured-collection" className="hover:text-black text-sm">Featured Collection</Link>
//             <Link href="/frontend/under-400" className="hover:text-black text-sm">Under 499</Link>
//           </div>

//           {/* Right: Icons */}
//           <div className="flex items-center space-x-4">
//             {/* Search */}
//             <div className="relative" ref={searchRef}>
//               <button aria-label="Search" onClick={() => setIsSearchOpen(!isSearchOpen)}>
//                 <img src="https://img.icons8.com/ios-glyphs/30/000000/search--v1.png" alt="Search" className="h-5 w-5 hover:opacity-70" />
//               </button>
//               {isSearchOpen && (
//                 <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl z-50 p-4">
//                   <form onSubmit={handleSearchSubmit} className="relative">
//                     <input
//                       type="text"
//                       placeholder="Search products..."
//                       value={searchQuery}
//                       onChange={handleSearchChange}
//                       className="w-full p-2 border border-gray-300 rounded-md pl-9 focus:outline-none focus:ring-2 focus:ring-black"
//                       autoFocus
//                     />
//                     <img src="https://img.icons8.com/ios-glyphs/30/000000/search--v1.png" alt="Search" className="h-4 w-4 absolute left-2 top-3 opacity-50" />
//                   </form>
//                   {searchResults.length > 0 && (
//                     <div className="mt-3 max-h-60 overflow-y-auto">
//                       {searchResults.map((product) => (
//                         <div key={product._id} className="p-2 hover:bg-gray-100 cursor-pointer rounded-md flex items-center" onClick={() => handleResultClick(product.slug)}>
//                           <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.thumbImg}`} alt={product.name} className="h-10 w-10 object-cover rounded-md mr-3" />
//                           <p className="text-sm font-medium">{product.name}</p>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Wishlist */}
//             <button onClick={() => setIsWishlistOpen(true)} className="relative p-2" aria-label="Wishlist">
//               <img src="https://img.icons8.com/?size=100&id=16076&format=png&color=000000" alt="Wishlist" className="h-5 w-5 hover:opacity-70" />
//               {wishlist.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] bg-pink-500 text-white flex items-center justify-center rounded-full">{wishlist.length}</span>}
//             </button>

//             {/* Cart */}
//             <Link href='/frontend/cart' className="relative p-2" aria-label="Cart">
//               <img src="https://img.icons8.com/?size=100&id=3686&format=png&color=000000" alt="Cart" className="h-5 w-5 hover:opacity-70" />
//               {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] bg-black text-white flex items-center justify-center rounded-full">{cartCount}</span>}
//             </Link>

//             {/* User / Login */}
//             {/* (same as your code, keeping it here unchanged for brevity) */}
//           </div>
//         </div>
//       </nav>

//       {/* Sidebar */}
//       <div className={`fixed inset-0 z-50 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
//         {/* Overlay */}
//         <div
//           className="absolute inset-0 bg-black bg-opacity-40"
//           onClick={() => setIsSidebarOpen(false)}
//         ></div>

//         {/* Sidebar content */}
//         <div className="relative w-72 bg-white h-full shadow-xl p-5">
//           {/* Close Button */}
//           <button
//             onClick={() => setIsSidebarOpen(false)}
//             className="absolute top-4 right-4 text-2xl text-gray-700"
//           >
//             <FiX />
//           </button>

//           <h2 className="text-lg font-semibold mb-4">Menu</h2>

//           {/* Categories Dropdown */}
//           <div>
//             <button
//               className="w-full flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-100"
//               onClick={() => setIsCategoryOpen(!isCategoryOpen)}
//             >
//               <span className="font-medium text-gray-800">Shop By Category</span>
//               <FiChevronDown
//                 className={`transform transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
//               />
//             </button>
//             {isCategoryOpen && (
//               <div className="ml-2 mt-2 space-y-2">
//                 {categories.map((category) => (
//                   <Link
//                     key={category._id}
//                     href={`/frontend/category/${category.slug}`}
//                     className="block py-1 px-2 rounded hover:bg-gray-100 text-gray-700"
//                     onClick={() => setIsSidebarOpen(false)}
//                   >
//                     {category.name}
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Navbar;
