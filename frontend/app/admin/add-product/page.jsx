"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import AdminLayout from "../components/AdminLayout";
import dynamic from 'next/dynamic';
import Select from "react-select";

const CKEditor = dynamic(() => import('@ckeditor/ckeditor5-react').then(mod => mod.CKEditor), {
    ssr: false,
    loading: () => <p>Loading editor...</p>
});

// Import the editor build directly (not as dynamic)
let ClassicEditor;
if (typeof window !== 'undefined') {
    ClassicEditor = require('@ckeditor/ckeditor5-build-classic');
}


const AddProductContent= ()=> {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const isEditMode = Boolean(id);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        shortDescription: "",
        description: "",
        thumbImg: "",
        galleryImg: [],
        products: [],
        stock: 0,
        category: [],
        // subcategory: [],
        sku: "",
        variant: [{ color: "", colorcode: "#000000", image: "", price: 0, discountPrice: 0, stock: 0 }],
        status: "active",
        width: "",
        height: "",
        weight: "",
        length: "",
        section: [],
        metatitle: "",
        metadescription: "",
    });

    const [thumbImg, setThumbImg] = useState(null);
    const [thumbImgPreview, setThumbImgPreview] = useState("");
    const [galleryImgs, setGalleryImgs] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [variantImgs, setVariantImgs] = useState([]); // File|null by index
    const [variantImgPreviews, setVariantImgPreviews] = useState([]); // url by index
    const [categories, setCategories] = useState([]);
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [activeTab, setActiveTab] = useState("basic");
    const [products, setproducts] = useState([]);


    useEffect(() => {
        fetchCategories();
        fetchproducts();   // ✅ call here
        if (id) {
            fetchProductDetails();
        }
    }, [id]);


    // Build options for react-select
    const productOptions = products.map((p) => ({
        value: p._id,
        label: p.name,
    }));


    const removeProduct = (productId) => {
        setFormData((prev) => ({
            ...prev,
            products: prev.products.filter((id) => id !== productId),
        }));
    };

    const clearAll = () => {
        setFormData((prev) => ({
            ...prev,
            products: [],
        }));
    };



    // Handlers
    const handleChangeproducts = (selectedOptions) => {
        setFormData((prev) => ({
            ...prev,
            products: selectedOptions.map((opt) => opt.value),
        }));
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/get`);
            setCategories(res.data.categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load categories");
        }
    };




    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${id}`);
            if (response.data.success) {
                const product = response.data.product;

                setFormData({
                    name: product.name || "",
                    slug: product.slug || "",
                    shortDescription: product.shortDescription || "",
                    description: product.description || "",
                    thumbImg: product.thumbImg || "",
                    products: product.products || [],
                    galleryImg: product.galleryImg || [],
                    stock: product.stock || 0,
                    category: product.category || [],

                    sku: product.sku || "",
                    variant: product.variant && product.variant.length > 0 ? product.variant : [{ color: "", colorcode: "#000000", image: "", price: 0, discountPrice: 0, stock: 0 }],
                    status: product.status || "active",
                    width: product.width || "",
                    height: product.height || "",
                    weight: product.weight || "",
                    length: product.length || "",
                    section: product.section || [],
                    metatitle: product.metatitle || "",
                    metadescription: product.metadescription || "",
                    // subcategory: product.subcategory || "subcategory",
                });

                if (product.thumbImg) {
                    setThumbImgPreview(`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.thumbImg}`);
                }

                if (product.galleryImg?.length > 0) {
                    const galleryUrls = product.galleryImg.map(img =>
                        typeof img === 'string' ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${img}` : img
                    );
                    setGalleryPreviews(galleryUrls);
                }

                // variant image previews (edit mode)
                const vPreviews = (product.variant || []).map(v =>
                    v?.image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${v.image}` : ""
                );
                setVariantImgPreviews(vPreviews);
                setVariantImgs(new Array((product.variant || []).length).fill(null));

            } else {
                toast.error("❌ Failed to load product.");
            }
        } catch (err) {
            console.error(err);
            toast.error("❌ Error fetching product.");
        } finally {
            setLoading(false);
        }
    };

    const fetchproducts = async (selectedProducts = []) => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/get`);
            setproducts(res.data.products);
            // If selectedProducts are provided (for edit mode), ensure they're in the options
            if (selectedProducts.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    products: selectedProducts.filter(productId =>
                        res.data.products.some(p => p._id === productId)
                    )
                }));
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
        }
    };


    const generateSlug = (text) =>
        text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");


    const handleChange = (e) => {
        const { name, value, multiple, options } = e.target;

        if (name === "name") {
            const slug = generateSlug(value);
            setFormData((prev) => ({
                ...prev,
                name: value,
                slug: slug,
            }));
        } else if (name === "category" && multiple) {
            // Collect all selected values as an array
            const selectedValues = Array.from(options)
                .filter((opt) => opt.selected)
                .map((opt) => opt.value);

            setFormData((prev) => ({
                ...prev,
                category: selectedValues,
                // subcategory: "", // reset subcategory when category changes
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };




    // Update the editor change handler
    const handleEditorChange = (event, editor, field) => {
        const data = editor.getData();
        setFormData(prev => ({
            ...prev,
            [field]: data
        }));
    };

    const handleVariantChange = (e, index, key) => {
        const newVariants = [...formData.variant];
        newVariants[index] = {
            ...newVariants[index],
            [key]: key.includes("price") || key.includes("stock") || key.includes("discountPrice") ?
                parseFloat(e.target.value) : e.target.value,
        };
        console.log(newVariants);
        setFormData((prev) => ({ ...prev, variant: newVariants }));
    };



    const addVariantField = () => {
        setFormData((prev) => ({
            ...prev,
            variant: [...prev.variant, {
                color: "",
                colorcode: "#000000",
                image: "",
                price: 0,
                discountPrice: 0,
                stock: 0
            }],
        }));
        setVariantImgs((prev) => [...prev, null]);
        setVariantImgPreviews((prev) => [...prev, ""]);
    };
    console.log(formData.variant);
    const removeVariantField = (index) => {
        const newVariants = [...formData.variant];
        newVariants.splice(index, 1);
        setFormData((prev) => ({ ...prev, variant: newVariants }));

        setVariantImgs((prev) => {
            const next = [...prev];
            next.splice(index, 1);
            return next;
        });
        setVariantImgPreviews((prev) => {
            const next = [...prev];
            next.splice(index, 1);
            return next;
        });
    };

    const handleVariantImgChange = (e, index) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setVariantImgs((prev) => {
            const next = [...prev];
            next[index] = file;
            return next;
        });
        setVariantImgPreviews((prev) => {
            const next = [...prev];
            next[index] = URL.createObjectURL(file);
            return next;
        });
    };

    const handleThumbImgChange = (e) => {
        if (e.target.files[0]) {
            setThumbImg(e.target.files[0]);
            setThumbImgPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleGalleryImgsChange = (e) => {
        if (e.target.files.length > 0) {
            const newGalleryImgs = Array.from(e.target.files);
            setGalleryImgs([...galleryImgs, ...newGalleryImgs]);

            const newPreviews = newGalleryImgs.map(file => URL.createObjectURL(file));
            setGalleryPreviews([...galleryPreviews, ...newPreviews]);
        }
    };

    const removeGalleryImg = (index) => {
        const existingCount = galleryPreviews.length - galleryImgs.length;
        const newPreviews = [...galleryPreviews];
        newPreviews.splice(index, 1);
        setGalleryPreviews(newPreviews);

        if (index >= existingCount) {
            const newGalleryImgs = [...galleryImgs];
            newGalleryImgs.splice(index - existingCount, 1);
            setGalleryImgs(newGalleryImgs);
        } else {
            const newGallery = [...formData.galleryImg];
            newGallery.splice(index, 1);
            setFormData((prev) => ({ ...prev, galleryImg: newGallery }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            const payload = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    payload.append(key, JSON.stringify(value));
                } else {
                    payload.append(key, value);
                }
            });

            if (thumbImg) payload.append("thumbImg", thumbImg);
            galleryImgs.forEach((img) => payload.append("galleryImg", img));
            variantImgs.forEach((file, index) => {
                if (file) payload.append(`variantImg_${index}`, file);
            });

            let response;
            if (isEditMode) {
                response = await axios.put(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${id}`,
                    payload,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
            } else {
                response = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/create`,
                    payload,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
            }

            if (response.data.success) {
                toast.success(`🎉 Product ${isEditMode ? 'updated' : 'added'} successfully!`);
                router.push("/admin/list-product");
            } else {
                throw new Error(response.data.message || "Operation failed");
            }
        } catch (error) {
            setErrorMsg(
                error.response?.data?.message ||
                `Failed to ${isEditMode ? 'update' : 'add'} product. Please check your inputs and try again.`
            );
            console.error(`Error ${isEditMode ? 'updating' : 'adding'} product:`, error);
            toast.error(`❌ Failed to ${isEditMode ? 'update' : 'add'} product`);
        } finally {
            setLoading(false);
        }
    };

    // Tab navigation component
    const TabButton = ({ name, label }) => (
        <button
            type="button"
            onClick={() => setActiveTab(name)}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${activeTab === name
                ? "bg-white text-indigo-600 border-t border-l border-r border-gray-300"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
        >
            {label}
        </button>
    );

    return (
        <AdminLayout>
            <div className="w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <h2 className="text-2xl font-bold">
                        {isEditMode ? "Edit Product" : "Add New Product"}
                    </h2>
                    <p className="text-indigo-100 mt-1">
                        {isEditMode ? "Update product details" : "Create a new product listing"}
                    </p>
                </div>

                {errorMsg && (
                    <div className="m-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
                        <p>{errorMsg}</p>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="border-b border-gray-200 px-6 pt-4">
                    <nav className="flex space-x-1">
                        <TabButton name="basic" label="Basic Info" />
                        <TabButton name="description" label="Description" />
                        <TabButton name="categories" label="Categories" />
                        <TabButton name="pricing" label="Pricing & Inventory" />
                        <TabButton name="dimensions" label="Dimensions" />
                        <TabButton name="seo" label="SEO" />
                        <TabButton name="images" label="Images" />

                    </nav>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {/* Basic Information Tab */}
                    {activeTab === "basic" && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter product name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Slug *</label>
                                    <input
                                        name="slug"
                                        value={formData.slug}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        onChange={handleChange}
                                        required
                                        placeholder="product-slug"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">SKU *</label>
                                    <input
                                        name="sku"
                                        value={formData.sku}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        onChange={handleChange}
                                        required
                                        placeholder="Product SKU"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Status *</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                {/* <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Sections</label>
                                    <select
                                        name="section"
                                        value={formData.section}
                                        multiple
                                        onChange={(e) => {
                                            const options = Array.from(e.target.selectedOptions, option => option.value);
                                            setFormData(prev => ({ ...prev, section: options })); // ✅ fixed
                                        }}
                                    >

                                        <option value="newarrival">New Arrivals</option>
                                        <option value="bestseller">Best Sellers</option>
                                        <option value="featuredcollection">FeaturedCollection</option>
                                        <option value="holidaycollection">HolidayCollection</option>
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">Hold down the Ctrl (windows) or Command (Mac) button to select multiple options.</p>

                                </div> */}

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Sections</label>
                                    <Select
                                        isMulti
                                        name="sections"
                                        options={[
                                            { value: "newarrival", label: "New Arrivals" },
                                            { value: "bestseller", label: "Best Sellers" },
                                            { value: "featuredcollection", label: "Featured Collection" },
                                            { value: "holidaycollection", label: "Holiday Collection" },
                                        ]}
                                        placeholder="Click to select sections..."
                                        value={(formData.section || []).map((sec) => ({
                                            value: sec,
                                            label:
                                                sec === "newarrival"
                                                    ? "New Arrivals"
                                                    : sec === "bestseller"
                                                        ? "Best Sellers"
                                                        : sec === "featuredcollection"
                                                            ? "Featured Collection"
                                                            : "Holiday Collection",
                                        }))}
                                        onChange={(selectedOptions) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                section: selectedOptions.map((opt) => opt.value),
                                            }))
                                        }
                                        className="react-select-container"
                                        classNamePrefix="select"
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                borderRadius: "0.375rem",
                                                borderColor: "#D1D5DB",
                                                padding: "4px",
                                                boxShadow: "none",
                                                "&:hover": { borderColor: "#6366F1" },
                                            }),
                                        }}
                                    />

                                    <p className="text-xs text-gray-500 mt-1">
                                        {formData.section?.length > 0
                                            ? `${formData.section.length} selected`
                                            : "Click to select one or more sections"}
                                    </p>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* Description Tab */}
                    {activeTab === "description" && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Product Descriptions</h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Short Description</label>
                                    {typeof window !== 'undefined' && ClassicEditor && (
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={formData.shortDescription}
                                            onChange={(event, editor) => handleEditorChange(event, editor, "shortDescription")}
                                            config={{
                                                toolbar: ['bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'undo', 'redo', 'insertTable', 'mediaEmbed', 'heading', 'outdent', 'indent', 'codeBlock', 'code'],
                                                placeholder: "Brief product description shown in product listings..."
                                            }}
                                        />
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Detailed Description *</label>
                                    {typeof window !== 'undefined' && ClassicEditor && (
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={formData.description}
                                            onChange={(event, editor) => handleEditorChange(event, editor, "description")}

                                            config={{
                                                toolbar: [
                                                    , 'heading', '|', 'bold', 'italic', 'link', 'bulletedList',
                                                    'numberedList', 'blockQuote', 'insertTable', 'mediaEmbed',
                                                    'undo', 'redo', 'outdent', 'indent', 'codeBlock', 'code', 'subscript', 'superscript', 'fontColor', 'fontBackgroundColor', 'fontSize', 'fontFamily', 'removeFormat', 'specialCharacters', 'horizontalLine', 'pageBreak', 'findAndReplace', 'highlight',
                                                    'alignment', 'underline', 'strikethrough'
                                                ],
                                                placeholder: "Detailed product description with features, benefits, etc..."
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Categories Tab */}
                    {/* {activeTab === "categories" && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Category *</label>
                            <select
                                name="category"
                                multiple
                                value={formData.category}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                onChange={handleChange}
                                required
                            >
                                <option disabled value="">
                                    Select Category
                                </option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                    )} */}

                    {activeTab === "categories" && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Category *</label>
                            <Select
                                isMulti
                                name="category"
                                options={categories.map((cat) => ({
                                    value: cat._id,
                                    label: cat.name,
                                }))}
                                placeholder="Select Category"
                                value={categories
                                    .filter((cat) => formData.category.includes(cat._id))
                                    .map((cat) => ({ value: cat._id, label: cat.name }))}
                                onChange={(selectedOptions) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        category: selectedOptions.map((opt) => opt.value),
                                    }))
                                }
                                className="react-select-container"
                                classNamePrefix="select"
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderRadius: "0.375rem",
                                        borderColor: "#D1D5DB",
                                        padding: "4px",
                                        boxShadow: "none",
                                        "&:hover": { borderColor: "#6366F1" },
                                    }),
                                }}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.category?.length > 0
                                    ? `${formData.category.length} selected`
                                    : "Click to select one or more categories"}
                            </p>
                        </div>
                    )}


                    {/* Pricing & Inventory Tab */}
                    {activeTab === "pricing" && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Pricing & Inventory</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 p-6 pt-10">
                                    <label className="block text-sm font-medium text-gray-700">Stock Quantity *</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        min="0"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg ">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Products</h3>

                                    {/* Badges */}
                                    {formData.products.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {formData.products.map((productId) => {
                                                const product = products.find((p) => p._id === productId);
                                                return product ? (
                                                    <span
                                                        key={productId}
                                                        className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm"
                                                    >
                                                        {product.name}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeProduct(productId)}
                                                            className="ml-2 text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ) : null;
                                            })}
                                        </div>
                                    )}

                                    {/* Multi-select Dropdown */}
                                    <Select
                                        isMulti
                                        name="products"
                                        options={productOptions}
                                        placeholder="Click to select products..."
                                        value={productOptions.filter((opt) =>
                                            formData.products.includes(opt.value)
                                        )}
                                        onChange={handleChangeproducts}
                                        className="react-select-container"
                                        classNamePrefix="select"
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                borderRadius: "0.375rem",
                                                borderColor: "#D1D5DB",
                                                padding: "4px",
                                                boxShadow: "none",
                                                "&:hover": { borderColor: "#6366F1" },
                                            }),
                                        }}
                                    />

                                    {formData.products.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={clearAll}
                                            className="mt-2 text-sm text-indigo-600 hover:underline"
                                        >
                                            Clear All
                                        </button>
                                    )}

                                    <p className="text-xs text-gray-500 mt-2">
                                        {formData.products.length > 0
                                            ? `${formData.products.length} selected`
                                            : "Click to select one or more products"}
                                    </p>
                                </div>

                            </div>

                            <div className="mt-8 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-md font-medium text-gray-700">Product Variants</h4>
                                    <button
                                        type="button"
                                        onClick={addVariantField}
                                        className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add Variant
                                    </button>
                                </div>

                                {formData.variant.map((v, i) => (
                                    <div key={i} className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end p-4 border rounded-lg bg-gray-50">
                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">Color Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., Red, Blue"
                                                value={v.color}
                                                onChange={(e) => handleVariantChange(e, i, "color")}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">Color Code</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={v.colorcode}
                                                    onChange={(e) => handleVariantChange(e, i, "colorcode")}
                                                    className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={v.colorcode}
                                                    onChange={(e) => handleVariantChange(e, i, "colorcode")}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder="#000000"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                                            <input
                                                type="number"
                                                placeholder="Price"
                                                value={v.price}
                                                min="0"
                                                step="0.01"
                                                onChange={(e) => handleVariantChange(e, i, "price")}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">Discount ($)</label>
                                            <input
                                                type="number"
                                                placeholder="Discount Price"
                                                value={v.discountPrice}
                                                min="0"
                                                step="0.01"
                                                onChange={(e) => handleVariantChange(e, i, "discountPrice")}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">Stock</label>
                                            <input
                                                type="number"
                                                placeholder="Stock"
                                                value={v.stock}
                                                min="0"
                                                onChange={(e) => handleVariantChange(e, i, "stock")}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">Variant Image</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleVariantImgChange(e, i)}
                                                    className="w-full text-sm"
                                                />
                                                {(variantImgPreviews[i] || (v?.image && `${process.env.NEXT_PUBLIC_BACKEND_URL}${v.image}`)) && (
                                                    <img
                                                        src={variantImgPreviews[i] || `${process.env.NEXT_PUBLIC_BACKEND_URL}${v.image}`}
                                                        alt="Variant preview"
                                                        className="w-12 h-12 object-cover rounded border border-gray-200"
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeVariantField(i)}
                                            className="px-3 py-2 bg-red-100 text-red-600 text-sm rounded-md hover:bg-red-200 transition flex items-center justify-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Dimensions Tab */}
                    {activeTab === "dimensions" && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Product Dimensions</h3>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {["width", "height", "weight", "length"].map((field) => (
                                    <div key={field} className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 capitalize">
                                            {field} (cm)
                                        </label>
                                        <input
                                            type="number"
                                            name={field}
                                            value={formData[field]}
                                            step="0.01"
                                            min="0"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            onChange={handleChange}
                                            placeholder={`Enter ${field}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SEO Tab */}
                    {activeTab === "seo" && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">SEO Information</h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Meta Title</label>
                                    <input
                                        name="metatitle"
                                        value={formData.metatitle}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        onChange={handleChange}
                                        placeholder="Optimized title for search engines (50-60 characters)"
                                        maxLength="60"
                                    />
                                    <p className="text-xs text-gray-500">
                                        {formData.metatitle.length}/60 characters
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                                    <textarea
                                        name="metadescription"
                                        value={formData.metadescription}
                                        rows="3"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        onChange={handleChange}
                                        placeholder="Brief description for search results (150-160 characters)"
                                        maxLength="160"
                                    />
                                    <p className="text-xs text-gray-500">
                                        {formData.metadescription.length}/160 characters
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Images Tab */}
                    {activeTab === "images" && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Product Images</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Thumbnail Image Upload */}
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700">Thumbnail Image *</label>
                                    <div className="flex flex-col items-center space-y-4">
                                        {thumbImgPreview ? (
                                            <div className="relative group w-full">
                                                <img
                                                    src={thumbImgPreview}
                                                    alt="Thumbnail preview"
                                                    className="w-full h-64 object-contain rounded-lg border-2 border-dashed border-gray-300 p-1"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setThumbImg(null);
                                                        setThumbImgPreview("");
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all shadow-md"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:border-indigo-500 transition-colors p-6 text-center">
                                                <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                                <span className="text-sm text-gray-600">Click to upload thumbnail</span>
                                                <span className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (1:1 ratio recommended)</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleThumbImgChange}
                                                    className="hidden"
                                                    required={!isEditMode}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Gallery Images Upload */}
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700">Gallery Images</label>
                                    <div className="space-y-4">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:border-indigo-500 transition-colors p-4 text-center">
                                            <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                            </svg>
                                            <span className="text-sm text-gray-600">
                                                {galleryPreviews.length > 0
                                                    ? `Add more images (${galleryPreviews.length} selected)`
                                                    : "Click to upload gallery images"}
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleGalleryImgsChange}
                                                className="hidden"
                                            />
                                        </label>

                                        {galleryPreviews.length > 0 && (
                                            <div className="grid grid-cols-3 gap-3">
                                                {galleryPreviews.map((img, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={img}
                                                            alt={`Gallery preview ${index + 1}`}
                                                            className="w-full h-24 object-cover rounded border border-gray-200 shadow-sm"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeGalleryImg(index)}
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500">Additional product images for galleries (optional)</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation and Submit Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                        <div className="flex space-x-3">
                            {activeTab !== "basic" && (
                                <button
                                    type="button"
                                    onClick={() => setActiveTab(
                                        activeTab === "description" ? "basic" :
                                            activeTab === "categories" ? "description" :
                                                activeTab === "pricing" ? "categories" :
                                                    activeTab === "dimensions" ? "pricing" :
                                                        activeTab === "seo" ? "dimensions" : "seo"
                                    )}
                                    className="px-5 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Previous
                                </button>
                            )}

                            {activeTab !== "images" && (
                                <button
                                    type="button"
                                    onClick={() => setActiveTab(
                                        activeTab === "basic" ? "description" :
                                            activeTab === "description" ? "categories" :
                                                activeTab === "categories" ? "pricing" :
                                                    activeTab === "pricing" ? "dimensions" :
                                                        activeTab === "dimensions" ? "seo" : "images"
                                    )}
                                    className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center"
                                >
                                    Next
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor
">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors flex items-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {isEditMode ? "Updating..." : "Creating..."}
                                </>
                            ) : (
                                isEditMode ? "Update Product" : "Create Product"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>

    );
}


const  AddProduct = () => (
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
    < AddProductContent/>
  </Suspense>
);

export default  AddProduct;







