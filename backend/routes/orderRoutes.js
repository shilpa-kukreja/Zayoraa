import express from "express";
import { allOrders,  placeOrderCOD, placeOrderRazorpay, updateStatus, userOrders, userSingleOrder, verifyRazorpay } from "../controllers/orderController.js";



const orderRoutes = express.Router();

orderRoutes.post("/cod", placeOrderCOD);
orderRoutes.post("/razorpay", placeOrderRazorpay);
orderRoutes.post("/verify", verifyRazorpay);
orderRoutes.get("/all", allOrders);
orderRoutes.post("/user", userOrders);

orderRoutes.get("/:id", userSingleOrder);
orderRoutes.put("/status", updateStatus);

export default orderRoutes;
