import mongoose from "mongoose";

const recommendedProductSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true, // Each product can be recommended only once
    },
    order: {
      type: Number,
      default: 0, // Lower numbers appear first
    },
    active: {
      type: Boolean,
      default: true, // Admin can temporarily hide a recommendation without deleting
    },
  },
  { timestamps: true }
);

// Index for efficient sorting/filtering
recommendedProductSchema.index({ active: 1, order: 1 });

const RecommendedProduct =
  mongoose.models.RecommendedProduct ||
  mongoose.model("RecommendedProduct", recommendedProductSchema);

export default RecommendedProduct;