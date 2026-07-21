"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppContext } from "../../context/AppContext"; // path to your context
import Link from "next/link";

function RestoreCartContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const { restoreCartFromBackend, userId } = useAppContext();
  const [status, setStatus] = useState("loading"); // loading | success | error | empty
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing restore token.");
      return;
    }

    // If not logged in, redirect to login and then back here
    if (!userId) {
      router.push(`/frontend/login?from=restore&token=${token}`);
      return;
    }

    restoreCartFromBackend(token)
      .then((count) => {
        if (count > 0) {
          setStatus("success");
          setTimeout(() => router.push("/frontend/cart"), 1500);
        } else {
          setStatus("empty");
        }
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "Failed to restore cart. The link may have expired."
        );
      });
  }, [token, userId, router, restoreCartFromBackend]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {status === "loading" && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Restoring your cart…</p>
        </div>
      )}
      {status === "success" && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Cart Restored! 🎉</h2>
          <p className="mt-2 text-gray-600">Your items have been added back to your cart. Redirecting…</p>
          <Link href="/frontend/cart" className="mt-4 inline-block text-indigo-600 hover:underline">Go to cart</Link>
        </div>
      )}
      {status === "empty" && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">No items to restore</h2>
          <p className="mt-2 text-gray-600">Your cart may have expired or is empty.</p>
          <Link href="/frontend" className="mt-4 inline-block text-indigo-600 hover:underline">Continue shopping</Link>
        </div>
      )}
      {status === "error" && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Oops!</h2>
          <p className="mt-2 text-gray-600">{message || "Something went wrong."}</p>
          <Link href="/frontend" className="mt-4 inline-block text-indigo-600 hover:underline">Continue shopping</Link>
        </div>
      )}
    </div>
  );
}

export default function RestoreCartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RestoreCartContent />
    </Suspense>
  );
}