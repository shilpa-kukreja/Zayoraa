// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import { jwtDecode } from "jwt-decode";
// import {
//   ChevronDown,
//   ChevronUp,
//   Package,
//   Truck,
//   CheckCircle,
//   XCircle,
//   RefreshCw,
//   Calendar,
//   MapPin,
//   CreditCard,
//   User,
//   Mail,
//   Phone,
//   Building,
//   FileText
// } from "lucide-react";
// import Footer from "../components/Footer";
// import Navbar from "../components/Navbar";
// import { resolveOrderTotals } from "../utils/orderTotals";

// const UserOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const ordersPerPage = 5;
//   const [expandedOrder, setExpandedOrder] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [updatingOrder, setUpdatingOrder] = useState(null);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedToken = localStorage.getItem("token");
//       if (storedToken) {
//         const decoded = jwtDecode(storedToken);
//         setUserId(decoded._id || decoded.id);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (userId) fetchOrders();
//   }, [userId]);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/order/user`, { userId });
//       setOrders(data.orders);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to fetch orders");
//     }
//     setLoading(false);
//   };

//   const changeStatus = async (orderid, status) => {
//     setUpdatingOrder(orderid);
//     try {
//       const { data } = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/order/status`, { orderid, status });
//       toast.success(data.message);
//       fetchOrders();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to update order");
//     }
//     setUpdatingOrder(null);
//   };

//   const indexOfLastOrder = currentPage * ordersPerPage;
//   const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
//   const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
//   const totalPages = Math.ceil(orders.length / ordersPerPage);

//   const toggleExpand = (orderId) => {
//     setExpandedOrder(expandedOrder === orderId ? null : orderId);
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "Order Placed":
//         return <Package className="w-4 h-4" />;
//       case "Shipped":
//         return <Truck className="w-4 h-4" />;
//       case "Delivered":
//         return <CheckCircle className="w-4 h-4" />;
//       case "Cancelled":
//         return <XCircle className="w-4 h-4" />;
//       case "Returned":
//         return <RefreshCw className="w-4 h-4" />;
//       default:
//         return <Package className="w-4 h-4" />;
//     }
//   };

//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6e4fca] mb-4"></div>
//         <p className="text-gray-600 text-lg">Loading your orders...</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//         <Navbar />
//     <div className="min-h-screen border-t  border-gray-300 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <Toaster position="top-right" />

//       <div className="max-w-6xl mx-auto">
//         <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
//               <p className="text-gray-600 mt-2">View and manage your orders</p>
//             </div>
//             <div className="bg-gray-50 text-[#6e4fca] px-4 py-2 rounded-lg flex items-center">
//               <FileText className="w-5 h-5 mr-2" />
//               <span>{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
//             </div>
//           </div>

//           {orders.length === 0 ? (
//             <div className="text-center py-12">
//               <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
//               <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
//               <button
//                 onClick={() => window.location.href = '/'}
//                 className="px-6 py-2 bg-[#6e4fca] text-white rounded-lg hover:bg-[#6e4fca] transition"
//               >
//                 Start Shopping
//               </button>
//             </div>
//           ) : (
//             <>
//               <div className="space-y-5">
//                 {currentOrders.map((order) => (
//                   <div key={order._id} className="border border-gray-200 rounded-xl overflow-hidden transition-all hover:shadow-md">
//                     {/* Order Header */}
//                     <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
//                       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//                         <div className="flex items-center mb-3 sm:mb-0">
//                           <div className="bg-blue-100 p-2 rounded-lg mr-4">
//                             <Package className="w-5 h-5 text-[#6e4fca]" />
//                           </div>
//                           <div>
//                             <h3 className="font-semibold text-gray-900">Order #{order.orderid}</h3>
//                             <div className="flex items-center text-sm text-gray-500 mt-1">
//                               <Calendar className="w-4 h-4 mr-1" />
//                               <span>Placed on {formatDate(order.createdAt)}</span>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex items-center">
//                           <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${order.status === "Order Placed"
//                               ? "bg-blue-50 text-[#6e4fca]"
//                               : order.status === "Cancelled"
//                               ? "bg-red-100 text-red-700"
//                               : order.status === "Returned"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : order.status === "Delivered"
//                               ? "bg-green-100 text-green-700"
//                               : "bg-purple-100 text-purple-700"
//                             }`}>
//                             {getStatusIcon(order.status)}
//                             <span className="ml-1.5">{order.status}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Order Content */}
//                     <div className="p-6">
//                       {/* Order Items */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                         {order.items.map((item) => (
//                           <div key={item._id} className="flex items-start space-x-4">
//                             <img
//                               src={item.image}
//                               alt={item.name}
//                               className="w-16 h-16 object-cover rounded-lg border border-gray-200"
//                             />
//                             <div className="flex-1 min-w-0">
//                               <p className="font-medium text-gray-900 truncate">{item.name}</p>
//                               <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
//                               <p className="font-semibold text-gray-900 mt-1">₹{item.price}</p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 pt-6">
//                         <div className="mb-4 sm:mb-0">
//                           <p className="font-bold text-lg text-gray-900">Total: ₹{order.amount}</p>
//                         </div>

