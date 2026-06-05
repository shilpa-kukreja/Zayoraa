'use client';

import { useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaPaperPlane } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ContactPage() {
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      email: e.target.email.value,
      number: e.target.number.value,
      message: e.target.message.value,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contact/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        setResult("✅ Thank you! We will get back to you shortly.");
        e.target.reset();
      } else {
        setResult(result.error || "❌ Failed to send");
      }
    } catch (error) {
      console.error(error);
      setResult("❌ Server error, please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Sticky Top Navbar */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Navbar />
      </div>

      {/* Hero Banner */}
      <div className="relative w-full h-96 overflow-hidden">
        <img
          src="/contact-us/banner.png"
          alt="Contact Us"
          className="w-full h-full object-cover"
        />
        {/* <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-transparent flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Get in Touch</h1>
            <p className="text-xl text-white max-w-2xl">
              We'd love to hear from you. Let's start a conversation.
            </p>
          </div>
        </div> */}
      </div>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          {/* <span className="uppercase text-sm text-[#8a6edd] font-semibold tracking-widest">
            Contact Us
          </span> */}
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
           We’re Here for You
        </h2>
         <div className="flex items-center justify-center gap-3">
     <span className="text-[#6b40c2] text-xl">✦</span>
    <span className="w-35 h-[3px] bg-gray-300"></span>
    <span className="text-[#6b40c2] text-xl">✦</span>
    <span className="w-35 h-[3px] bg-gray-300"></span>
     <span className="text-[#6b40c2] text-xl">✦</span>
  </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions about our products or services? Fill out the form below and our team will get back to you shortly.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left - Contact Form */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Send us a message</h3>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D6AF8] focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D6AF8] focus:border-transparent transition"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D6AF8] focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="number"
                      name="number"
                      required
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D6AF8] focus:border-transparent transition"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full border border-gray-300 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#8D6AF8] focus:border-transparent transition"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#8D6AF8] hover:bg-[#815af5] text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane /> Send Message
                    </>
                  )}
                </button>
                
                {result && (
                  <div className={`p-3 rounded-lg text-center font-medium ${result.includes('✅') ? 'bg-green-100 text-[#7a1113]' : 'bg-red-100 text-red-700'}`}>
                    {result}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right - Contact Info */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-8 rounded-xl shadow-lg h-full">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-gray-50 p-3 rounded-full mr-4 flex-shrink-0">
                    <FaMapMarkerAlt className="text-[#8D6AF8] text-xl" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">Address</h4>
                    <p className="text-gray-600">
                      B-2/104B, SAFDARJUNG ENCLAVE, New Delhi-110029
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-50 p-3 rounded-full mr-4 flex-shrink-0">
                    <FaPhoneAlt className="text-[#8D6AF8] text-xl" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">Phone</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>
                        <a href="tel:+919868866869" className="hover:text-[#8D6AF8] transition">
                          +91 9868866869
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-50 p-3 rounded-full mr-4 flex-shrink-0">
                    <MdEmail className="text-[#8D6AF8] text-xl" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">Email</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>
                        <a href="mailto:pydlifesciences@gmail.com" className="hover:text-[#8D6AF8] transition">
                          pydlifesciences@gmail.com
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Business Hours</h4>
                <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                <p className="text-gray-600">Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      {/* <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Find Us</h3>
          <div className="rounded-xl overflow-hidden h-96">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14008.107842302913!2d77.18863136977537!3d28.56789999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1dbe8a30f4c7%3A0x9cce5eee2c236d08!2sSafdarjung%20Enclave%2C%20New%20Delhi%2C%20Delhi%20110029!5e0!3m2!1sen!2sin!4v1710864000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Company Location"
            ></iframe>
          </div>
        </div>
      </div> */}

      {/* Footer */}
      <Footer />
    </div>
  );
}