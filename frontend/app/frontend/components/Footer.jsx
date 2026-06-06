// // components/Footer.jsx
// "use client";
// import Link from 'next/link';
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useState } from 'react';
// import {
//   FaInstagram, FaYoutube, FaFacebookF, FaWhatsapp,
//   FaPaypal, FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover,
//   FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaClock
// } from 'react-icons/fa';

// export default function Footer() {

//   const [email, setEmail] = useState('');

//   const handleSubscribe = async () => {
//     if (!email) {
//       alert('Please enter a valid email address.');
//       return;
//     }
//     try {
//        const response = await fetch('${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscription/subscribe', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         toast.success("Subscription successful!");
//         setEmail('');
//       } else {
//         toast.error(data.message || "Subscription failed. Please try again.");
//       }
//     } catch (error) {
//       console.error('Error subscribing:', error);
//       alert('An error occurred. Please try again later.');
//     }
//   };

//   return (
//     <footer className="bg-gray-900 text-white">
//       {/* Main Footer Content */}
//       <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
//         {/* Contact Information */}
//         <div>
//           <h3 className="text-lg font-bold mb-6 uppercase tracking-wider">Contact Us</h3>
//           <ul className="space-y-4 text-gray-300">
//             <li className="flex items-start">
//               <FaMapMarkerAlt className="mt-1 mr-3 flex-shrink-0" />
//               <span>123 Fashion Street, Mumbai, Maharashtra 400001, India</span>
//             </li>
//             <li className="flex items-center">
//               <FaPhoneAlt className="mr-3" />
//               <span>+91 98765 43210</span>
//             </li>
//             <li className="flex items-center">
//               <FaEnvelope className="mr-3" />
//               <span>hello@miraggio.com</span>
//             </li>
//             <li className="flex items-center">
//               <FaClock className="mr-3" />
//               <span>Mon-Sat: 10AM - 7PM</span>
//             </li>
//           </ul>
//         </div>

//         {/* Quick Links */}
//         <div>
//           <h3 className="text-lg font-bold mb-6 uppercase tracking-wider">Quick Links</h3>
//           <ul className="space-y-3 text-gray-300">
//             <li><Link href="/frontend/about-us" className="hover:text-white transition-colors">About Us</Link></li>
//             <li><Link href="/frontend/view-all" className="hover:text-white transition-colors">Our Collections</Link></li>
//             <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
//             <li><Link href="/frontend/blogs" className="hover:text-white transition-colors">Blog</Link></li>
//             <li><Link href="/frontend/contact-us" className="hover:text-white transition-colors">Contact-Us</Link></li>
//           </ul>
//         </div>

//         {/* Customer Service */}
//         <div>
//           <h3 className="text-lg font-bold mb-6 uppercase tracking-wider">Customer Service</h3>
//           <ul className="space-y-3 text-gray-300">
//             <li><Link href="/frontend/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
//             <li><Link href="/frontend/return-and-refund-policy" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
//             <li><Link href="/frontend/track-order" className="hover:text-white transition-colors">Order Tracking</Link></li>
//             <li><Link href="/frontend/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
//             <li><Link href="/frontend/login" className="hover:text-white transition-colors">login</Link></li>
//           </ul>
//         </div>

//         {/* Newsletter */}
//         <div>
//           <h3 className="text-lg font-bold mb-6 uppercase tracking-wider">Join Our Community</h3>
//           <p className="text-gray-300 mb-6">
//             Subscribe to receive updates, access to exclusive deals, and more.
//           </p>

//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleSubscribe();
//             }}
//             className="flex mb-8"
//           >
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Your email address"
//               required
//               className="flex-grow px-4 py-3 bg-white text-gray-800 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
//             />
//             <button
//               type="submit"
//               className="bg-[#9daed0] text-white px-6 py-3 rounded-r-lg font-medium transition-colors hover:bg-[#7f96c4]"
//             >
//               Subscribe
//             </button>
//           </form>


