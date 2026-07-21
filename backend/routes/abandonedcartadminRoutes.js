import express from "express";
import {
  listCarts,
  getStats,
  createDummyCarts,
  sendManualReminder,
  markRestored,
  deleteCart,
} from "../controllers/abandonedcartadminController.js";

const router = express.Router();

// Main list endpoint
router.get("/", listCarts);
router.get("/stats", getStats);

// Test data (admin only)
router.post("/test/create-dummy", createDummyCarts);

// Cart actions (admin)
router.post("/:id/remind", sendManualReminder);
router.put("/:id/restore", markRestored);
router.delete("/:id", deleteCart);

export default router;