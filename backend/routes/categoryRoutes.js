// routes/categoryRoutes.js
import express from "express";
import { createCategory, deleteCategory, getCategories, getCategoryByid,  updateCategory } from "../controllers/categoryController.js";
import upload from "../middlewares/multer.js";


const categoryRouter = express.Router();

categoryRouter.post("/create",upload.fields([{ name: "img", maxCount: 1 }, { name: "banner", maxCount: 1 }]), createCategory); // Create
categoryRouter.get("/get",  getCategories); // Read all
categoryRouter.get("/:id", getCategoryByid); // Read single by slug
categoryRouter.put("/:id",upload.fields([{ name: "img", maxCount: 1 }, { name: "banner", maxCount: 1 }]), updateCategory); // Update
categoryRouter.delete("/:id", deleteCategory); // Delete

export default categoryRouter;
