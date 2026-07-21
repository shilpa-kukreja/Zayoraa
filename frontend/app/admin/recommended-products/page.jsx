// pages/admin/RecommendedProducts.js
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const RecommendedProductsAdmin = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    productId: "",
    order: 0,
    active: true,
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/products/get`);
      if (res.data.success) setAllProducts(res.data.products);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/recommended`);
      if (res.data.success) setRecommendations(res.data.data);
    } catch (err) {
      setError("Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchRecommendations();
  }, []);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productId) {
      setError("Please select a product");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.post(`${API_BASE}/api/recommended`, {
        productId: form.productId,
        order: parseInt(form.order) || 0,
        active: form.active,
      });
      if (res.data.success) {
        setSuccess("Product added to recommendations");
        setRecommendations([...recommendations, res.data.data]);
        setForm({ productId: "", order: 0, active: true });
        fetchRecommendations();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, field, value) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const payload = { [field]: value };
      const res = await axios.put(`${API_BASE}/api/recommended/${id}`, payload);
      if (res.data.success) {
        setSuccess("Updated successfully");
        setRecommendations((prev) =>
          prev.map((rec) =>
            rec._id === id ? { ...rec, ...res.data.data } : rec
          )
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this recommendation?"))
      return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.delete(`${API_BASE}/api/recommended/${id}`);
      setSuccess("Removed successfully");
      setRecommendations((prev) => prev.filter((rec) => rec._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const getProductFromRec = (rec) => rec.product || {};

  return (
    <AdminLayout>
      <div className="p-6 max-w-9xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Recommended Products</h1>
          <p className="text-gray-500 mt-1">Manage which products appear in the "Recommended" section on the cart page.</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
            {success}
          </div>
        )}

        {/* Add Form – Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Recommendation</h3>
          <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
              <select
                name="productId"
                value={form.productId}
                onChange={handleFormChange}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              >
                <option value="">Select a product</option>
                {allProducts.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-24">
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <input
                type="number"
                name="order"
                value={form.order}
                onChange={handleFormChange}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                min="0"
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <label className="flex items-center space-x-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleFormChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span>Active</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          </form>
        </div>

        {/* Recommendations List – Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700">Current Recommendations</h3>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          )}

          {!loading && recommendations.length === 0 && (
            <div className="text-center py-12 text-gray-500">No recommendations yet. Add one above.</div>
          )}

          {!loading && recommendations.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Active
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recommendations.map((rec) => {
                    const product = getProductFromRec(rec);
                    return (
                      <tr key={rec._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product ? product.name : "Deleted Product"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <input
                            type="number"
                            value={rec.order}
                            onChange={(e) =>
                              handleUpdate(rec._id, "order", parseInt(e.target.value) || 0)
                            }
                            className="w-16 p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            min="0"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <input
                            type="checkbox"
                            checked={rec.active}
                            onChange={(e) =>
                              handleUpdate(rec._id, "active", e.target.checked)
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDelete(rec._id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default RecommendedProductsAdmin;