import AbandonedCart from "../models/abandonedcartModel.js";
import Product from "../models/productModel.js";
import User from "../models/authModel.js";
import crypto from "crypto";
import mongoose from "mongoose";


export const syncCart = async (req, res) => {
  try {
    const { userId, cartItems } = req.body;

    if (!userId || !Array.isArray(cartItems)) {
      return res.status(400).json({ message: "userId and cartItems are required" });
    }

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const itemsWithSnapshot = [];

    for (const item of cartItems) {
      const productId = item._id || item.productId;
      if (!productId || !mongoose.Types.ObjectId.isValid(productId)) continue;

      const product = await Product.findById(productId).lean();
      if (!product || product.status !== "active") continue;

      // Find the matching variant (by color or colorcode)
      const selectedVariant = product.variant.find(
        (v) =>
          v.color === item.color ||
          v.colorcode === item.colorcode
      );

      // Use the variant data (or fallback to product-level)
      const variantData = selectedVariant || {};
      const variantImage = variantData.image || product.thumbImg;
      const price = variantData.discountPrice ?? variantData.price ?? item.price;
      const originalPrice = variantData.price;

      // Build full image URL (prefix with backend URL if relative)
      const imageUrl = variantImage
        ? (variantImage.startsWith("http")
            ? variantImage
            : `${process.env.BACKEND_URL || ""}${variantImage}`)
        : "/placeholder.png";

      itemsWithSnapshot.push({
        productId: product._id,
        name: product.name,
        slug: product.slug,
        quantity: item.quantity,
        priceSnapshot: price,
        originalPrice: originalPrice || item.originalPrice,
        image: imageUrl,
        variant: {
          color: variantData.color || item.color || "",
          colorcode: variantData.colorcode || item.colorcode || "",
          image: imageUrl,
        },
        productUpdatedAt: product.updatedAt,
      });
    }

    if (itemsWithSnapshot.length === 0) {
      await AbandonedCart.deleteOne({ userId });
      return res.json({ message: "Cart is empty, abandoned cart removed" });
    }

    // Fetch user to get email and phone
const user = await User.findById(userId).lean();
const email = user?.email || null;
const phoneNumber = user?.number || null;   // your User model uses 'number' for phone


    const abandonedCart = await AbandonedCart.findOneAndUpdate(
      { userId },
      {
        userId,
           email,                // ← add this
    phoneNumber,          // ← add this
        items: itemsWithSnapshot,
        lastActivity: new Date(),
        isRestored: false,
        restoreToken: null,
        restoreTokenExpiry: null,
        reminderCount: 0,                // reset
        lastReminderSentAt: null,
       },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ message: "Cart synced", abandonedCart });
  } catch (error) {
    console.error("Error syncing cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// to generate link 

export const prepareRestoreLink = async (cart) => {
  const token = crypto.randomBytes(32).toString("hex");
  cart.restoreToken = token;
  cart.restoreTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await cart.save();
  const restoreUrl = `${process.env.FRONTEND_URL}/frontend/cart/restore?token=${token}`;
  return restoreUrl;
};




export const restoreCart = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: "Token required" });

    const cart = await AbandonedCart.findOne({
      restoreToken: token,
      restoreTokenExpiry: { $gt: new Date() },
      isRestored: false,
    }).populate("items.productId");

    if (!cart) return res.status(404).json({ message: "Invalid or expired restore link" });

    cart.isRestored = true;
    cart.restoreToken = null;
    cart.restoreTokenExpiry = null;
    await cart.save();

    const restoredItems = cart.items.map((item) => {
      const product = item.productId;
      const variant = {
        color: item.variant?.color || "",
        colorcode: item.variant?.colorcode || "",
        image: item.variant?.image || product?.thumbImg || "",
        price: item.originalPrice || product?.variant?.[0]?.price,
        discountPrice: item.priceSnapshot,
        stock: product?.stock ?? 999,
      };

      return {
        product: {
          _id: product._id,
          slug: product.slug,
          name: product.name,
          thumbImg: product.thumbImg,
        },
        variant,
        quantity: item.quantity,
      };
    });

    res.json({ message: "Cart restored", items: restoredItems });
  } catch (error) {
    console.error("Error restoring cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};