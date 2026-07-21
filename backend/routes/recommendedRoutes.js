import express from "express";
import {
  addRecommendedProduct,
  getAllRecommended,
  getRecommendedById,
  updateRecommended,
  deleteRecommended,
  getActiveRecommended,
} from "../controllers/recommendedController.js";

const router = express.Router();

// Public route (no admin auth needed, but you can add middleware later)
router.get("/active", getActiveRecommended);

// Admin routes (protect with auth middleware as per your project)
router.post("/", addRecommendedProduct);
router.get("/", getAllRecommended);
router.get("/:id", getRecommendedById);
router.put("/:id", updateRecommended);
router.delete("/:id", deleteRecommended);

export default router;