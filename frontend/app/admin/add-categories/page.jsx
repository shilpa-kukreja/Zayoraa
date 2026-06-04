"use client";

// import React, { useEffect, useState } from "react";
import { useState, useRef, useEffect, Suspense } from "react";
import AdminLayout from "../components/AdminLayout";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  FiArrowLeft,
  FiSave,
  FiEdit3,
  FiUpload,
  FiImage,
  FiType,
} from "react-icons/fi";

const AddCategoryPageContent= () => {

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    img: "",
    banner: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
  });
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [touched, setTouched] = useState({
    name: false,
    slug: false,
    img: false,
    banner: false,
    description: false,
  });
  const [previewImages, setPreviewImages] = useState({
    img: null,
    banner: null,
  });
  const [imageUploading, setImageUploading] = useState({
    img: false,
    banner: false,
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("id");
  console.log("Editing category id:", categoryId);

  // Fetch category if in edit mode
  useEffect(() => {
    const fetchCategory = async () => {
      if (categoryId) {
        try {
          setLoading(true);

          // agar tumhare backend route query use karta hai
          // const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/get-category-by-id?id=${categoryId}`);

          // agar tumhare backend route params use karta hai
          const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/${categoryId}`);

          console.log("API Response:", res.data);

          // ✅ handle dono cases
          const cat = res.data.category || res.data;

          if (cat) {
            setEditingCategory(cat);
            setFormData({
              name: cat.name || "",
              slug: cat.slug || "",
              description: cat.description || "",
              metaTitle: cat.metaTitle || "",
              metaDescription: cat.metaDescription || "",
              // DB ke liye sirf path save hoga
              img: cat?.img ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${cat.img}` : "",
              banner: cat?.banner ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${cat.banner}` : ""
            });

            // setPreview({
            //   img: cat?.img ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${cat.img}` : "",
            //   banner: cat?.banner ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${cat.banner}` : ""
            // });

          } else {
            toast.error("Category not found");
          }
        } catch (err) {
          console.error(err);
          toast.error("Failed to fetch category details");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCategory();
  }, [categoryId]);



  // Handle change for text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });

    if (name === "name") {
      const generatedSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

      setFormData((prev) => ({ ...prev, name: value, slug: generatedSlug }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle image upload with preview
  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, [field]: file })); // File object for upload
    setPreviewImages((prev) => ({
      ...prev,
      [field]: URL.createObjectURL(file), // Preview URL
    }));
  };

  // Handle blur for validation
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) formDataToSend.append(key, value);
    });

    try {
      if (editingCategory) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/${editingCategory._id}`,
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Category Updated Successfully!");
        router.push("/admin/list-categories");
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/create`,
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Category Added Successfully!");
        router.push("/admin/list-categories");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const isNameError = touched.name && !formData.name;
  const isSlugError = touched.slug && !formData.slug;
  const isImgError = touched.img && !formData.img;
  const isBannerError = touched.banner && !formData.banner;
  const isDescriptionError = touched.description && !formData.description;

  return (
    <AdminLayout>
      <div className="w-full mx-auto p-6">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mr-4"
          >
            <FiArrowLeft className="mr-2" /> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Form header */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              {editingCategory ? (
                <>
                  <FiEdit3 className="mr-2 text-blue-600" /> Edit Category
                </>
              ) : (
                "Category Information"
              )}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {editingCategory
                ? "Update your category details below"
                : "Fill in the details to create a new category"}
            </p>
          </div>

          {/* Form content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., Electronics, Clothing"
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isNameError
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                      }`}
                    disabled={loading}
                  />
                  {isNameError && (
                    <p className="mt-1 text-sm text-red-600">
                      Category name is required
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="slug"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Slug (URL Friendly) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    id="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., electronics, clothing"
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isSlugError
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                      }`}
                    disabled={loading}
                  />
                  {isSlugError && (
                    <p className="mt-1 text-sm text-red-600">
                      Slug is required
                    </p>
                  )}
                </div>
              </div>

              {/* Image Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Image <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <label
                      className={`relative flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${isImgError
                        ? "border-red-500"
                        : "border-gray-300 hover:border-blue-500"
                        } ${imageUploading.img ? "opacity-50" : ""}`}
                    >
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => handleImageUpload(e, "img")}
                        accept="image/*"
                        disabled={imageUploading.img || loading}
                      />

                      {previewImages?.img ? (
                        <img
                          src={previewImages.img}
                          alt="Category Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : formData.img && typeof formData.img === "string" ? (
                        <img
                          src={formData.img}
                          alt="Category"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-4">
                          <FiImage className="text-gray-400 text-2xl mb-2" />
                          <span className="text-xs text-gray-500 text-center">
                            {imageUploading.img
                              ? "Uploading..."
                              : "Upload Image"}
                          </span>
                        </div>
                      )}
                    </label>

                    {(previewImages?.img || formData.img) && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, img: "" }));
                          setPreviewImages((prev) => ({ ...prev, img: null }));
                        }}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {isImgError && (
                    <p className="mt-1 text-sm text-red-600">
                      Category image is required
                    </p>
                  )}
                </div>

                {/* Banner Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Image <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <label
                      className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${isBannerError
                        ? "border-red-500"
                        : "border-gray-300 hover:border-blue-500"
                        } ${imageUploading.banner ? "opacity-50" : ""}`}
                    >
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => handleImageUpload(e, "banner")}
                        accept="image/*"
                        disabled={imageUploading.banner || loading}
                      />

                      {previewImages?.banner ? (
                        <img
                          src={previewImages.banner}
                          alt="Banner Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : formData.banner &&
                        typeof formData.banner === "string" ? (
                        <img
                          src={formData.banner}
                          alt="Banner"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-4">
                          <FiImage className="text-gray-400 text-2xl mb-2" />
                          <span className="text-xs text-gray-500 text-center">
                            {imageUploading.banner
                              ? "Uploading..."
                              : "Upload Banner Image"}
                          </span>
                        </div>
                      )}
                    </label>

                    {(previewImages?.banner || formData.banner) && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, banner: "" }));
                          setPreviewImages((prev) => ({
                            ...prev,
                            banner: null,
                          }));
                        }}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {isBannerError && (
                    <p className="mt-1 text-sm text-red-600">
                      Banner image is required
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                  placeholder="Enter a detailed description of this category..."
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDescriptionError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                    }`}
                  disabled={loading}
                />
                {isDescriptionError && (
                  <p className="mt-1 text-sm text-red-600">
                    Description is required
                  </p>
                )}
              </div>

              {/* SEO Section */}
              <div className="border-t pt-6 mt-6 border-gray-100">
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <FiType className="mr-2 text-blue-500" /> SEO Settings
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label
                      htmlFor="metaTitle"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Meta Title
                    </label>
                    <input
                      type="text"
                      name="metaTitle"
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleChange}
                      placeholder="Meta title for SEO (optional)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="metaDescription"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Meta Description
                    </label>
                    <textarea
                      name="metaDescription"
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Meta description for SEO (optional)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => router.push("/admin/categories")}
                  className="px-6 py-2.5 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    loading || imageUploading.img || imageUploading.banner
                  }
                  className="flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {editingCategory ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      {editingCategory ? "Update Category" : "Add Category"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};


const AddCategoryPage = () => (
  <Suspense
    fallback={
      <AdminLayout>
        <div className="max-w-7xl mx-auto p-6 flex items-center justify-center min-h-[40vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto" />
            <p className="mt-3 text-gray-600">Loading...</p>
          </div>
        </div>
      </AdminLayout>
    }
  >
    <AddCategoryPageContent />
  </Suspense>
);

export default AddCategoryPage;





