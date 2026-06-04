'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiUser, FiShoppingBag, FiEdit, FiSave, FiX, FiLogOut, FiCamera, FiCheck, FiFileText } from 'react-icons/fi';
import Link from "next/link";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        username: "",
        email: "",
        number: ""
    });
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });
    const router = useRouter();

    // Sample order data to display when user has no orders
    const sampleOrder = {
        id: "ORD-12345",
        date: new Date().toLocaleDateString(),
        status: "Processing",
        total: "149.99",
        items: [
            { name: "Wireless Headphones", quantity: 1, price: 149.99 }
        ]
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/frontend/login");
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/getuser`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                if (data.success) {
                    setUser(data.user);
                    setEditForm({
                        username: data.user.username || "",
                        email: data.user.email || "",
                        number: data.user.number || ""
                    });
                } else {
                    router.push("/frontend/login");
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                router.push("/frontend/login");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    const showNotification = (message, type = "success") => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/frontend/login");
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/updateuser`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();
            if (data.success) {
                setUser(data.user);
                showNotification("Profile picture updated successfully!");
            } else {
                showNotification(data.message || "Failed to upload image", "error");
            }
        } catch (error) {
            console.error("Image upload failed:", error);
            showNotification("Image upload failed", "error");
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        const token = localStorage.getItem("token");
        
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/updateuser`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editForm),
            });

            const data = await res.json();
            if (data.success) {
                setUser(data.user);
                setIsEditing(false);
                showNotification("Profile updated successfully!");
            } else {
                showNotification(data.message || "Failed to update profile", "error");
            }
        } catch (error) {
            console.error("Profile update failed:", error);
            showNotification("Profile update failed", "error");
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm({
            username: user?.username || "",
            email: user?.email || "",
            number: user?.number || ""
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const viewOrderDetails = (order) => {
        setSelectedOrder(order);
    };

    const closeOrderDetails = () => {
        setSelectedOrder(null);
    };

    // Check if user has orders, otherwise use sample order
    const hasOrders = user && user.orders && user.orders.length > 0;
    const ordersToDisplay = hasOrders ? user.orders : [sampleOrder];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6e4fca] mb-4"></div>
                    <p className="text-gray-500">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Notification */}
            {notification.show && (
                <div className={`fixed top-4 right-4 px-6 py-3 rounded-md shadow-md z-50 transition-all duration-300 transform ${notification.type === "error" ? "bg-red-500" : "bg-green-500"} text-white flex items-center`}>
                    <FiCheck className="mr-2" />
                    {notification.message}
                </div>
            )}
            
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="sm:text-2xl text-xl font-bold text-gray-800">My Account</h1>
                    <button
                        onClick={() => router.back()}
                        className="text-sm text-gray-500 hidden sm:flex hover:text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors  items-center"
                    >   
                        <FiArrowLeft className="w-4 h-4 mr-2" />    
                        Back
                    </button>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3 bg-gray-50 rounded-full pl-1 pr-4 py-1">
                            {user?.img ? (
                                <img
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${user.img} `}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#a998da] to-[#6e4fca] flex items-center justify-center text-white text-sm font-medium shadow-sm">
                                    {user?.username?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                            )}
                            <span className="sm:text-sm text-xs font-medium text-gray-700">{user?.username}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center"
                        >
                            <FiLogOut className="h-4 w-4 mr-1" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 mb-8 text-white shadow-lg">
                    <div className="flex items-center">
                        <div className="mr-4">
                            {user?.img ? (
                                <img
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${user.img}`}
                                    alt="Profile"
                                    className="w-16 h-16 rounded-full object-cover border-4 border-white/30 shadow-md"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-medium shadow-md backdrop-blur-sm">
                                    {user?.username?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="sm:text-2xl text-xl font-bold">Welcome back, {user?.username}!</h2>
                            <p className="text-blue-100 text-sm">Manage your account information and track your orders</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-8">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === "profile"
                                ? "border-[#6e4fca] text-[#6e4fca]"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                } transition-colors duration-200`}
                        >
                            <FiUser className="h-5 w-5 mr-2" />
                            My Profile
                        </button>
                        <Link href="/frontend/orders">
                        <button          
                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === "orders"
                                ? "border-[#6e4fca] text-[#6e4fca]"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                } transition-colors duration-200`}
                        >
                            <FiShoppingBag className="h-5 w-5 mr-2" />
                            My Orders
                        </button>
                        </Link>
                    </nav>
                </div>

                {/* Profile Section */}
                {activeTab === "profile" && (
                    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <div className="px-6 py-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                                {!isEditing && (
                                    <button 
                                        onClick={handleEdit}
                                        className="flex items-center text-black hover:text-[#6e4fca] font-medium transition-colors"
                                    >
                                        <FiEdit className="h-5 w-5 mr-1" />
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Profile Image Section */}
                                <div className="md:w-1/3">
                                    <div className="flex flex-col items-center">
                                        {user?.img ? (
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${user.img}`}
                                                alt="Profile"
                                                className="w-40 h-40 rounded-full object-cover border-4 border-gray-100 shadow-md mb-4"
                                            />
                                        ) : (
                                            <div className="w-40 h-40 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center text-gray-400 mb-4 border-4 border-white shadow-md">
                                                <FiUser className="h-20 w-20" />
                                            </div>
                                        )}

                                        <label className="cursor-pointer bg-white text-[#6e4fca] border border-[#6e4fca] rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-50 transition-colors flex items-center">
                                            <FiCamera className="h-4 w-4 mr-2" />
                                            Change Photo
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageUpload}
                                            />
                                        </label>
                                        <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. Max size of 2MB.</p>
                                    </div>
                                </div>

                                {/* User Details */}
                                <div className="md:w-2/3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="username"
                                                    value={editForm.username}
                                                    onChange={handleInputChange}
                                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                    placeholder="Enter your full name"
                                                />
                                            ) : (
                                                <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                                    {user?.username || "Not provided"}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                            {isEditing ? (
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={editForm.email}
                                                    onChange={handleInputChange}
                                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                    placeholder="Enter your email"
                                                />
                                            ) : (
                                                <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                                    {user?.email || "Not provided"}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    name="number"
                                                    value={editForm.number}
                                                    onChange={handleInputChange}
                                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                    placeholder="Enter your phone number"
                                                />
                                            ) : (
                                                <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                                    {user?.number || "Not provided"}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="mt-6 flex space-x-3">
                                            <button 
                                                onClick={handleSave}
                                                className="bg-blue-600 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
                                            >
                                                <FiSave className="h-4 w-4 mr-1" />
                                                Save Changes
                                            </button>
                                            <button 
                                                onClick={handleCancel}
                                                className="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors flex items-center"
                                            >
                                                <FiX className="h-4 w-4 mr-1" />
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Orders Section */}
                {activeTab === "orders" && (
                    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <div className="px-6 py-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order History</h2>

                            {ordersToDisplay.length > 0 ? (
                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Order ID
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Total
                                                </th>
                                                <th scope="col" className="relative px-6 py-3">
                                                    <span className="sr-only">Actions</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {ordersToDisplay.map((order) => (
                                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        #{order.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {order.date}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                            ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                                order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                                        'bg-blue-100 text-blue-800'}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        ${order.total}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button 
                                                            onClick={() => viewOrderDetails(order)}
                                                            className="text-blue-600 hover:text-blue-900 flex items-center justify-end w-full"
                                                        >
                                                            View Details
                                                            <FiFileText className="h-4 w-4 ml-1" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                                    <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by placing your first order.</p>
                                    <div className="mt-6">
                                        <button
                                            onClick={() => router.push("/")}
                                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Start Shopping
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Order Details Modal */}
                            {selectedOrder && (
                                <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
                                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-medium text-gray-800">Order Details: #{selectedOrder.id}</h3>
                                            <button onClick={closeOrderDetails} className="text-gray-500 hover:text-gray-700">
                                                <FiX className="h-6 w-6" />
                                            </button>
                                        </div>
                                        <div className="border rounded-md overflow-hidden">
                                            <div className="grid grid-cols-3 bg-gray-100 px-4 py-3 font-medium text-gray-700">
                                                <div>Product</div>
                                                <div className="text-center">Quantity</div>
                                                <div className="text-right">Price</div>
                                            </div>
                                            {selectedOrder.items.map((item, index) => (
                                                <div key={index} className="grid grid-cols-3 px-4 py-3 border-t">
                                                    <div className="font-medium">{item.name}</div>
                                                    <div className="text-center">{item.quantity}</div>
                                                    <div className="text-right">${item.price}</div>
                                                </div>
                                            ))}
                                            <div className="border-t px-4 py-3 bg-white font-medium">
                                                <div className="flex justify-between">
                                                    <span>Total:</span>
                                                    <span>${selectedOrder.total}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {!hasOrders && (
                                            <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                                                <p className="text-sm">This is a sample order. Place a real order to see your actual order history.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            <footer className="bg-white mt-12 py-6 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} Suyta. All rights reserved.
                </div>
            </footer>
        </div>
    );
}