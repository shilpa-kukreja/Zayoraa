import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  img: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  metaTitle: { 
    type: String 
  },
  metaDescription: { 
    type: String 
  },
  order: {                     // <-- new field
    type: Number,
    default: 0,
    // optional: index for faster sorting
    // index: true
  }
}, { timestamps: true });

const categoryModel = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default categoryModel;