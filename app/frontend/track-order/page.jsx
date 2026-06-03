'use client';
import React, { useState } from 'react';
import {
  FiSearch,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiPackage,
  FiHome,
  FiCalendar,
  FiDollarSign,
  FiMapPin,
  FiBox
} from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const sampleOrder = {
    id: 'ORD-2023-8765',
    date: 'October 15, 2023',
    status: 'shipped',
    items: [
      { id: 1, name: 'Organic Cotton T-Shirt', price: 24.99, quantity: 2, image: '/product/product1.webp' },
      { id: 2, name: 'Premium Yoga Pants', price: 34.99, quantity: 1, image: '/product/product2.webp' }
    ],
    total: 84.97,
    shippingAddress: '123 Main St, Apt 4B, New York, NY 10001',
    trackingNumber: 'UPS-1Z999AA1012345678',
    estimatedDelivery: 'October 20, 2023',
    history: [
      { status: 'ordered', date: 'Oct 15, 2023', time: '10:30 AM', completed: true },
      { status: 'processed', date: 'Oct 16, 2023', time: '9:15 AM', completed: true },
      { status: 'shipped', date: 'Oct 17, 2023', time: '3:45 PM', completed: true },
      { status: 'out-for-delivery', date: 'Oct 20, 2023', time: '8:00 AM', completed: false },
      { status: 'delivered', date: '', time: '', completed: false }
    ]
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (orderId && email) {
        setOrder(sampleOrder);
      } else {
        setError('Please enter both order ID and email');
      }
      setIsLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ordered': return <FiClock className="text-blue-600" />;
      case 'processed': return <FiPackage className="text-purple-600" />;
      case 'shipped': return <FiTruck className="text-yellow-600" />;
      case 'out-for-delivery': return <FiTruck className="text-orange-600" />;
      case 'delivered': return <FiHome className="text-green-600" />;
      default: return <FiCheckCircle />;
    }
  };

  const statusStyles = {
    ordered: 'bg-blue-50 text-blue-800 border-blue-200',
    processed: 'bg-purple-50 text-purple-800 border-purple-200',
    shipped: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    'out-for-delivery': 'bg-orange-50 text-orange-800 border-orange-200',
    delivered: 'bg-green-50 text-green-800 border-green-200'
  };

  const statusText = {
    ordered: 'Order Placed',
    processed: 'Processing',
    shipped: 'Shipped',
    'out-for-delivery': 'Out for Delivery',
    delivered: 'Delivered'
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 border-t border-gray-300">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Track Your Order</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Enter your order details below to check the current status of your shipment
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
                    Order ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="orderId"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="e.g. ORD-2023-8765"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FiBox className="text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="your@email.com"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={` flex justify-center items-center py-3 px-6 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Tracking Order...
                    </>
                  ) : (
                    <>
                      <FiSearch className="mr-3" />
                      Track Order
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {order && (
            <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-6xl mx-auto">
              {/* Order Header */}
              <div className="px-8 py-6 border-b border-gray-100 bg-gray-50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Order #{order.id}</h2>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <FiCalendar className="mr-1.5" />
                      <span>Placed on {order.date}</span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusStyles[order.status]}`}>
                      {statusText[order.status]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline Section */}
              <div className="px-8 py-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200" />
                  <div className="space-y-8">
                    {order.history.map((step, idx) => (
                      <div key={idx} className="relative flex items-start">
                        <div className={`absolute left-4 top-4 h-3 w-3 rounded-full ${step.completed ? 'bg-indigo-600' : 'bg-gray-300'}`} />
                        <div className="ml-10 flex-1">
                          <div className="flex items-center">
                            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${step.completed ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                              {getStatusIcon(step.status)}
                            </div>
                            <h4 className="ml-3 text-sm font-medium text-gray-900 capitalize">
                              {step.status.replace(/-/g, ' ')}
                            </h4>
                          </div>
                          {step.date && (
                            <div className="mt-2 ml-11 text-sm text-gray-500">
                              {step.date} at {step.time}
                            </div>
                          )}
                          {idx === order.history.length - 1 && order.estimatedDelivery && (
                            <div className="mt-2 ml-11 text-sm text-gray-400">
                              Estimated delivery: {order.estimatedDelivery}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-8 py-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Items</h3>
                <ul className="divide-y divide-gray-100">
                  {order.items.map((item) => (
                    <li key={item.id} className="py-4 flex items-start">
                      <div className="flex-shrink-0 h-20 w-20 rounded-md overflow-hidden border border-gray-200">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                        <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">₹{item.price.toFixed(2)}</p>
                        <p className="mt-1 text-xs text-gray-500">₹{(item.price * item.quantity).toFixed(2)} total</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shipping and Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                <div className="p-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h4>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <FiMapPin />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Shipping Address</p>
                      <p className="mt-1 text-sm text-gray-500">{order.shippingAddress}</p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="text-gray-900">₹{(order.total - 5.99).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span className="text-gray-900">₹5.99</span>
                    </div>
                    <div className="pt-3 border-t border-gray-100 flex justify-between font-medium">
                      <span className="text-gray-900">Total</span>
                      <span className="text-indigo-600">₹{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking Info */}
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Tracking Information</h4>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-4">Carrier: UPS</span>
                      <span>Tracking #: {order.trackingNumber}</span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <a
                      href={`https://www.ups.com/track?tracknum=${order.trackingNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Track Package
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderTracking;