import categoryModel from "../models/categoryModel.js";
import { deleteUploadFile } from "../utils/fileUtils.js";

// Create Category with image upload
export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, metaTitle, metaDescription, order } = req.body; // added order

    if (!name || !slug || !description) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const img = req.files?.img?.[0]?.filename;
    const banner = req.files?.banner?.[0]?.filename;

    if (!img || !banner) {
      return res.status(400).json({ success: false, message: "Both img and banner are required" });
    }

    const category = await categoryModel.create({
      name,
      slug,
      description,
      img: `/uploads/categories/${img}`,
      banner: `/uploads/categories/${banner}`,
      metaTitle,
      metaDescription,
      order: order || 0,   // use provided order or default 0
    });

    res.status(201).json({ success: true, message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating category", error: error.message });
  }
};

// Get All Categories
export const getCategories = async (req, res) => {
  try {
    // Sort by order ascending (lower number first)
    const categories = await categoryModel.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching categories", error: error.message });
  }
};

export const getCategoryByid = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);
    console.log(category);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json(category); // direct category bhej do
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching category", error: error.message });
  }
};



// Update Category with optional image update
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };  // includes order if sent
    const oldCategory = await categoryModel.findById(id);

    if (!oldCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (req.files?.img) {
      updateData.img = `/uploads/categories/${req.files.img[0].filename}`;
    }
    if (req.files?.banner) {
      updateData.banner = `/uploads/categories/${req.files.banner[0].filename}`;
    }

    const updatedCategory = await categoryModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    // Remove old images if replaced
    if (req.files?.img && oldCategory.img && oldCategory.img !== updatedCategory.img) {
      await deleteUploadFile(oldCategory.img);
    }
    if (req.files?.banner && oldCategory.banner && oldCategory.banner !== updatedCategory.banner) {
      await deleteUploadFile(oldCategory.banner);
    }

    res.status(200).json({ success: true, message: "Category updated successfully", category: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating category", error: error.message });
  }
};



// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await categoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (deletedCategory.img) await deleteUploadFile(deletedCategory.img);
    if (deletedCategory.banner) await deleteUploadFile(deletedCategory.banner);

    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting category", error: error.message });
  }
};





  

