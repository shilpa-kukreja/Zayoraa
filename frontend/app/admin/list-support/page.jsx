"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import AdminLayout from "../components/AdminLayout";


const AdminSupport = () => {
  const [supports, setSupports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchSupports();
  }, []);

  const fetchSupports = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/support`
      );
      setSupports(data.supports);
    } catch (error) {
      toast.error("Failed to load support requests");
    }
    setLoading(false);
  };

  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/support/${id}`,
        { status: newStatus }
      );
      toast.success("Status updated");
      fetchSupports(); // refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
    setUpdatingId(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout>
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Support Requests
            </h1>
            <span className="bg-[#6e4fca] text-white px-4 py-2 rounded-lg">
              {supports.length} total
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6e4fca]"></div>
            </div>
          ) : supports.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No support requests yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 border-b">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Message</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Submitted</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {supports.map((support) => (
                    <tr key={support._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        #{support.orderId}
                      </td>
                      <td className="px-4 py-3">{support.name}</td>
                      <td className="px-4 py-3">{support.phone}</td>
                      <td className="px-4 py-3">{support.email}</td>
                      <td className="px-4 py-3 max-w-xs truncate">
                        {support.message}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            support.status === "Resolved"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {support.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {formatDate(support.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        {support.status === "Pending" ? (
                          <button
                            onClick={() =>
                              updateStatus(support._id, "Resolved")
                            }
                            disabled={updatingId === support._id}
                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 text-sm"
                          >
                            {updatingId === support._id
                              ? "Updating..."
                              : "Resolve"}
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              updateStatus(support._id, "Pending")
                            }
                            disabled={updatingId === support._id}
                            className="px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition disabled:opacity-50 text-sm"
                          >
                            {updatingId === support._id
                              ? "Updating..."
                              : "Reopen"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default AdminSupport;