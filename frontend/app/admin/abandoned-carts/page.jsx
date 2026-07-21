"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const AbandonedCartsDashboard = () => {
  const [carts, setCarts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedCart, setSelectedCart] = useState(null);
  const [showCartDetails, setShowCartDetails] = useState(false);

  // ---------- API calls ----------
  const fetchCarts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API}/api/admin/abandoned-carts`, {
        params: { page, limit: 20, sortOrder: "desc" },
      });
      setCarts(res.data.data);
      console.log("abandonedcart data",res.data.data);
      setTotalPages(res.data.pagination.pages);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/abandoned-carts/stats`);
      setStats(res.data.stats);
    } catch (err) {
      console.error("Stats error:", err);
    }
  };

  const createTestData = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${API}/api/admin/abandoned-carts/test/create-dummy`,
      );
      alert(res.data.message);
      fetchCarts();
      fetchStats();
    } catch (err) {
      console.error("Create test error:", err);
      setError("Failed to create test data");
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = async (cartId) => {
    try {
      await axios.post(`${API}/api/admin/abandoned-carts/${cartId}/remind`);
      alert("Reminder sent!");
      fetchCarts();
      fetchStats();
    } catch (err) {
      alert("Failed to send reminder");
    }
  };

  const markRestored = async (cartId) => {
    try {
      await axios.put(`${API}/api/admin/abandoned-carts/${cartId}/restore`);
      alert("Marked as restored!");
      fetchCarts();
      fetchStats();
    } catch (err) {
      alert("Failed to mark as restored");
    }
  };

  const deleteCart = async (cartId) => {
    if (!window.confirm("Delete this cart permanently?")) return;
    try {
      await axios.delete(`${API}/api/admin/abandoned-carts/${cartId}`);
      alert("Cart deleted!");
      fetchCarts();
      fetchStats();
    } catch (err) {
      alert("Failed to delete cart");
    }
  };

  // ---------- Lifecycle ----------
  useEffect(() => {
    fetchCarts();
    fetchStats();
  }, [page]);

  // ---------- Helper to resolve image ----------
  const getImageUrl = (imgPath) => {
    if (!imgPath) return "/placeholder.png";
    if (imgPath.startsWith("http")) return imgPath;
    return `${API}${imgPath}`;
  };

  // ---------- Render ----------
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading carts...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🛒 Abandoned Carts Dashboard</h1>
          <button
            onClick={createTestData}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            + Create Test Data
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500">Total Carts</h3>
              <p className="text-2xl font-bold">{stats.totalCarts}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500">Active Carts</h3>
              <p className="text-2xl font-bold text-blue-600">
                {stats.activeCarts}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500">Restored Carts</h3>
              <p className="text-2xl font-bold text-green-600">
                {stats.restoredCarts}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500">Potential Revenue</h3>
              <p className="text-2xl font-bold">
                ₹{stats.totalPotentialRevenue}
              </p>
            </div>
          </div>
        )}

        {/* Carts Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              All Carts ({carts.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                ← Prev
              </button>
              <span className="px-3 py-1">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Last Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {carts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No carts found. Click "Create Test Data" to add sample
                      carts.
                    </td>
                  </tr>
                ) : (
                  carts.map((cart) => (
                    <tr key={cart._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {cart._id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">
                          {cart.email || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {cart.phoneNumber || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">{cart.itemCount} items</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold">
                          ₹{cart.cartTotal}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {new Date(cart.lastActivity).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {cart.daysAbandoned} days ago
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            cart.isRestored
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {cart.isRestored ? "Restored" : "Abandoned"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {!cart.isRestored && (
                            <>
                              <button
                                onClick={() => sendReminder(cart._id)}
                                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                              >
                                Remind
                              </button>
                              <button
                                onClick={() => markRestored(cart._id)}
                                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                              >
                                Mark Restored
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => deleteCart(cart._id)}
                            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCart(cart);
                              setShowCartDetails(true);
                            }}
                            className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Modal */}
        {showCartDetails && selectedCart && (
          <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Cart Details</h2>
                  <button
                    onClick={() => setShowCartDetails(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Customer
                    </h3>
                    <p className="text-lg">{selectedCart.email || "N/A"}</p>
                    <p className="text-gray-600">
                      {selectedCart.phoneNumber || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Status
                    </h3>
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        selectedCart.isRestored
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedCart.isRestored ? "Restored" : "Abandoned"}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Last Activity:{" "}
                      {new Date(selectedCart.lastActivity).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">
                    Items in Cart ({selectedCart.itemCount})
                  </h3>
                  <div className="space-y-4">
                    {selectedCart.items.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex gap-4">
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            {item.variant?.color && (
                              <p className="text-sm text-gray-600">
                                Color: {item.variant.color}
                              </p>
                            )}
                            <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                              <div>
                                <span className="text-gray-500">Quantity:</span>
                                <span className="ml-2 font-medium">
                                  {item.quantity}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Price:</span>
                                <span className="ml-2 font-medium">
                                  ₹{item.priceSnapshot}
                                </span>
                                {item.originalPrice &&
                                  item.originalPrice > item.priceSnapshot && (
                                    <span className="ml-2 text-sm text-gray-400 line-through">
                                      ₹{item.originalPrice}
                                    </span>
                                  )}
                              </div>
                              <div>
                                <span className="text-gray-500">Total:</span>
                                <span className="ml-2 font-medium">
                                  ₹
                                  {(item.priceSnapshot * item.quantity).toFixed(
                                    2,
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-bold">
                      Total: ₹{selectedCart.cartTotal}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedCart.reminderCount} reminder(s) sent
                      {selectedCart.lastReminderSentAt &&
                        ` • Last: ${new Date(selectedCart.lastReminderSentAt).toLocaleString()}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!selectedCart.isRestored && (
                      <>
                        <button
                          onClick={() => {
                            sendReminder(selectedCart._id);
                            setShowCartDetails(false);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Send Reminder
                        </button>
                        <button
                          onClick={() => {
                            markRestored(selectedCart._id);
                            setShowCartDetails(false);
                          }}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Mark Restored
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setShowCartDetails(false)}
                      className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AbandonedCartsDashboard;
