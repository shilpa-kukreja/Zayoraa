import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    blogImg: { type: String, required: true },
    blogName: { type: String, required: true },
    blogSlug: { type: String, required: true, unique: true },
    blogDate: { type: String, required: true },
    blogDetail: { type: String, required: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    metatag: { type: String },
  },
  { timestamps: true }
);

const blogModel=mongoose.models.blog || mongoose.model("blog",blogSchema)
export default blogModel;
