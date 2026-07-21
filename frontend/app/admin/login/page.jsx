"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiArrowRight } from "react-icons/fi";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/admin-login`,
        { email, password }
      );

      if (res.data.token) {
        localStorage.setItem("adminToken", res.data.token);
        router.push("/admin/add-categories");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
        {/* Left Image Section */}
        <div className="hidden md:block md:w-1/2 relative overflow-hidden">
          {/* <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-blue-800/40 z-10"></div>
          <div className="absolute inset-0 bg-blue-900/10 z-0"></div> */}
          <img
            src="/product/admin.png"
            alt="Admin Illustration"
            className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-700"
            
          />
          {/* <div className="absolute bottom-8 left-8 right-8 z-20 text-white">
            <h2 className="text-2xl font-bold mb-2">Miraggiolife Admin Portal</h2>
            <p className="text-blue-100 opacity-90">Manage your products, inventory, and customer data with our powerful admin tools</p>
          </div> */}
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-blue-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-blue-200 rounded-full opacity-10"></div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-2">
              <img
                src="/logo/zayoraalogo.png"
                alt="Miraggiolife Logo"
                width={280}
                height={95}
                className="h-14 w-auto"
              />
            </div>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Admin Login</h2>
              <p className="text-gray-500 text-lg">Enter your credentials to access the admin dashboard</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3 transition-all duration-300 animate-fadeIn">
                <FiAlertCircle className="mt-0.5 flex-shrink-0 text-red-500" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-800 transition-all duration-200"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-800 transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-200 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#a13045] text-white rounded-lg text-base font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center group"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  <>
                    Login to Dashboard
                    <FiArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
              <p>© {new Date().getFullYear()} Miraggiolife. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}