import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // must match your Category model name
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const SubCategory = mongoose.models.SubCategory || mongoose.model("SubCategory", subcategorySchema);
export default SubCategory;