//                         <div className="flex flex-wrap gap-3">
//                           <button
//                             onClick={() => toggleExpand(order._id)}
//                             className="flex items-center text-[#6e4fca] hover:text-black transition"
//                           >
//                             {expandedOrder === order._id ? (
//                               <>
//                                 <ChevronUp className="w-4 h-4 mr-1" />
//                                 Hide Details
//                               </>
//                             ) : (
//                               <>
//                                 <ChevronDown className="w-4 h-4 mr-1" />
//                                 View Details
//                               </>
//                             )}
//                           </button>

//                           {(order.status === "Order Placed" || order.status === "Shipped") && (
//                             <button
//                               onClick={() => changeStatus(order.orderid, "Cancelled")}
//                               disabled={updatingOrder === order.orderid}
//                               className="flex items-center bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
//                             >
//                               {updatingOrder === order.orderid ? (
//                                 <>
//                                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700 mr-2"></div>
//                                   Processing...
//                                 </>
//                               ) : (
//                                 <>
//                                   <XCircle className="w-4 h-4 mr-1" />
//                                   Cancel Order
//                                 </>
//                               )}
//                             </button>
//                           )}
//                           {order.status === "Delivered" && (
//                             <button
//                               onClick={() => changeStatus(order.orderid, "Returned")}
//                               disabled={updatingOrder === order.orderid}
//                               className="flex items-center bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg hover:bg-yellow-100 transition disabled:opacity-50"
//                             >
//                               {updatingOrder === order.orderid ? (
//                                 <>
//                                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-800 mr-2"></div>
//                                   Processing...
//                                 </>
//                               ) : (
//                                 <>
//                                   <RefreshCw className="w-4 h-4 mr-1" />
//                                   Return Item
//                                 </>
//                               )}
//                             </button>
//                           )}
//                         </div>
//                       </div>

//                       {/* Expanded Order Details */}
//                       {expandedOrder === order._id && (
//                         <div className="mt-6 pt-6 border-t border-gray-200">
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             {/* Shipping Address */}
//                             <div className="bg-gray-50 p-4 rounded-lg">
//                               <h4 className="font-medium text-gray-900 mb-3 flex items-center">
//                                 <MapPin className="w-5 h-5 mr-2 text-blue-600" />
//                                 Shipping Address
//                               </h4>
//                               <div className="space-y-2 text-gray-700">
//                                 <div className="flex items-start">
//                                   <User className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
//                                   <span>{order.address.fullName} </span>
//                                 </div>
//                                 {order.address.company && (
//                                   <div className="flex items-start">
//                                     <Building className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
//                                     <span>{order.address.company}</span>
//                                   </div>
//                                 )}
//                                 <div className="flex items-start">
//                                   <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
//                                   <span>{order.address.address1}, {order.address.address2}</span>
//                                 </div>
//                                 <div className="flex items-start">
//                                   <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
//                                   <span>{order.address.city}, {order.address.country} - {order.address.postalCode}</span>
//                                 </div>
//                                 <div className="flex items-start">
//                                   <Phone className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
//                                   <span>{order.address.phone}</span>
//                                 </div>
//                                 <div className="flex items-start">
//                                   <Mail className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
//                                   <span>{order.address.email}</span>
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Payment Information */}
//                             <div className="bg-gray-50 p-4 rounded-lg">
//                               <h4 className="font-medium text-gray-900 mb-3 flex items-center">
//                                 <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
//                                 Payment Information
//                               </h4>
//                               <div className="space-y-2">
//                                 <div className="flex justify-between">
//                                   <span className="text-gray-600">Payment Method:</span>
//                                   <span className="font-medium">{order.paymentMethod}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                   <span className="text-gray-600">Payment Status:</span>
//                                   <span className={`font-medium ${order.payment ? 'text-green-600' : 'text-yellow-600'}`}>
//                                     {order.payment ? 'Paid' : 'Pending'}
//                                   </span>
//                                 </div>
//                                 {(() => {
//                                   const { subtotal, tax, discount, total } = resolveOrderTotals(order);
//                                   return (
//                                     <>
//                                       <div className="flex justify-between">
//                                         <span className="text-gray-600">Subtotal:</span>
//                                         <span className="font-medium">₹{subtotal}</span>
//                                       </div>
//                                       <div className="flex justify-between">
//                                         <span className="text-gray-600">Tax (2%):</span>
//                                         <span className="font-medium">₹{tax}</span>
//                                       </div>
//                                       <div className="flex justify-between">
//                                         <span className="text-gray-600">Coupon Code:</span>
//                                         <span className="font-medium">{order.couponCode ? order.couponCode : 'N/A'}</span>
//                                       </div>
//                                       {discount > 0 && (
//                                         <div className="flex justify-between">
//                                           <span className="text-gray-600">Discount:</span>
//                                           <span className="font-medium">-₹{discount}</span>
//                                         </div>
//                                       )}
//                                       <div className="flex justify-between">
//                                         <span className="text-gray-600">Order Total:</span>
//                                         <span className="font-medium">₹{total}</span>
//                                       </div>
//                                     </>
//                                   );
//                                 })()}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <div className="flex justify-center mt-8">
//                   <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-2">
//                     <button
//                       onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                       disabled={currentPage === 1}
//                       className="p-2 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50"
//                     >
//                       <ChevronUp className="w-5 h-5 transform rotate-270" />
//                     </button>

