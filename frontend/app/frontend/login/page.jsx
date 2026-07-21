"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { IoMdPhonePortrait, IoMdLock } from "react-icons/io";
import { RiShieldCheckLine, RiTimeLine } from "react-icons/ri";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const LoginContent = () => {
  const [step, setStep] = useState(1); // 1 = details, 2 = otp
  const [formData, setFormData] = useState({
    mobile: "",
    otp: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const otpInputs = useRef([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const from = searchParams.get("from");

  // Handle mobile input change
  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow numbers
    setFormData({ ...formData, [e.target.name]: value });
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    const numericValue = value.replace(/\D/g, "");

    if (numericValue.length <= 1) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = numericValue;
      setOtpValues(newOtpValues);

      // Update form data with the complete OTP
      setFormData({ ...formData, otp: newOtpValues.join("") });

      // Auto-focus to next input
      if (numericValue && index < 5) {
        otpInputs.current[index + 1].focus();
      }
    }
  };

  // Handle backspace in OTP inputs
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  // Paste OTP from clipboard
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").replace(/\D/g, "");
    if (pastedData.length === 6) {
      const newOtpValues = pastedData.split("");
      setOtpValues(newOtpValues);
      setFormData({ ...formData, otp: newOtpValues.join("") });

      // Focus the last input after paste
      otpInputs.current[5].focus();
    }
  };

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Send OTP
  const sendOtp = async (e) => {
    e.preventDefault();
    if (!formData.mobile || formData.mobile.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/loginotp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ number: formData.mobile }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setStep(2);
        setCountdown(30); // Start 30-second countdown
        setSuccess("OTP sent successfully to your mobile");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error(error);
      setError("Error sending OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/loginotp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ number: formData.mobile }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setCountdown(30);
        setSuccess("OTP resent successfully");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error(error);
      setError("Error resending OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    if (formData.otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            number: formData.mobile,
            otp: formData.otp,
          }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
         window.dispatchEvent(new Event("auth-change"));  // <-- add this line

        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 2000,
        });

        if (from === "checkout") {
          router.push("/frontend/cart");
        } else {
          router.push("/");
        }
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setError("Error verifying OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow flex items-center border-t border-gray-400  justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full bg-white rounded-lg shadow-md overflow-hidden md:flex">
          <div className="sm:w-1/2 w-full bg-white rounded-lg flex flex-col items-center justify-center  shadow-md overflow-hidden">
            <div className="px-6 py-8">
              {/* Progress indicator */}
              <div className="flex justify-center mb-6">
                <div className="flex items-center">
                  <div
                    className={`flex flex-col items-center ${step >= 1 ? "text-violet-600" : "text-gray-400"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? "border-violet-600 bg-violet-100" : "border-gray-300"}`}
                    >
                      {step > 1 ? (
                        <RiShieldCheckLine className="w-4 h-4 text-violet-600" />
                      ) : (
                        <span className="text-sm font-medium">1</span>
                      )}
                    </div>
                    <span className="text-xs mt-1">Enter Phone</span>
                  </div>
                  <div
                    className={`w-16 h-1 mx-2 ${step >= 2 ? "bg-violet-600" : "bg-gray-300"}`}
                  ></div>
                  <div
                    className={`flex flex-col items-center ${step >= 2 ? "text-violet-600" : "text-gray-400"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? "border-violet-600 bg-violet-100" : "border-gray-300"}`}
                    >
                      <span className="text-sm font-medium">2</span>
                    </div>
                    <span className="text-xs mt-1">Verify OTP</span>
                  </div>
                </div>
              </div>

              <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">
                {step === 1 ? "Login to Your Account" : "Verify Your Number"}
              </h2>
              <p className="text-center text-sm text-gray-600 mb-6">
                {step === 1
                  ? "Enter your mobile number to receive an OTP"
                  : `Enter the 6-digit code sent to ${formData.mobile}`}
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {success}
                </div>
              )}

              {/* STEP 1 - Mobile Number Input */}
              {step === 1 && (
                <form onSubmit={sendOtp} className="space-y-5">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <IoMdPhonePortrait size={18} />
                    </div>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      maxLength={10}
                      placeholder="Enter your 10-digit mobile number"
                      className="w-full pl-10 pr-4 py-3 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-violet-600 hover:bg-violet-800 text-white py-3 rounded-lg transition-colors flex items-center justify-center ${
                      isLoading
                        ? "opacity-70 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending OTP...
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </form>
              )}

              {/* STEP 2 - OTP Verification */}
              {step === 2 && (
                <form onSubmit={verifyOtp} className="space-y-5">
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 text-center">
                      Enter the 6-digit verification code
                    </p>

                    <div className="flex justify-center space-x-2">
                      {otpValues.map((value, index) => (
                        <input
                          key={index}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={value}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={index === 0 ? handleOtpPaste : undefined}
                          ref={(el) => (otpInputs.current[index] = el)}
                          className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <RiTimeLine className="mr-1" />
                      {countdown > 0 ? (
                        <span>Resend OTP in {countdown} seconds</span>
                      ) : (
                        <button
                          type="button"
                          onClick={resendOtp}
                          disabled={isLoading}
                          className="text-violet-600 hover:text-violet-700 font-medium disabled:opacity-50"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || formData.otp.length !== 6}
                    className={`w-full bg-violet-600 text-white py-3 rounded-lg transition-colors flex items-center justify-center ${
                      isLoading || formData.otp.length !== 6
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-violet-700 cursor-pointer"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <IoMdLock className="mr-2" />
                        Verify & Login
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={isLoading}
                    className="w-full text-center text-violet-600 hover:text-violet-700 text-sm font-medium disabled:opacity-50"
                  >
                    Change Phone Number
                  </button>
                </form>
              )}

              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                  {step === 1 ? "Don't have an account? " : "New to Miraggio? "}
                  <Link
                    href="/frontend/signin"
                    className="text-violet-600 hover:text-violet-700 font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <div className="hidden md:block w-1/2">
            <img
              src="/login/login.jpeg"
              alt="Sign up banner"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const Login = () => (
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
    <LoginContent />
  </Suspense>
);

export default Login;
