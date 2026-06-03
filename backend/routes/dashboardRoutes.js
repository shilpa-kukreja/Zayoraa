import express from 'express';
import { getDashboardStats, getMonthlyRevenue } from '../controllers/dashboardController.js';


const adminRoutes = express.Router();

// Dashboard routes
adminRoutes.get('/stats', getDashboardStats);
adminRoutes.get('/revenue', getMonthlyRevenue);

export default adminRoutes;