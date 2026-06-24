"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdPhonePortrait, IoMdClose } from "react-icons/io";
import { FiCopy, FiCheck, FiGift } from "react-icons/fi";
import { toast } from "react-toastify";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
const DISMISSED_KEY = "welcomePromoDismissed";
const AUTO_APPLY_KEY = "autoApplyWelcomeCoupon";

export default function WelcomeDiscountPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState("promo"); // promo | signup | otp | unlocked
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "", otp: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [copied, setCopied] = useState(false);

  const isAdminPage = pathname?.startsWith("/admin");
  const isAuthPage =
    pathname?.includes("/frontend/signin") ||
    pathname?.includes("/frontend/login");

  const checkShouldShow = useCallback(async () => {
    if (typeof window === "undefined") return false;
    if (isAdminPage || isAuthPage) return false;

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/users/welcome-discount`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          if (data.unlocked && !data.used && data.couponCode) {
            setCouponCode(data.couponCode);
            setStep("unlocked");
            return true;
          }
          return false;
        }
      } catch {
        return false;
      }
      return false;
    }

    if (localStorage.getItem(DISMISSED_KEY) === "true") return false;
    return true;
  }, [isAdminPage, isAuthPage]);

  useEffect(() => {
    let timer;
    const init = async () => {
      const shouldShow = await checkShouldShow();
      if (shouldShow) {
        timer = setTimeout(() => setVisible(true), 3000);
      }
    };
    init();
    return () => clearTimeout(timer);
  }, [checkShouldShow]);

  const handleClose = () => {
    setVisible(false);
    if (step === "promo") {
      localStorage.setItem(DISMISSED_KEY, "true");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!formData.email.trim()) {
      setError("Please enter your email");
      return;
    }
    if (!formData.mobile || formData.mobile.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/loginotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: formData.mobile }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("otp");
        toast.success("OTP sent to your mobile");
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch {
      setError("Error sending OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (formData.otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          number: formData.mobile,
          otp: formData.otp,
          fromWelcome: true,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("auth-change"));

        if (data.welcomeUnlocked && data.welcomeCouponCode) {
          setCouponCode(data.welcomeCouponCode);
          setStep("unlocked");
          toast.success("Welcome! Your 10% discount is unlocked!");
        } else if (data.isNewUser === false) {
          toast.info("This offer is for new members only.");
          setVisible(false);
        } else {
          toast.success("Account created successfully!");
          setVisible(false);
        }
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch {
      setError("Error verifying OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoApply = () => {
    if (couponCode) {
      localStorage.setItem(AUTO_APPLY_KEY, couponCode);
      toast.success("Coupon saved! It will auto-apply at checkout.");
    }
    setVisible(false);
  };

  const handleCopyCoupon = async () => {
    if (!couponCode) return;
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);
      toast.success("Coupon code copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy. Please copy manually.");
    }
  };

  const handleContinueShopping = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
            aria-label="Close"
          >
            <IoMdClose size={24} />
          </button>

          {/* Promo Step */}
          {step === "promo" && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiGift className="text-violet-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Get 10% Off Your First Order!
              </h2>
              <p className="text-gray-600 mb-6">
                Sign up now and unlock an exclusive 10% discount on your first purchase. One-time offer per phone number.
              </p>
              <button
                onClick={() => setStep("signup")}
                className="w-full bg-[#8D6AF8] hover:bg-[#7056bd] text-white py-3 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Sign Up & Unlock 10% Off
              </button>
              <button
                onClick={handleClose}
                className="w-full mt-3 text-gray-500 hover:text-gray-700 py-2 text-sm cursor-pointer"
              >
                Maybe later
              </button>
            </div>
          )}

          {/* Signup Step */}
          {step === "signup" && (
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">
                Create Your Account
              </h2>
              <p className="text-sm text-gray-500 mb-6 text-center">
                Sign up to unlock your 10% first-order discount
              </p>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={sendOtp} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-400 outline-none"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-400 outline-none"
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
                    placeholder="Mobile Number"
                    className="w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-400 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#8D6AF8] hover:bg-[#7056bd] text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-70 cursor-pointer"
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            </div>
          )}

          {/* OTP Step */}
          {step === "otp" && (
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">
                Verify OTP
              </h2>
              <p className="text-sm text-gray-500 mb-6 text-center">
                Enter the 6-digit code sent to {formData.mobile}
              </p>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={verifyOtp} className="space-y-4">
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-400 outline-none text-center text-lg tracking-widest"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-70 cursor-pointer"
                >
                  {isLoading ? "Verifying..." : "Verify & Unlock Discount"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("signup")}
                  className="w-full text-violet-600 hover:text-violet-800 text-sm cursor-pointer"
                >
                  Change details
                </button>
              </form>
            </div>
          )}

          {/* Unlocked Step */}
          {step === "unlocked" && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheck className="text-green-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Discount Unlocked!
              </h2>
              <p className="text-gray-600 mb-4">
                You&apos;ve unlocked <span className="font-semibold text-violet-600">10% off</span> on your first order.
              </p>

              <div className="bg-violet-50 border-2 border-dashed border-violet-300 rounded-lg p-4 mb-6">
                <p className="text-xs text-gray-500 mb-1">Your coupon code</p>
                <p className="text-xl font-bold text-violet-700 tracking-wide">{couponCode}</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleAutoApply}
                  className="w-full bg-[#8D6AF8] hover:bg-[#7056bd] text-white py-3 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  Auto Apply at Checkout
                </button>
                <button
                  onClick={handleCopyCoupon}
                  className="w-full border-2 border-violet-300 text-violet-700 hover:bg-violet-50 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
                  {copied ? "Copied!" : "Copy Coupon Code"}
                </button>
                <button
                  onClick={handleContinueShopping}
                  className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-4">
                Valid for 30 days. One-time use per phone number.
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export { AUTO_APPLY_KEY };
