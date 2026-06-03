import mongoose from "mongoose";
import categoryModel from "./categoryModel.js";
import SubCategory from "./subcategoryModel.js";

const variantSchema = new mongoose.Schema({
  color: { type: String },
  colorcode: { type: String },
  image: { type: String },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  stock: { type: Number, default: 0 }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  products: { type: Array, required: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  thumbImg: { type: String, required: true },
  galleryImg: [{ type: String, required: true }],
  stock: { type: Number, default: 0 },
  section: [{ type: String }],
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  subcategory: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" }],
  sku: { type: String },
  variant: [variantSchema],
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  width: { type: Number },
  height: { type: Number },
  weight: { type: Number },
  length: { type: Number },
  metatitle: { type: String },
  metadescription: { type: String }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
