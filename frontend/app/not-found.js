"use client";
import { useEffect } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function NotFound() {
  useEffect(() => {
    const timer = setTimeout(() => {
      redirect("/");
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
        <div className="text-center relative">
          {/* Animated 404 text */}
          <h1 className="text-9xl font-bold text-indigo-600 mb-4">
            <span className="animate-pulse">4</span>
            <span className="inline-block animate-bounce mx-2">0</span>
            <span className="animate-pulse">4</span>
          </h1>

          {/* Decorative blobs */}
          <div className="absolute -top-4 -left-10 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-10 -right-8 w-24 h-24 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Page Not Found
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-3 rounded-md bg-[#7a1113] text-white shadow-md transition duration-300"
            >
              Go back home
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              You will be automatically redirected to the homepage in 10
              seconds.
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: scale(1);
          }
          33% {
            transform: scale(1.1);
          }
          66% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
