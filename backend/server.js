// import mongoose from 'mongoose';
// import express from 'express';
// import cors from 'cors';
// import 'dotenv/config'
// import connectDB from './config/db.js';
// import categoryRouter from './routes/categoryRoutes.js';






// const app = express();

// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// app.use(cors());
// app.use(express.json());
// const PORT = process.env.PORT || 5000;

// connectDB();

// // Routes
// app.use("/api/categories", categoryRouter);

// app.get('/', (req, res) => {
//   res.send('API is running...');
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './config/db.js';
import categoryRouter from './routes/categoryRoutes.js';
import path from "path";
import productRoutes from './routes/productRoutes.js';

import videoRoutes from './routes/videoRoutes.js';
import couponRouter from './routes/couponRoutes.js';
import contactRouter from './routes/contactRoutes.js';
import subscribeRoutes from './routes/subscriberRoutes.js';
import blogRouter from './routes/blogRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/dashboardRoutes.js';
import supportRoutes from './routes/supportRoutes.js';

import dns from "dns";

const app = express();
dns.setServers(["1.1.1.1","8.8.8.8"]);
// ✅ serve static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(cors());
app.use(express.json()); 
const PORT = process.env.PORT || 5000;

connectDB();

// Routes
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRoutes);
app.use("/api/users", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/coupons", couponRouter);
app.use("/api/contact", contactRouter);
app.use("/api/subscription", subscribeRoutes);
app.use("/api/blog",blogRouter);
app.use("/api/order", orderRoutes);
app.use('/api/dashboard', adminRoutes);
app.use('/api/support', supportRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



