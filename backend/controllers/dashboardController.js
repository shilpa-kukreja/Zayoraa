import userModel from '../models/authModel.js';
import orderModel from '../models/orderModel.js';
import productModel from "../models/productModel.js";

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await userModel.countDocuments();
    const totalOrders = await orderModel.countDocuments();
    const totalProducts = await productModel.countDocuments();
    
    // Calculate date for last 30 days (evaluated per request)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Get revenue data
    const revenueData = await orderModel.aggregate([
      {
        $match: {
          status: 'Delivered',
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$amount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Get recent orders - fixed to use userId field
    const recentOrders = await orderModel.find()
      .populate('userId', 'username email')  // Changed from 'user' to 'userId'
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get top products - fixed to use productId field
    const topProducts = await orderModel.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',  // Changed from 'product' to 'productId'
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);
    
    // Get order status counts
    const orderStatusCounts = await orderModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue: revenueData.reduce((sum, day) => sum + day.revenue, 0)
      },
      revenueData,
      recentOrders,
      topProducts,
      orderStatusCounts
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get monthly revenue data
export const getMonthlyRevenue = async (req, res) => {
  try {
    // Calculate date for last year (evaluated per request)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const monthlyRevenue = await orderModel.aggregate([
      {
        $match: {
          status: 'Delivered',
          createdAt: { $gte: oneYearAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({ success: true, monthlyRevenue });
  } catch (error) {
    console.error('Monthly revenue error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};