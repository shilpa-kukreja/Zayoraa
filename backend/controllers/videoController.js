import productModel from "../models/productModel.js";
import videoModel from "../models/videoModel.js";
import { deleteUploadFile } from "../utils/fileUtils.js";

// Add Video
export const addVideo = async (req, res) => {
  try {
    const { productid, order } = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No video uploaded" });
    }
    if (!productid) {
        return res.status(400).json({ success: false, message: "Product ID is required" });
        }

    // Check if product exists
    const product = await productModel.findById(productid);
    if (!product) { 
        return res.status(404).json({ success: false, message: "Product not found" });
        }
    const newVideo = new videoModel({
      videourl: `/uploads/videos/${req.file.filename}`, // local path
      productid,
      order,
    });

    await newVideo.save();
    res.status(201).json({ success: true, video: newVideo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// List Videos
export const listVideos = async (req, res) => {
  try {
    const videos = await  videoModel.find().populate("productid", "name");
    res.status(200).json({ success: true, videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ➝ Get videos by product
export const getVideosByProduct = async (req, res) => {
  try {
    const { productid } = req.params;
    const videos = await videoModel.find({ productid }).sort({ order: 1 });
    res.status(200).json({ success: true, videos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching videos", error: error.message });
  }
};

// ➝ Delete video
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVideo = await videoModel.findByIdAndDelete(id);

    if (!deletedVideo) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    if (deletedVideo.videourl) {
      await deleteUploadFile(deletedVideo.videourl);
    }

    res.status(200).json({ success: true, message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting video", error: error.message });
  }
};

// ➝ Update video order
export const updateVideoOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { order } = req.body;

    const video = await videoModel.findByIdAndUpdate(id, { order }, { new: true });
    res.status(200).json({ success: true, video });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating video order", error: error.message });
  }
};
