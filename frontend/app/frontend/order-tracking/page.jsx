'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Map Shiprocket status to human-friendly labels and colors
const statusConfig = {
  NEW: { label: 'Order Confirmed', color: 'bg-blue-500' },
  PENDING: { label: 'Processing', color: 'bg-yellow-500' },
  PICKED: { label: 'Picked Up', color: 'bg-indigo-500' },
  SHIPPED: { label: 'Shipped', color: 'bg-purple-500' },
  DELIVERED: { label: 'Delivered', color: 'bg-green-500' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-500' },
  RETURNED: { label: 'Returned', color: 'bg-gray-500' },
};

// Fallback if status not in map
const getStatusInfo = (status) => {
  const upper = status?.toUpperCase() || '';
  return statusConfig[upper] || { label: status || 'Unknown', color: 'bg-gray-400' };
};

export default function TrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [submittedId, setSubmittedId] = useState('');
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = orderId.trim();
    if (!trimmed) return;
    setSubmittedId(trimmed);
    setError('');
    setTracking(null);
  };

  useEffect(() => {
    if (!submittedId) return;

    const fetchTracking = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/order/tracking/${submittedId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );
        if (data.success) {
          setTracking(data.tracking);
        } else {
          setError(data.message || 'Could not fetch tracking');
        }
      } catch (err) {
        setError('Error fetching tracking data');
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
  }, [submittedId]);

  // Determine status info
  const statusInfo = tracking ? getStatusInfo(tracking.orderStatus) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Track Your Order</h1>
          <p className="text-gray-500 mt-1">Enter your order ID to get the latest status</p>
        </div>

        {/* Search Form */}
        <div className="max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2 shadow-sm">
            <input
              type="text"
              placeholder="Order ID (e.g. order_TG2ugv40V8NIfW)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition font-medium"
            >
              Track
            </button>
          </form>
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Fetching tracking info...</span>
          </div>
        )}

        {/* Tracking Details */}
        {!loading && tracking && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Order #{submittedId}
                  </h2>
                  {tracking.orderId && (
                    <p className="text-xs text-gray-500">
                      Shiprocket ID: {tracking.orderId}
                    </p>
                  )}
                </div>
                {statusInfo && (
                 <span className={`${statusInfo.color} text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-sm`}>
  {statusInfo.label} <span className="ml-1 text-xs opacity-80">({tracking.orderStatus})</span>
</span>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Status badge + sub-status */}
              {tracking.subStatus && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Sub‑status:</span> {tracking.subStatus}
                </div>
              )}

              {/* Courier & AWB */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tracking.courier && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase">Courier</p>
                    <p className="font-medium text-gray-800">{tracking.courier}</p>
                  </div>
                )}
                {tracking.awb && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase">AWB Number</p>
                    <p className="font-medium text-gray-800">{tracking.awb}</p>
                  </div>
                )}
                {tracking.estimatedDelivery && (
                  <div className="bg-gray-50 p-3 rounded-lg sm:col-span-2">
                    <p className="text-xs text-gray-500 uppercase">Estimated Delivery</p>
                    <p className="font-medium text-gray-800">
                      {tracking.estimatedDelivery.estimatedDate
                        ? new Date(tracking.estimatedDelivery.estimatedDate).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : `within ${tracking.estimatedDelivery.maxDays} days`}
                    </p>
                  </div>
                )}
              </div>

              {/* Tracking Events Timeline */}
              {tracking.trackingEvents && tracking.trackingEvents.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Tracking History</h3>
                  <div className="border-l-2 border-blue-300 ml-3 pl-6 space-y-5">
                    {tracking.trackingEvents.map((event, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-8 top-1.5 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow"></div>
                        <p className="text-sm text-gray-800">{event.activity}</p>
                        <p className="text-xs text-gray-400">{event.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fallback message */}
              {tracking.fromDB && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                  <span className="font-medium">ℹ️</span> {tracking.message || 'Showing stored status – live tracking not yet available.'}
                </div>
              )}

              {/* Additional info: Fulfillment status */}
              {tracking.fulfillmentStatus && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Fulfillment:</span> {tracking.fulfillmentStatus}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}