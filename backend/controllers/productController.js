import productModel from "../models/productModel.js";
import mongoose from "mongoose";
import {
  collectProductImages,
  deleteUploadFiles,
  diffRemovedFiles,
} from "../utils/fileUtils.js";

// ✅ Create Product

function groupFilesByField(files) {
  // multer: .fields() => object, .any() => array
  if (!files) return {};
  if (Array.isArray(files)) {
    return files.reduce((acc, f) => {
      (acc[f.fieldname] ||= []).push(f);
      return acc;
    }, {});
  }
  return files;
}

export const createProduct = async (req, res) => {
  try {
    const {
      name, slug, shortDescription, description,
      stock, category, subcategory,
      sku, status, width, height, weight, length,
      metatitle, metadescription, products
    } = req.body;

    // handle uploaded images
    const filesByField = groupFilesByField(req.files);
    const thumbImg = filesByField?.thumbImg?.[0]?.filename || null;
    const galleryImg = filesByField?.galleryImg?.map(file => file.filename) || [];

    // handle variants + variant images (variantImg_<index>)
    const parsedVariant = req.body.variant ? JSON.parse(req.body.variant) : [];
    const variant = Array.isArray(parsedVariant) ? parsedVariant : [];
    for (let i = 0; i < variant.length; i++) {
      const f = filesByField?.[`variantImg_${i}`]?.[0];
      if (f?.filename) {
        variant[i] = { ...variant[i], image: `/uploads/products/${f.filename}` };
      }
    }

    const product = await productModel.create({
      name,
      products: products ? JSON.parse(products) : [],
      slug,
      shortDescription,
      description,
      thumbImg: thumbImg ? `/uploads/products/${thumbImg}` : null,
      galleryImg: galleryImg.map(img => `/uploads/products/${img}`),
      stock,
      category: category ? JSON.parse(category).map(id => new mongoose.Types.ObjectId(id)) : [],
      subcategory: subcategory ? subcategory.split(",") : [],
      sku,
      status,
      width,
      height,
      weight,
      length,
      metatitle,
      metadescription,
      section: req.body.section ? JSON.parse(req.body.section) : [],
      variant

    });

    console.log("Created Product:", product);

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await productModel.find()
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Single Product
export const getProductById = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id)
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Product
// export const updateProduct = async (req, res) => {
//   try {
//     const updates = req.body;

//     if (req.files?.thumbImg) {
//       updates.thumbImg = `/uploads/products/${req.files.thumbImg[0].filename}`;
//     }

//     if (req.files?.galleryImg) {
//       updates.galleryImg = req.files.galleryImg.map(file => `/uploads/products/${file.filename}`);
//     }

//     if (updates.section && typeof updates.section === "string") {
//       updates.section = JSON.parse(updates.section);
//     }
//     console.log("Category before processing:", updates.category);
//     if (updates.category && typeof updates.category === "string") {
//       updates.category = JSON.parse(updates.category);
//     }

//     console.log("Subcategory before processing:", updates.subcategory);

//          if (updates.subcategory && typeof updates.subcategory === "string") {
//             updates.subcategory = JSON.parse(updates.subcategory);

//           }else{
//             updates.subcategory = [];
//           }





//     if (updates.variant && typeof updates.variant === "string") {
//       updates.variant = JSON.parse(updates.variant);
//     }

//     console.log("Updates to be applied:", updates);
//     console.log("Product ID:", req.params.id);


//     const product = await productModel.findByIdAndUpdate(req.params.id, updates, { new: true });
//     console.log("Updated Product:", product);
//     if (!product) return res.status(404).json({ success: false, message: "Product not found" });

//     res.json({ success: true, product });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// ✅ Update Product
export const updateProduct = async (req, res) => {
  try {
    const updates = { ...req.body };
    const filesByField = groupFilesByField(req.files);
    const oldProduct = await productModel.findById(req.params.id);

    if (!oldProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const filesToDelete = [];

    // ✅ Handle Thumbnail Image
    if (filesByField?.thumbImg?.length > 0) {
      updates.thumbImg = `/uploads/products/${filesByField.thumbImg[0].filename}`;
      if (oldProduct.thumbImg && oldProduct.thumbImg !== updates.thumbImg) {
        filesToDelete.push(oldProduct.thumbImg);
      }
    } else {
      updates.thumbImg = oldProduct.thumbImg;
    }

    // ✅ Handle Gallery Images (retain existing + append new uploads)
    let retainedGallery = oldProduct.galleryImg || [];
    if (updates.galleryImg !== undefined) {
      if (typeof updates.galleryImg === "string") {
        try {
          retainedGallery = JSON.parse(updates.galleryImg);
        } catch {
          retainedGallery = oldProduct.galleryImg || [];
        }
      } else if (Array.isArray(updates.galleryImg)) {
        retainedGallery = updates.galleryImg;
      }
    }

    if (filesByField?.galleryImg?.length > 0) {
      const newGalleryPaths = filesByField.galleryImg.map(
        (file) => `/uploads/products/${file.filename}`
      );
      updates.galleryImg = [...retainedGallery, ...newGalleryPaths];
    } else {
      updates.galleryImg = retainedGallery;
    }

    filesToDelete.push(
      ...diffRemovedFiles(oldProduct.galleryImg || [], updates.galleryImg || [])
    );

    // ✅ Handle variant
    if (updates.variant && typeof updates.variant === "string") {
      try {
        updates.variant = JSON.parse(updates.variant);
      } catch {
        updates.variant = [];
      }
    }

    // ✅ Handle products
    if (updates.products && typeof updates.products === "string") {
      try {
        updates.products = JSON.parse(updates.products);
      } catch {
        updates.products = [];
      }
    }

    if (!Array.isArray(updates.variant)) {
      updates.variant = [];
    }

    // ✅ Map variant images coming as variantImg_<index>
    for (let i = 0; i < updates.variant.length; i++) {
      const f = filesByField?.[`variantImg_${i}`]?.[0];
      if (f?.filename) {
        const newImage = `/uploads/products/${f.filename}`;
        const oldImage = oldProduct.variant?.[i]?.image;
        if (oldImage && oldImage !== newImage) {
          filesToDelete.push(oldImage);
        }
        updates.variant[i] = { ...updates.variant[i], image: newImage };
      } else if (!updates.variant[i]?.image && oldProduct?.variant?.[i]?.image) {
        updates.variant[i] = { ...updates.variant[i], image: oldProduct.variant[i].image };
      }
    }

    // Remove images from deleted variants
    if ((oldProduct.variant || []).length > updates.variant.length) {
      for (let i = updates.variant.length; i < oldProduct.variant.length; i++) {
        if (oldProduct.variant[i]?.image) {
          filesToDelete.push(oldProduct.variant[i].image);
        }
      }
    }

    // ✅ Handle JSON fields (convert strings to objects/arrays if needed)
    if (updates.section && typeof updates.section === "string") {
      updates.section = JSON.parse(updates.section);
    }

    if (updates.category && typeof updates.category === "string") {
      updates.category = JSON.parse(updates.category).map((id) => new mongoose.Types.ObjectId(id));
    }

    // ✅ Handle subcategory
    if (updates.subcategory && typeof updates.subcategory === "string") {
      try {
        updates.subcategory = JSON.parse(updates.subcategory);
      } catch {
        updates.subcategory = updates.subcategory.split(",");
      }
    }

    // ✅ Force empty array if no valid subcategories
    if (
      !updates.subcategory ||
      (Array.isArray(updates.subcategory) &&
        updates.subcategory.every((sc) => !sc || sc.trim() === ""))
    ) {
      updates.subcategory = [];
    }

    const product = await productModel.findByIdAndUpdate(req.params.id, updates, { new: true });

    await deleteUploadFiles(filesToDelete);

    res.json({ success: true, product });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    await deleteUploadFiles(collectProductImages(product));

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