//           <div className="flex space-x-5">
//             <Link href="#" className="text-gray-400 hover:text-white transition-colors text-xl">
//               <FaFacebookF />
//             </Link>
//             <Link href="#" className="text-gray-400 hover:text-white transition-colors text-xl">
//               <FaInstagram />
//             </Link>
//             <Link href="#" className="text-gray-400 hover:text-white transition-colors text-xl">
//               <FaYoutube />
//             </Link>
//             <Link href="#" className="text-gray-400 hover:text-white transition-colors text-xl">
//               <FaWhatsapp />
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Divider */}
//       <div className="border-t border-gray-800"></div>

//       {/* Footer Bottom */}
//       <div className="max-w-7xl mx-auto px-6 md:px-8 py-6">
//         <div className="flex flex-col md:flex-row justify-between items-center">
//           {/* Copyright */}
//           <div className="text-gray-400 text-sm mb-4 md:mb-0">
//             © {new Date().getFullYear()} Miraggio. All rights reserved.
//           </div>

//           {/* Payment Methods */}
//           <div className="flex space-x-4 text-gray-400 text-2xl">
//             <FaCcVisa className="hover:text-white transition-colors" />
//             <FaCcMastercard className="hover:text-white transition-colors" />
//             <FaCcAmex className="hover:text-white transition-colors" />
//             <FaPaypal className="hover:text-white transition-colors" />
//             <FaCcDiscover className="hover:text-white transition-colors" />
//           </div>

//           {/* Country Selector */}
//           {/* <div className="flex items-center mt-4 md:mt-0">
//             <span className="mr-2 text-gray-400 text-sm">Region:</span>
//             <div className="relative">
//               <select className="bg-gray-800 text-white text-sm py-1 pl-2 pr-8 rounded focus:outline-none focus:ring-1 focus:ring-primary appearance-none">
//                 <option>India (INR ₹)</option>
//                 <option>United States (USD $)</option>
//                 <option>Europe (EUR €)</option>
//                 <option>UK (GBP £)</option>
//               </select>
//               <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
//                 <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//                 </svg>
//               </div>
//             </div>
//           </div> */}
//         </div>
//       </div>
//     </footer>
//   );
// }





