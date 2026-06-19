'use client';
// import React, { useState } from 'react';
import { useState,Suspense} from "react";

import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { IoMdPhonePortrait } from 'react-icons/io';
import { useSearchParams, useRouter } from "next/navigation";

const SignUpContent = () => {
  const [step, setStep] = useState(1); // 1 = details, 2 = otp
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    otp: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const from = searchParams.get("from");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Send OTP
  const sendOtp = async (e) => {
    e.preventDefault();
    if (!formData.mobile || formData.mobile.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/loginotp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: formData.mobile }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(2); // move to OTP screen
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error(error);
      setError('Error sending OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  // const verifyOtp = async (e) => {
  //   e.preventDefault();
  //   if (formData.otp.length !== 6) {
  //     alert('Please enter a valid 6-digit OTP');
  //     return;
  //   }
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/verify-otp`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         username: formData.name,
  //         email: formData.email,
  //         number: formData.mobile,
  //         otp: formData.otp,
  //       }),
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       localStorage.setItem('token', data.token);
  //       alert('Signup successful!');
  //       // You can redirect to dashboard here
  //       window.location.href = '/';
  //     } else {
  //       setError(data.message || 'Invalid OTP');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setError('Error verifying OTP');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

   const verifyOtp = async (e) => {
    e.preventDefault();
    if (formData.otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          number: formData.mobile,
          otp: formData.otp,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert('Signup successful!');

        // ✅ Redirect logic
        if (from === "checkout") {
          router.push("/frontend/cart");
        } else {
          router.push("/");
        }
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error(error);
      setError('Error verifying OTP');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div>
      <Navbar />
      <div className="h-[700px] flex border-t border-gray-400 flex-col md:flex-row bg-white">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <Link href="/" className='hidden md:block'>
                <img
                  src="/logo/logo.png"
                  alt="Miraggiolife Logo"
                  className="mx-auto mb-4"
                  width={150}
                  height={50}
                />
              </Link>

              <Link href="/" className='md:hidden block  mt-10'>
                <img
                  src="/logos/logo7.png"
                  alt="Miraggiolife Logo"
                  className="mx-auto mb-4"
                  width={80}
                  height={50}
                />
              </Link>
              <h2 className="text-2xl font-semibold text-gray-800">
                Create an Account
              </h2>
              <p className="text-sm text-gray-500">
                Fill out the form to register
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* STEP 1 - User Details */}
            {step === 1 && (
              <form onSubmit={sendOtp} className="space-y-5">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                 
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-400 outline-none"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                
                  placeholder="Email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-400 outline-none"
                />

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <IoMdPhonePortrait size={16} />
                  </div>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    placeholder="Mobile Number"
                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-400 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-[#8D6AF8] hover:bg-[#7056bd] text-white py-2 rounded-md transition-colors flex items-center justify-center ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            )}

            {/* STEP 2 - OTP Verification */}
            {step === 2 && (
              <form onSubmit={verifyOtp} className="space-y-5">
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter 6-digit OTP"
                  required
                  maxLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-400 outline-none"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-md transition-colors flex items-center justify-center ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP & Sign Up'}
                </button>
              </form>
            )}

            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="px-3 text-sm text-gray-500">Or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <div className="text-center text-sm">
              Already a member?{' '}
              <Link
                href="/frontend/login"
                className="text-violet-500 hover:underline font-medium"
              >
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src="/product/login.jpg"
            alt="Sign up banner"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};


const SignUp = () => (
  <Suspense
    fallback={
  
        <div className="max-w-7xl mx-auto p-6 flex items-center justify-center min-h-[40vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto" />
            <p className="mt-3 text-gray-600">Loading...</p>
          </div>
        </div>
    }
  >
    <SignUpContent/>
  </Suspense>
);



export default SignUp;
