import express from "express";
import { addVideo, listVideos, deleteVideo, updateVideoOrder, getVideosByProduct } from "../controllers/videoController.js";
import upload from "../middlewares/videoUpload.js";




const videoRoutes= express.Router();

videoRoutes.post("/video",upload.single("video"), addVideo);               
videoRoutes.get("/listvideo", listVideos);             
videoRoutes.get("/product/:productid", getVideosByProduct); 
videoRoutes.delete("/:id",deleteVideo);       
videoRoutes.put("/:id/order", updateVideoOrder); 

export default videoRoutes;
