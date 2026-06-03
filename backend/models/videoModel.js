import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    videourl: { type: String, required: true }, 
    productid: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const videoModel = mongoose.models.Video || mongoose.model("Video", videoSchema);
export default videoModel;
