"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import AdminLayout from "../components/AdminLayout";
import {
  User,
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  MoreHorizontal,
  Eye,
  Download,
  RefreshCw,
  BarChart3,
  ChevronDown,
  CreditCard,
  CheckCircle,
  XCircle,
  Truck,
  Sparkles
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30");
  const [activeChart, setActiveChart] = useState("line");

  // Colors for charts
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  const statusColors = {
    'Order Placed': '#3B82F6',
    'Shipped': '#F59E0B',
    'Delivered': '#10B981',
    'Cancelled': '#EF4444',
    'Returned': '#8B5CF6'
  };

  const statusIcons = {
    'Order Placed': <Package className="w-4 h-4" />,
    'Shipped': <Truck className="w-4 h-4" />,
    'Delivered': <CheckCircle className="w-4 h-4" />,
    'Cancelled': <XCircle className="w-4 h-4" />,
    'Returned': <RefreshCw className="w-4 h-4" />
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, revenueRes] = await Promise.all([
        axios.get("http://localhost:5000/api/dashboard/stats"),
        axios.get("http://localhost:5000/api/dashboard/revenue")
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
        setRevenueData(statsRes.data.revenueData);
        setRecentOrders(statsRes.data.recentOrders);
        setTopProducts(statsRes.data.topProducts);
        setOrderStatusData(statsRes.data.orderStatusCounts);
      }

      if (revenueRes.data.success) {
        setMonthlyRevenue(revenueRes.data.monthlyRevenue);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error("Failed to fetch dashboard data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  // Format numbers with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Loading dashboard...</p>
            <p className="text-gray-400 text-sm mt-2">Fetching the latest data</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <Toaster position="top-right" />
        
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store today.</p>
            </div>
            <div className="flex items-center mt-4 md:mt-0 space-x-3">
              <div className="relative">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2.5 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
              <button 
                onClick={fetchDashboardData}
                className="bg-white text-gray-700 px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 transition flex items-center shadow-sm"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {/* Total Revenue Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalRevenue || 0)}</h3>
                  </div>
                  <div className="bg-blue-500 p-3 rounded-xl shadow-sm">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500 font-medium">+12.5%</span>
                  <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
              </div>
            </div>

            {/* Total Orders Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(stats.totalOrders || 0)}</h3>
                  </div>
                  <div className="bg-green-500 p-3 rounded-xl shadow-sm">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500 font-medium">+8.2%</span>
                  <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
              </div>
            </div>

            {/* Total Customers Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Customers</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(stats.totalUsers || 0)}</h3>
                  </div>
                  <div className="bg-purple-500 p-3 rounded-xl shadow-sm">
                    <User className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500 font-medium">+5.7%</span>
                  <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
              </div>
            </div>

            {/* Total Products Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(stats.totalProducts || 0)}</h3>
                  </div>
                  <div className="bg-amber-500 p-3 rounded-xl shadow-sm">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500 font-medium">+3.1%</span>
                  <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
              </div>
            </div>
          </div>

         

          {/* Recent Orders & Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                <button className="text-blue-600 text-sm font-medium flex items-center hover:text-blue-800 transition">
                  View all
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-blue-50 transition">
                      <div>
                        <p className="font-medium text-gray-900">#{order.orderid}</p>
                        <p className="text-sm text-gray-500 mt-1">{order.address.fullName || "Guest"} </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatCurrency(order.amount)}</p>
                        <div className="inline-flex items-center mt-1 px-3 py-1 rounded-full text-xs font-medium bg-opacity-20"
                          style={{ 
                            backgroundColor: `${statusColors[order.status]}20`,
                            color: statusColors[order.status]
                          }}
                        >
                          {statusIcons[order.status]}
                          <span className="ml-1.5">{order.status}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No recent orders</p>
                  </div>
                )}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
                <button className="text-blue-600 text-sm font-medium flex items-center hover:text-blue-800 transition">
                  View all
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="space-y-4">
                {topProducts.length > 0 ? (
                  topProducts.map((product, index) => (
                    <div key={product._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-blue-50 transition">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4 text-white font-bold shadow-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.product?.name || 'Unknown Product'}</p>
                          <p className="text-sm text-gray-500 mt-1">{product.totalSold} units sold</p>
                        </div>
                      </div>
                      <p className="font-medium text-gray-900">{formatCurrency(product.revenue)}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No products data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>




           {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Last 30 days</span>
                  </div>
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button 
                      onClick={() => setActiveChart('line')}
                      className={`p-2 rounded-md text-sm font-medium ${activeChart === 'line' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                    >
                      Line
                    </button>
                    <button 
                      onClick={() => setActiveChart('area')}
                      className={`p-2 rounded-md text-sm font-medium ${activeChart === 'area' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                    >
                      Area
                    </button>
                  </div>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {activeChart === 'line' ? (
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="_id" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return `${date.getDate()}/${date.getMonth() + 1}`;
                        }}
                      />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${value}`} />
                      <Tooltip 
                        formatter={(value) => [`₹${value}`, 'Revenue']}
                        labelFormatter={(label) => `Date: ${label}`}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3B82F6" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }} 
                        activeDot={{ r: 6, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }} 
                      />
                    </LineChart>
                  ) : (
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="_id" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return `${date.getDate()}/${date.getMonth() + 1}`;
                        }}
                      />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${value}`} />
                      <Tooltip 
                        formatter={(value) => [`₹${value}`, 'Revenue']}
                        labelFormatter={(label) => `Date: ${label}`}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3B82F6" 
                        fill="url(#colorRevenue)" 
                        strokeWidth={3} 
                      />
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Order Status Chart */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Order Status Distribution</h3>
                <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={statusColors[entry._id] || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [`${value} orders`, props.payload._id]}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Legend 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      content={({ payload }) => (
                        <div className="flex flex-col space-y-2">
                          {payload.map((entry, index) => (
                            <div key={`legend-${index}`} className="flex items-center">
                              <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: entry.color }}></div>
                              <span className="text-sm text-gray-600">{entry.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue Trend</h3>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">Last 12 months</span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="_id" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const [year, month] = value.split('-');
                      return `${month}/${year.slice(2)}`;
                    }}
                  />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${value/1000}k`} />
                  <Tooltip 
                    formatter={(value) => [`₹${value}`, 'Revenue']}
                    labelFormatter={(label) => {
                      const [year, month] = label.split('-');
                      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      return `${monthNames[parseInt(month) - 1]} ${year}`;
                    }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="url(#colorBar)" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;