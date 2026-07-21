import RecommendedProduct from "../models/recommendedModel.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

// ============================
// Admin: Add a product to recommendations
// ============================
export const addRecommendedProduct = async (req, res) => {
  try {
    const { productId, order = 0, active = true } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Check if already recommended
    const existing = await RecommendedProduct.findOne({ product: productId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Product is already in the recommended list",
      });
    }

    const recommended = await RecommendedProduct.create({
      product: productId,
      order,
      active,
    });

    // Populate product details for response
    const populated = await recommended.populate("product");

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// Admin: Get all recommended products (with product details)
// ============================
export const getAllRecommended = async (req, res) => {
  try {
    const recommendations = await RecommendedProduct.find()
      .populate("product")
      .sort({ order: 1, createdAt: -1 }); // order ascending, then newest first

    res.json({ success: true, data: recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// Admin: Get a single recommended entry by ID
// ============================
export const getRecommendedById = async (req, res) => {
  try {
    const { id } = req.params;
    const recommendation = await RecommendedProduct.findById(id).populate(
      "product"
    );

    if (!recommendation) {
      return res
        .status(404)
        .json({ success: false, message: "Recommended entry not found" });
    }

    res.json({ success: true, data: recommendation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// Admin: Update order / active status
// ============================
export const updateRecommended = async (req, res) => {
  try {
    const { id } = req.params;
    const { order, active } = req.body;

    const recommendation = await RecommendedProduct.findById(id);
    if (!recommendation) {
      return res
        .status(404)
        .json({ success: false, message: "Recommended entry not found" });
    }

    if (order !== undefined) recommendation.order = order;
    if (active !== undefined) recommendation.active = active;

    await recommendation.save();
    await recommendation.populate("product");

    res.json({ success: true, data: recommendation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// Admin: Remove a product from recommendations
// ============================
export const deleteRecommended = async (req, res) => {
  try {
    const { id } = req.params;
    const recommendation = await RecommendedProduct.findByIdAndDelete(id);

    if (!recommendation) {
      return res
        .status(404)
        .json({ success: false, message: "Recommended entry not found" });
    }

    res.json({
      success: true,
      message: "Product removed from recommendations",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// Public: Get active recommended products (for cart page)
// ============================
export const getActiveRecommended = async (req, res) => {
  try {
    const recommendations = await RecommendedProduct.find({ active: true })
      .populate("product")
      .sort({ order: 1 });

    // Extract product objects (or return full docs)
    const products = recommendations.map((rec) => rec.product);

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};