//                     {Array.from({ length: totalPages }, (_, i) => (
//                       <button
//                         key={i}
//                         onClick={() => setCurrentPage(i + 1)}
//                         className={`w-10 h-10 rounded-md ${
//                           currentPage === i + 1
//                             ? "bg-[#6e4fca] text-white"
//                             : "text-gray-700 hover:bg-gray-100"
//                         }`}
//                       >
//                         {i + 1}
//                       </button>
//                     ))}

//                     <button
//                       onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                       disabled={currentPage === totalPages}
//                       className="p-2 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50"
//                     >
//                       <ChevronUp className="w-5 h-5 transform rotate-90" />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//     <Footer/>
//     </div>
//   );
// };

// export default UserOrders;

"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation"; // ← import for navigation
import {
  ChevronDown,
  ChevronUp,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  Calendar,
  MapPin,
  CreditCard,
  User,
  Mail,
  Phone,
  Building,
  FileText,
} from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { resolveOrderTotals } from "../utils/orderTotals";

const UserOrders = () => {
  const router = useRouter(); // ← initialize router
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [userId, setUserId] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [buyingProduct, setBuyingProduct] = useState(null); // ← track which product is being bought

  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [supportForm, setSupportForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submittingSupport, setSubmittingSupport] = useState(false);

  const openSupportModal = (order) => {
    setSelectedOrderId(order.orderid);
    setSupportForm({
      name: order.address.fullName || "",
      phone: order.address.phone || "",
      email: order.address.email || "",
      message: "",
    });
    setSupportModalOpen(true);
  };

  const closeSupportModal = () => {
    setSupportModalOpen(false);
    setSupportForm({ name: "", phone: "", email: "", message: "" });
    setSelectedOrderId(null);
  };

  const handleSupportChange = (e) => {
    setSupportForm({ ...supportForm, [e.target.name]: e.target.value });
  };

 const submitSupport = async (e) => {
  e.preventDefault();
  if (!supportForm.message.trim()) {
    toast.error("Please describe your issue.");
    return;
  }
  setSubmittingSupport(true);
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/support`,
      {
        orderId: selectedOrderId,
        userId: userId,          // <-- add this line
        name: supportForm.name,
        phone: supportForm.phone,
        email: supportForm.email,
        message: supportForm.message,
      }
    );
    toast.success(response.data.message || "Support request sent!");
    closeSupportModal();
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to submit request");
  } finally {
    setSubmittingSupport(false);
  }
};
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        const decoded = jwtDecode(storedToken);
        setUserId(decoded._id || decoded.id);
      }
    }
  }, []);

  useEffect(() => {
    if (userId) fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/order/user`,
        { userId },
      );
      setOrders(data.orders);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    }
    setLoading(false);
  };

  const changeStatus = async (orderid, status) => {
    setUpdatingOrder(orderid);
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/order/status`,
        { orderid, status },
      );
      toast.success(data.message);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update order");
    }
    setUpdatingOrder(null);
  };

  // ← New function to handle "Buy it now"
  const handleBuyNow = async (productId) => {
    setBuyingProduct(productId);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${productId}`,
      );
      if (data.success && data.product) {
        const slug = data.product.slug;
        router.push(`/frontend/ProductDetail/${slug}`);
      } else {
        toast.error("Product not found");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch product details",
      );
    } finally {
      setBuyingProduct(null);
    }
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Order Placed":
        return <Package className="w-4 h-4" />;
      case "Shipped":
        return <Truck className="w-4 h-4" />;
      case "Delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "Cancelled":
        return <XCircle className="w-4 h-4" />;
      case "Returned":
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6e4fca] mb-4"></div>
        <p className="text-gray-600 text-lg">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen border-t  border-gray-300 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <Toaster position="top-right" />

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Order History
                </h1>
                <p className="text-gray-600 mt-2">
                  View and manage your orders
                </p>
              </div>
              <div className="bg-gray-50 text-[#6e4fca] px-4 py-2 rounded-lg flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                <span>
                  {orders.length} order{orders.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No orders yet
                </h3>
                <p className="text-gray-500 mb-4">
                  You haven't placed any orders yet.
                </p>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="px-6 py-2 bg-[#6e4fca] text-white rounded-lg hover:bg-[#6e4fca] transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-5">
                  {currentOrders.map((order) => (
                    <div
                      key={order._id}
                      className="border border-gray-200 rounded-xl overflow-hidden transition-all hover:shadow-md"
                    >
                      {/* Order Header */}
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center mb-3 sm:mb-0">
                            <div className="bg-blue-100 p-2 rounded-lg mr-4">
                              <Package className="w-5 h-5 text-[#6e4fca]" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                Order #{order.orderid}
                              </h3>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>
                                  Placed on {formatDate(order.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                order.status === "Order Placed"
                                  ? "bg-blue-50 text-[#6e4fca]"
                                  : order.status === "Cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : order.status === "Returned"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : order.status === "Delivered"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-purple-100 text-purple-700"
                              }`}
                            >
                              {getStatusIcon(order.status)}
                              <span className="ml-1.5">{order.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Content */}
                      <div className="p-6">
                        {/* Order Items */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          {order.items.map((item) => (
                            <div
                              key={item._id}
                              className="flex items-start space-x-4"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                              />
                              <div className="flex-1 min-w-0">
                                {/* Product name with Buy it now button */}
                                <div className="flex justify-between items-start">
                                  <p className="font-medium text-gray-900">
                                    {item.name.length > 40
                                      ? `${item.name.slice(0, 40)}...`
                                      : item.name}
                                  </p>{" "}
                                  <button
                                    onClick={() => handleBuyNow(item.productId)}
                                    disabled={buyingProduct === item.productId}
                                    className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition disabled:opacity-50"
                                  >
                                    {buyingProduct === item.productId
                                      ? "Loading..."
                                      : "Buy Again"}
                                  </button>
                                </div>
                                <p className="text-gray-500 text-sm">
                                  Quantity: {item.quantity}
                                </p>
                                <p className="font-semibold text-gray-900 mt-1">
                                  ₹{item.price}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 pt-6">
                          <div className="mb-4 sm:mb-0">
                            <p className="font-bold text-lg text-gray-900">
                              Total: ₹{order.amount}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => toggleExpand(order._id)}
                              className="flex items-center text-[#6e4fca] hover:text-black transition"
                            >
                              {expandedOrder === order._id ? (
                                <>
                                  <ChevronUp className="w-4 h-4 mr-1" />
                                  Hide Details
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4 mr-1" />
                                  View Details
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => openSupportModal(order)}
                              className="flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition"
                            >
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                />
                              </svg>
                              Contact Support
                            </button>

                            {(order.status === "Order Placed" ||
                              order.status === "Shipped") && (
                              <button
                                onClick={() =>
                                  changeStatus(order.orderid, "Cancelled")
                                }
                                disabled={updatingOrder === order.orderid}
                                className="flex items-center bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                              >
                                {updatingOrder === order.orderid ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700 mr-2"></div>
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Cancel Order
                                  </>
                                )}
                              </button>
                            )}
                            {order.status === "Delivered" && (
                              <button
                                onClick={() =>
                                  changeStatus(order.orderid, "Returned")
                                }
                                disabled={updatingOrder === order.orderid}
                                className="flex items-center bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg hover:bg-yellow-100 transition disabled:opacity-50"
                              >
                                {updatingOrder === order.orderid ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-800 mr-2"></div>
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <RefreshCw className="w-4 h-4 mr-1" />
                                    Return Item
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Expanded Order Details */}
                        {expandedOrder === order._id && (
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Shipping Address */}
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                                  Shipping Address
                                </h4>
                                <div className="space-y-2 text-gray-700">
                                  <div className="flex items-start">
                                    <User className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                                    <span>{order.address.fullName} </span>
                                  </div>
                                  {order.address.company && (
                                    <div className="flex items-start">
                                      <Building className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                                      <span>{order.address.company}</span>
                                    </div>
                                  )}
                                  <div className="flex items-start">
                                    <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                                    <span>
                                      {order.address.address1},{" "}
                                      {order.address.address2}
                                    </span>
                                  </div>
                                  <div className="flex items-start">
                                    <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                                    <span>
                                      {order.address.city},{" "}
                                      {order.address.country} -{" "}
                                      {order.address.postalCode}
                                    </span>
                                  </div>
                                  <div className="flex items-start">
                                    <Phone className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                                    <span>{order.address.phone}</span>
                                  </div>
                                  <div className="flex items-start">
                                    <Mail className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                                    <span>{order.address.email}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Payment Information */}
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                  <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                                  Payment Information
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Payment Method:
                                    </span>
                                    <span className="font-medium">
                                      {order.paymentMethod}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Payment Status:
                                    </span>
                                    <span
                                      className={`font-medium ${order.payment ? "text-green-600" : "text-yellow-600"}`}
                                    >
                                      {order.payment ? "Paid" : "Pending"}
                                    </span>
                                  </div>
                                  {(() => {
                                    const { subtotal, tax, discount, total } =
                                      resolveOrderTotals(order);
                                    return (
                                      <>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Subtotal:
                                          </span>
                                          <span className="font-medium">
                                            ₹{subtotal}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Tax (2%):
                                          </span>
                                          <span className="font-medium">
                                            ₹{tax}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Coupon Code:
                                          </span>
                                          <span className="font-medium">
                                            {order.couponCode
                                              ? order.couponCode
                                              : "N/A"}
                                          </span>
                                        </div>
                                        {discount > 0 && (
                                          <div className="flex justify-between">
                                            <span className="text-gray-600">
                                              Discount:
                                            </span>
                                            <span className="font-medium">
                                              -₹{discount}
                                            </span>
                                          </div>
                                        )}
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Order Total:
                                          </span>
                                          <span className="font-medium">
                                            ₹{total}
                                          </span>
                                        </div>
                                      </>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Support Modal */}
               {supportModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform transition-all scale-100 animate-fadeInUp">
      {/* Header with gradient accent */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#6e4fca]/10 rounded-full">
            <svg className="w-6 h-6 text-[#6e4fca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Contact Support</h3>
        </div>
        <button
          onClick={closeSupportModal}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XCircle className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={submitSupport}>
        <div className="space-y-5">
          {/* Order ID - read-only with subtle background */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order ID
            </label>
            <input
              type="text"
              value={selectedOrderId || ""}
              readOnly
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#6e4fca]/40"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={supportForm.name}
              onChange={handleSupportChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#6e4fca] focus:ring-2 focus:ring-[#6e4fca]/40 transition duration-200 outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={supportForm.phone}
              onChange={handleSupportChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#6e4fca] focus:ring-2 focus:ring-[#6e4fca]/40 transition duration-200 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={supportForm.email}
              onChange={handleSupportChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#6e4fca] focus:ring-2 focus:ring-[#6e4fca]/40 transition duration-200 outline-none"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              name="message"
              rows="4"
              value={supportForm.message}
              onChange={handleSupportChange}
              placeholder="Describe your issue in detail..."
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#6e4fca] focus:ring-2 focus:ring-[#6e4fca]/40 transition duration-200 outline-none resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={closeSupportModal}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submittingSupport}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#6e4fca] text-white font-medium hover:bg-[#5a3fb0] focus:ring-4 focus:ring-[#6e4fca]/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submittingSupport ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Submit
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="p-2 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <ChevronUp className="w-5 h-5 transform rotate-270" />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-10 h-10 rounded-md ${
                            currentPage === i + 1
                              ? "bg-[#6e4fca] text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages),
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <ChevronUp className="w-5 h-5 transform rotate-90" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserOrders;
