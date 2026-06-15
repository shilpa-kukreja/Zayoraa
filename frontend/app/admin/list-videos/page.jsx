"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminLayout from "../components/AdminLayout";
import { VideoDuration } from "../components/VideoDuration";
import * as XLSX from "xlsx";

export default function ListVideos() {
    const [videos, setVideos] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterProduct, setFilterProduct] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
    const [isExporting, setIsExporting] = useState(false);

    // Fetch videos and products
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [videosRes, productsRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/videos/listvideo`),
                    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/get`)
                ]);

                // Handle different API response structures
                const videosData = videosRes.data.videos || videosRes.data || [];
                const productsData = productsRes.data?.products || productsRes.data || [];

                setVideos(Array.isArray(videosData) ? videosData : []);
                setProducts(Array.isArray(productsData) ? productsData : []);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch data");
                setVideos([]);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);
    const exportToExcel = () => {
        if (isExporting) return; // Prevent multiple clicks
        setIsExporting(true);
        try {
            // const dataToExport = filteredVideos.map(video => ({
            //     // Title: video.title || "Untitled Video",
            //     Product: getProductName(
            //         typeof video.productid === "object" ? video.productid._id : video.productid
            //     ),
            //     Order: video.order !== undefined ? video.order : "",
            //     Size: formatFileSize(video.size),
            //     Uploaded: formatDate(video.createdAt),
            //     URL: video.videourl ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${video.videourl}` : "N/A",
            // }));

            const dataToExport = filteredVideos.map(video => ({
    Product: getProductName(video.productid),
    Order: video.order !== undefined ? video.order : "",
    Size: formatFileSize(video.size),
    Uploaded: formatDate(video.createdAt),
    URL: video.videourl ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${video.videourl}` : "N/A",
}));

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Videos");

            // Adjust column widths
            const columnWidths = [
                { wch: 30 }, // Title
                { wch: 25 }, // Product
                { wch: 10 }, // Order
                { wch: 10 }, // Size
                { wch: 15 }, // Uploaded
                { wch: 50 }, // URL
            ];
            worksheet["!cols"] = columnWidths;

            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `videos_${new Date().toISOString().slice(0, 10)}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast.success("Exported to Excel successfully");
        } catch (error) {
            console.error("Error exporting to Excel", error);
            toast.error("Failed to export to Excel");
        } finally {
            setIsExporting(false);
        }
    }   

    // Delete video
    const handleDelete = async (id, title) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/videos/${id}`);
            toast.success("Video deleted successfully");
            setVideos(videos.filter(video => video._id !== id));
        } catch (err) {
            console.error("Error deleting video", err);
            toast.error("Failed to delete video");
        }
    };

    // Get product name by ID
    // const getProductName = (productId) => {
    //     if (!productId) return "No Product";
    //     const id = typeof productId === "object" ? productId._id : productId;
    //     const product = products.find((p) => p._id === id);
    //     return product ? product.name : "Unknown Product";
    // };
    const getProductName = (productId) => {
    if (!productId) return "No Product";
    // Safely extract ID if productId is an object with _id
    const id = productId && typeof productId === "object" ? productId._id : productId;
    const product = products.find((p) => p._id === id);
    return product ? product.name : "Unknown Product";
};


    // Handle sorting
    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Sort videos safely
    const sortedVideos = Array.isArray(videos) ? [...videos].sort((a, b) => {
        if (!a || !b) return 0;

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === undefined || bValue === undefined) return 0;
        if (aValue === null || bValue === null) return 0;

        if (aValue < bValue) {
            return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
    }) : [];

    // Filter videos safely
    // const filteredVideos = Array.isArray(sortedVideos)
    //     ? sortedVideos.filter(video => {
    //         if (!video) return false;

    //         const videoTitle = video.title || "";
    //         const productIdStr =
    //             typeof video.productid === "object"
    //                 ? video.productid._id
    //                 : video.productid || "";

    //         const productName = getProductName(productIdStr);

    //         const matchesSearch =
    //             videoTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             productName.toLowerCase().includes(searchTerm.toLowerCase());

    //         const matchesProduct =
    //             !filterProduct || productIdStr === filterProduct;

    //         return matchesSearch && matchesProduct;
    //     })
    //     : [];

    const filteredVideos = Array.isArray(sortedVideos)
    ? sortedVideos.filter(video => {
        if (!video) return false;

        const videoTitle = video.title || "";
        
        // ✅ Safe product ID extraction
        let productIdStr = "";
        if (video.productid && typeof video.productid === "object") {
            productIdStr = video.productid._id || "";
        } else if (video.productid) {
            productIdStr = video.productid;
        }

        const productName = getProductName(productIdStr);

        const matchesSearch =
            videoTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            productName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesProduct =
            !filterProduct || productIdStr === filterProduct;

        return matchesSearch && matchesProduct;
    })
    : [];



    // Format file size
    const formatFileSize = (bytes) => {
        if (!bytes || isNaN(bytes)) return 'N/A';
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    // Get sort indicator
    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === "asc" ? "↑" : "↓";
    };

    return (
        <AdminLayout>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Video Library</h2>
                        <p className="text-gray-600 mt-1">
                            {videos.length} videos in total • {filteredVideos.length} filtered
                        </p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3">


                    <button
                        onClick={exportToExcel}
                        disabled={isExporting}
                        className={`mt-4 md:mt-0 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-medium py-2.5 px-5 rounded-lg flex items-center transition-colors shadow-md ${
                            isExporting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {isExporting ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h11M9 21V3m0 0L4 8m5-5l5 5M13 10h8m-4-4v8m0 0l-4-4m4 4l4-4" />
                            </svg>
                        )}
                        {isExporting ? "Exporting..." : "Export to Excel"}
                    </button>



                    <a
                        href="/admin/add-videos"
                        className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium py-2.5 px-5 rounded-lg flex items-center transition-colors shadow-md"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Upload New Video
                    </a>
                    </div> 
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="rounded-full bg-blue-100 p-3 mr-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Total Videos</p>
                                <p className="text-2xl font-bold text-gray-800">{videos.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="rounded-full bg-green-100 p-3 mr-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Active Videos</p>
                                <p className="text-2xl font-bold text-gray-800">{videos.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="rounded-full bg-purple-100 p-3 mr-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Total Products</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {new Set(videos.filter(v => v && v.productid).map(v => v.productid)).size}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="rounded-full bg-amber-100 p-3 mr-4">
                                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Total Size</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {formatFileSize(videos.reduce((total, video) => total + (video?.size || 0), 0))}
                                </p>
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* Search and Filters */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative w-full md:w-2/5">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search videos or products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>

                        <div className="relative w-full md:w-2/5">
                            <select
                                value={filterProduct}
                                onChange={(e) => setFilterProduct(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                            >
                                <option value="">All Products</option>
                                {products.map((product) => (
                                    <option key={product._id} value={product._id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setFilterProduct("");
                            }}
                            className="px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-200 flex items-center transition-colors whitespace-nowrap"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reset Filters
                        </button>
                    </div>
                </div>

                {/* Videos Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {isLoading ? (
                        <div className="p-12 text-center">
                            <div className="inline-flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-gray-600 text-lg">Loading videos...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                                onClick={() => handleSort("title")}
                                            >
                                                <div className="flex items-center">
                                                    Video
                                                    <span className="ml-1">{getSortIndicator("title")}</span>
                                                </div>
                                            </th>
                                            <th
                                                className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                                onClick={() => handleSort("productid")}
                                            >
                                                <div className="flex items-center">
                                                    Product
                                                    <span className="ml-1">{getSortIndicator("productid")}</span>
                                                </div>
                                            </th>
                                            {/* <th
                                                className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                                onClick={() => handleSort("size")}
                                            >
                                                <div className="flex items-center">
                                                    Size
                                                    <span className="ml-1">{getSortIndicator("size")}</span>
                                                </div>
                                            </th> */}
                                            <th
                                                className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                                onClick={() => handleSort("createdAt")}
                                            >
                                                <div className="flex items-center">
                                                    Uploaded
                                                    <span className="ml-1">{getSortIndicator("createdAt")}</span>
                                                </div>
                                            </th>
                                            <th className="p-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredVideos.length > 0 ? (
                                            filteredVideos.map((video) => (
                                                video && (
                                                    <tr key={video._id} className="hover:bg-gray-50 transition-colors group">
                                                        <td className="p-4">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 relative">
                                                                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center group-hover:shadow-md transition-shadow">
                                                                        {/* <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                                                                            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                            </svg>
                                                                        </div> */}
                                                            
                                                                        <VideoDuration src={video.videourl} />
                                                                        
                                                                        
                                                                    </div>
                                                                </div>
                                                                <div className="ml-4">
                                                                    {/* <div className="text-sm font-medium text-gray-900 line-clamp-1">{video.title || "Untitled Video"}</div> */}
                                                                    <div className="text-sm text-gray-500 mt-1">
                                                                        {video.order !== undefined ? `Order: ${video.order}` : ""}
                                                                    </div>
                                                                    {/* <div className="text-xs text-gray-400 mt-1 capitalize">
                                                                        {video.videoPath?.split('.').pop() || ''} format
                                                                    </div> */}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        {/* <td className="p-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {getProductName(
                                                                    typeof video.productid === "object" ? video.productid._id : video.productid
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                Product ID:{" "}
                                                                {(
                                                                    typeof video.productid === "object"
                                                                        ? video.productid._id
                                                                        : video.productid
                                                                )?.substring(0, 8)}
                                                                ...
                                                            </div>
                                                        </td> */}
                                                        <td className="p-4">
    <div className="text-sm font-medium text-gray-900">
        {getProductName(video.productid)}
    </div>
    <div className="text-xs text-gray-500 mt-1">
        Product ID:{" "}
        {(() => {
            const prodId = video.productid && typeof video.productid === "object"
                ? video.productid._id
                : video.productid;
            return prodId ? prodId.substring(0, 8) + "..." : "N/A";
        })()}
    </div>
</td>

                                                        {/* <td className="p-4">
                                                            <div className="text-sm font-medium text-gray-900">{formatFileSize(video.size)}</div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {video.resolution || 'N/A'}
                                                            </div>
                                                        </td> */}
                                                        <td className="p-4">
                                                            <div className="text-sm text-gray-900">
                                                                {formatDate(video.createdAt)}
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {video.createdAt ? new Date(video.createdAt).toLocaleTimeString() : 'N/A'}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <div className="flex justify-end space-x-2">
                                                                <a
                                                                    href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${video.videourl}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-md p-2 transition-colors"
                                                                    title="View video"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                    </svg>
                                                                </a>
                                                                {/* <a
                                                                    href={`/addvideo/${video._id}`}
                                                                    className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 rounded-md p-2 transition-colors"
                                                                    title="Edit video"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                </a> */}
                                                                <button
                                                                    onClick={() => handleDelete(video._id, video.title || "this video")}
                                                                    className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-md p-2 transition-colors"
                                                                    title="Delete video"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="text-center p-8 text-gray-500"
                                                >
                                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <p className="mt-4 text-lg font-medium">No videos found</p>
                                                    <p className="mt-2 text-sm">Try adjusting your search or upload a new video.</p>
                                                    <a
                                                        href="/addvideo"
                                                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                        Upload Video
                                                    </a>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};