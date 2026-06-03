import express from "express";
import upload from "../middlewares/productMulter.js";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/productController.js";


const productRoutes = express.Router();

// Multer upload config for product
productRoutes.post(
  "/create",
  upload.any(),
   createProduct 
);

productRoutes.get("/get", getProducts);
productRoutes.get("/:id", getProductById);
productRoutes.put(
  "/:id",
  upload.any(),
  updateProduct
);
productRoutes.delete("/:id", deleteProduct);

export default productRoutes;
