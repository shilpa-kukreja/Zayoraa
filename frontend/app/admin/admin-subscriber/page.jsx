'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiMail,
  FiTrash2,
  FiUsers,
  FiDownload,
  FiSearch,
  FiX,
  FiCheckCircle,
  FiAlertCircle
} from "react-icons/fi";

const Subscription = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const subscribersPerPage = 10;

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscription/subscribers`);
      setSubscribers(response.data);
    } catch (error) {
      console.error("Failed to fetch subscribers", error);
    } finally {
      setLoading(false);
    }
  };

const handleUnsubscribe = async (email) => {
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscription/unsubscribe/${email}`);
    toast.success("Subscriber deleted successfully");
    setSubscribers((prev) => prev.filter((sub) => sub.email !== email));
    setDeleteConfirm(null);
  } catch (error) {
    console.error("Unsubscribe failed", error);
    toast.error(error.response?.data?.message || "Failed to unsubscribe");
  }
};



  const handleSelectSubscriber = (email) => {
    if (selectedSubscribers.includes(email)) {
      setSelectedSubscribers(selectedSubscribers.filter(e => e !== email));
    } else {
      setSelectedSubscribers([...selectedSubscribers, email]);
    }
  };

  const handleSelectAll = () => {
    if (selectedSubscribers.length === filteredSubscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(filteredSubscribers.map(sub => sub.email));
    }
  };

  const handleBulkDelete = () => {
    if (selectedSubscribers.length === 0) return;
    
    if (window.confirm(`Are you sure you want to remove ${selectedSubscribers.length} subscribers?`)) {
      // This would need backend support for bulk deletion
      selectedSubscribers.forEach(email => {
        handleUnsubscribe(email);
      });
      setSelectedSubscribers([]);
    }
  };

  const exportSubscribers = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email\n" 
      + subscribers.map(sub => sub.email).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubscribers = subscribers.filter(sub => 
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastSubscriber = currentPage * subscribersPerPage;
  const indexOfFirstSubscriber = indexOfLastSubscriber - subscribersPerPage;
  const currentSubscribers = filteredSubscribers.slice(indexOfFirstSubscriber, indexOfLastSubscriber);
  const totalPages = Math.ceil(filteredSubscribers.length / subscribersPerPage);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full mx-auto p-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Email Subscribers</h1>
              <p className="text-blue-100 mt-1">
                Manage all newsletter subscribers
              </p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <div className="bg-white/10 p-2 rounded-lg mr-3">
                <FiUsers className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-white text-sm">Total Subscribers</p>
                <p className="text-white text-2xl font-bold">{subscribers.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search subscribers..."
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            
            <div className="flex gap-3">
              {selectedSubscribers.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center px-4 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <FiTrash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedSubscribers.length})
                </button>
              )}
              
              <button
                onClick={exportSubscribers}
                className="flex items-center px-4 py-2.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                <FiDownload className="h-4 w-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredSubscribers.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                        <input
                          type="checkbox"
                          checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email Address
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4  text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentSubscribers.map((subscriber) => (
                      <tr key={subscriber.email} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedSubscribers.includes(subscriber.email)}
                            onChange={() => handleSelectSubscriber(subscriber.email)}
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <FiMail className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {subscriber.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <FiCheckCircle className="h-3 w-3 mr-1" />
                            Subscribed
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setDeleteConfirm(subscriber.email)}
                            className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 transition-colors"
                            title="Remove Subscriber"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredSubscribers.length > subscribersPerPage && (
                <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-medium">{indexOfFirstSubscriber + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(indexOfLastSubscriber, filteredSubscribers.length)}</span> of{" "}
                    <span className="font-medium">{filteredSubscribers.length}</span> subscribers
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg ${
                        currentPage === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <FiChevronLeft className="h-5 w-5" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (number) => (
                        <button
                          key={number}
                          onClick={() => setCurrentPage(number)}
                          className={`px-3 py-1.5 rounded-lg text-sm ${
                            currentPage === number
                              ? "bg-blue-500 text-white font-medium"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {number}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg ${
                        currentPage === totalPages
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <FiChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="flex flex-col items-center justify-center text-gray-400">
                <FiMail className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium text-gray-500 mb-1">
                  {searchTerm ? "No matching subscribers found" : "No subscribers yet"}
                </p>
                <p className="text-sm">
                  {searchTerm ? "Try adjusting your search query" : "Subscribers will appear here once they sign up"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-red-100 mr-3">
                <FiAlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Confirm Removal</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove <span className="font-medium">{deleteConfirm}</span> from your subscribers? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUnsubscribe(deleteConfirm)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Remove Subscriber
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Subscription;