// components/Footer.jsx
"use client";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import {
  FaInstagram,
  FaYoutube,
  FaFacebookF,
  FaWhatsapp,
  FaPaypal,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
} from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [openSection, setOpenSection] = useState(null);

  const handleSubscribe = async () => {
    if (!email) {
      alert("Please enter a valid email address.");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscription/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("Subscription successful!");
        setEmail("");
      } else {
        toast.error(data.message || "Subscription failed. Please try again.");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Contact Information */}
        <div>
          <button
            onClick={() => toggleSection("contact")}
            className="w-full flex justify-between items-center md:cursor-default md:pointer-events-none"
          >
            <h3 className="text-md sm:text-lg font-semibold uppercase tracking-wider">
              Contact Us
            </h3>
            <FiChevronDown
              className={`md:hidden transition-transform duration-300 ${
                openSection === "contact" ? "rotate-180" : ""
              }`}
            />
          </button>
          <ul
            className={`overflow-hidden transition-all duration-300 space-y-4 text-gray-300 mt-4 ${
              openSection === "contact" ? "max-h-96" : "max-h-0 md:max-h-none"
            } md:space-y-4`}
          >
            <li className="flex items-start">
              <FaMapMarkerAlt className="mt-1 mr-3 flex-shrink-0" />
              <span>123 Fashion Street, Mumbai, Maharashtra 400001, India</span>
            </li>
            <li className="flex items-center">
              <FaPhoneAlt className="mr-3" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center">
              <FaEnvelope className="mr-3" />
              <span>support@zayoraa.in</span>
            </li>
            <li className="flex items-center">
              <FaClock className="mr-3" />
              <span>Mon-Sat: 10AM - 7PM</span>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <button
            onClick={() => toggleSection("quick")}
            className="w-full flex justify-between items-center md:cursor-default md:pointer-events-none"
          >
            <h3 className="text-lg font-bold uppercase tracking-wider">
              Quick Links
            </h3>
            <FiChevronDown
              className={`md:hidden transition-transform duration-300 ${
                openSection === "quick" ? "rotate-180" : ""
              }`}
            />
          </button>
          <ul
            className={`overflow-hidden transition-all duration-300 space-y-3 text-gray-300 mt-4 ${
              openSection === "quick" ? "max-h-96" : "max-h-0 md:max-h-none"
            } md:space-y-3`}
          >
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/frontend/about-us"
                className="hover:text-white transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/frontend/view-all"
                className="hover:text-white transition-colors"
              >
                All Products
              </Link>
            </li>
            
            <li>
              <Link
                href="/frontend/blogs"
                className="hover:text-white transition-colors"
              >
                Blogs
              </Link>
            </li>
            <li>
              <Link
                href="/frontend/contact-us"
                className="hover:text-white transition-colors"
              >
                Contact-Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <button
            onClick={() => toggleSection("service")}
            className="w-full flex justify-between items-center md:cursor-default md:pointer-events-none"
          >
            <h3 className="text-lg font-bold uppercase tracking-wider">
              Customer Service
            </h3>
            <FiChevronDown
              className={`md:hidden transition-transform duration-300 ${
                openSection === "service" ? "rotate-180" : ""
              }`}
            />
          </button>
          <ul
            className={`overflow-hidden transition-all duration-300 space-y-3 text-gray-300 mt-4 ${
              openSection === "service" ? "max-h-96" : "max-h-0 md:max-h-none"
            } md:space-y-3`}
          >
            <li>
              <Link
                href="/frontend/shipping-policy"
                className="hover:text-white transition-colors"
              >
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link
                href="/frontend/return-and-refund-policy"
                className="hover:text-white transition-colors"
              >
                  Refund and Cancellation
              </Link>
            </li>
            
            <li>
              <Link
                href="/frontend/privacy-policy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            {/* <li>
              <Link
                href="/frontend/track-order"
                className="hover:text-white transition-colors"
              >
                Order Tracking
              </Link>
            </li> */}
            <li>
              <Link
                href="/frontend/login"
                className="hover:text-white transition-colors"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-bold mb-6 uppercase tracking-wider">
            Join Our Community
          </h3>
          <p className="text-gray-300 mb-6">
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubscribe();
            }}
            className="flex mb-8"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-grow px-4 py-3 bg-white text-gray-800 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-[#6b40c2] text-white px-6 py-3 rounded-r-lg font-medium transition-colors hover:bg-[#5e31b8]"
            >
              Subscribe
            </button>
          </form>

          <div className="flex space-x-5">
            <Link
              href="#"
              className="hover:text-gray-400 text-blue-600 transition-colors text-xl"
            >
              <FaFacebookF />
            </Link>
            <Link
              href="#"
              className="hover:text-gray-400 text-pink-600 transition-colors text-2xl"
            >
              <FaInstagram />
            </Link>
            <Link
              href="#"
              className="hover:text-gray-400 text-red-600 transition-colors text-2xl"
            >
              <FaYoutube />
            </Link>
            <Link
              href="#"
              className="hover:text-gray-400 text-green-500 transition-colors text-2xl"
            >
              <FaWhatsapp />
            </Link>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800"></div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Copyright */}
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Zayoraa. All rights reserved.
          </div>

          {/* Payment Methods */}
          <div className="flex space-x-4 text-gray-400 text-2xl">
            <FaCcVisa className="hover:text-white transition-colors" />
            <FaCcMastercard className="hover:text-white transition-colors" />
            <FaCcAmex className="hover:text-white transition-colors" />
            <FaPaypal className="hover:text-white transition-colors" />
            <FaCcDiscover className="hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
}
