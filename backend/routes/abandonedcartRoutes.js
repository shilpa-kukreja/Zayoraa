import express from "express";
import { syncCart, restoreCart } from "../controllers/abandonedcartController.js";
// import { isAuthenticated } from "../middleware/auth.js"; // your auth middleware

const router = express.Router();

router.post("/sync",syncCart);
router.get("/restore", restoreCart); // no auth needed – token is the proof

export default router;