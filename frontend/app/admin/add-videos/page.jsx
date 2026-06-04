"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminLayout from "../components/AdminLayout";

export default function AddVideo() {
  const [video, setVideo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [productid, setProductId] = useState("");
  const [order, setOrder] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("http://localhost:5000/api/products/get");
        if (res.data?.products) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      // Only set dragActive to false if we're leaving the drop zone
      const relatedTarget = e.relatedTarget;
      const dropZone = e.currentTarget;
      
      if (!dropZone.contains(relatedTarget)) {
        setDragActive(false);
      }
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  // File validation and processing
  const processFile = (file) => {
    // Validate file type
    const validTypes = ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo'];
    if (file && !validTypes.some(type => file.type === type)) {
      toast.error("Please select a valid video file (MP4, AVI, MOV)");
      return false;
    }
    
    // Validate file size (max 100MB)
    if (file && file.size > 100 * 1024 * 1024) {
      toast.error("Video file size must be less than 100MB");
      return false;
    }
    
    setVideo(file);
    
    // Preview video
    const url = URL.createObjectURL(file);
    setPreview(url);
    
    return true;
  };

  // Handle file selection from input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    processFile(file);
  };

  // Handle click on drop zone to trigger file input
  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!video) {
      toast.error("Please select a video file");
      return;
    }
    
    if (!productid) {
      toast.error("Please select a product");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append("video", video);
    formData.append("productid", productid);
    formData.append("order", order || "0");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/videos/video",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(percentCompleted);
          },
        }
      );
      
      toast.success("Video uploaded successfully!");
      
      // Reset form
      setVideo(null);
      setPreview(null);
      setProductId("");
      setOrder("");
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <AdminLayout>
      <div className=" mx-auto">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
            <div className="flex items-center">
              <div className="bg-white/10 p-3 rounded-lg mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Upload Product Video</h1>
                <p className="text-blue-100 mt-1">Add engaging videos to showcase your products</p>
              </div>
            </div>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* File Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Video File <span className="text-red-500">*</span>
              </label>
              <div 
                className={`relative flex items-center justify-center w-full h-56 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                  dragActive 
                    ? "border-blue-500 bg-blue-50 ring-4 ring-blue-100" 
                    : preview 
                    ? "border-gray-300" 
                    : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleDropZoneClick}
              >
                <input 
                  ref={fileInputRef}
                  id="video-file" 
                  type="file" 
                  accept="video/mp4,video/avi,video/quicktime,video/x-msvideo" 
                  onChange={handleFileChange} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
                
                {preview ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                    <div className="relative">
                      <video 
                        src={preview} 
                        controls 
                        className="max-h-36 rounded-lg shadow-inner"
                      />
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video?.type.split('/')[1]?.toUpperCase()}
                      </div>
                    </div>
                    <div className="mt-3 text-sm font-medium text-gray-700 truncate max-w-xs">
                      {video?.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatFileSize(video?.size)}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideo(null);
                        setPreview(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="mt-2 text-sm text-red-600 hover:text-red-800 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <svg className={`w-12 h-12 mb-4 ${dragActive ? "text-blue-500" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-600">
                      {dragActive ? (
                        <span className="font-semibold text-blue-600">Drop video here</span>
                      ) : (
                        <span className="font-semibold text-blue-600">Click to upload</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      MP4, AVI, MOV up to 100MB
                    </p>
                    {dragActive && (
                      <div className="mt-4 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                        Release to upload
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Uploading...</span>
                  <span className="text-sm font-medium text-blue-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Product Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Product <span className="text-red-500">*</span>
                </label>
                {isLoading ? (
                  <div className="flex items-center justify-center p-4 border border-gray-300 rounded-lg bg-gray-50">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-gray-600">Loading products...</span>
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      id="product"
                      value={productid}
                      onChange={(e) => setProductId(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                      required
                    >
                      <option value="">Select a product</option>
                      {products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name} {product.sku ? `(SKU: ${product.sku})` : ''}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Input */}
              <div>
                <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  id="order"
                  type="number"
                  min="0"
                  placeholder="Enter display order"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-2">Lower numbers appear first. Default is 0.</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isUploading || !video || !productid}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 border border-transparent rounded-lg font-semibold text-white shadow-md hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading... ({uploadProgress}%)
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Video
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};