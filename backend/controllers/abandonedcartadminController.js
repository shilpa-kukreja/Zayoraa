import AbandonedCart from "../models/abandonedcartModel.js";
import User from "../models/authModel.js";
import Product from "../models/productModel.js";
import { prepareRestoreLink } from "../controllers/abandonedcartController.js"; // reuse the link generator
import { sendAbandonedCartEmail } from "../utils/mailer.js";

// ---------- 1. List all abandoned carts with pagination ----------
export const listCarts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const total = await AbandonedCart.countDocuments();
    const carts = await AbandonedCart.find()
      .sort({ lastActivity: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)

    res.json({
      data: carts,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Error listing abandoned carts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- 2. Get stats ----------
export const getStats = async (req, res) => {
  try {
    const totalCarts = await AbandonedCart.countDocuments();
    const activeCarts = await AbandonedCart.countDocuments({ isRestored: false });
    const restoredCarts = await AbandonedCart.countDocuments({ isRestored: true });

    // Potential revenue = sum of (priceSnapshot * quantity) for all un‑restored carts
    const activeCartsDocs = await AbandonedCart.find({ isRestored: false }).lean();
    const totalPotentialRevenue = activeCartsDocs.reduce((sum, cart) => {
      return sum + cart.items.reduce((itemSum, item) => itemSum + item.priceSnapshot * item.quantity, 0);
    }, 0);

    res.json({
      stats: {
        totalCarts,
        activeCarts,
        restoredCarts,
        totalPotentialRevenue,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- 3. Create dummy test data ----------
export const createDummyCarts = async (req, res) => {
  try {
    // Find a real user and product to use
    const user = await User.findOne().lean();
    const product = await Product.findOne({ status: "active" }).lean();

    if (!user || !product) {
      return res.status(400).json({ message: "No user or product found to create test data. Add some users and products first." });
    }

    const dummyCart = {
      userId: user._id,
      email: user.email || "test@example.com",
      phoneNumber: user.number || "9999999999",
      items: [
        {
          productId: product._id,
          name: product.name,
          slug: product.slug,
          quantity: 2,
          priceSnapshot: product.variant?.[0]?.discountPrice || 100,
          originalPrice: product.variant?.[0]?.price || 150,
          image: product.thumbImg
            ? `${process.env.BACKEND_URL || ""}${product.thumbImg}`
            : "/placeholder.png",
          variant: {
            color: product.variant?.[0]?.color || "Red",
            colorcode: product.variant?.[0]?.colorcode || "#ff0000",
          },
          productUpdatedAt: product.updatedAt,
        },
      ],
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRestored: false,
      reminderCount: 0,
    };

    await AbandonedCart.findOneAndUpdate(
      { userId: user._id },
      dummyCart,
      { upsert: true, new: true }
    );

    res.json({ message: "Test data created successfully!" });
  } catch (error) {
    console.error("Error creating dummy carts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- 4. Manually send a reminder ----------
export const sendManualReminder = async (req, res) => {
  try {
    const cart = await AbandonedCart.findById(req.params.id);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    if (cart.isRestored) return res.status(400).json({ message: "Cart already restored" });

    // Generate restore link if not present
    let restoreLink;
    if (!cart.restoreToken) {
      restoreLink = await prepareRestoreLink(cart);
    } else {
      restoreLink = `${process.env.FRONTEND_URL}/frontend/cart/restore?token=${cart.restoreToken}`;
    }

    const user = await User.findById(cart.userId).lean();
    const email = user?.email || cart.email;
    if (email) {
      await sendAbandonedCartEmail(email, restoreLink, cart.items);
    }

    cart.reminderCount += 1;
    cart.lastReminderSentAt = new Date();
    await cart.save();

    res.json({ message: "Reminder sent successfully" });
  } catch (error) {
    console.error("Error sending manual reminder:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- 5. Mark cart as restored ----------
export const markRestored = async (req, res) => {
  try {
    const cart = await AbandonedCart.findByIdAndUpdate(
      req.params.id,
      { isRestored: true, restoreToken: null, restoreTokenExpiry: null },
      { new: true }
    );
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json({ message: "Cart marked as restored" });
  } catch (error) {
    console.error("Error marking restored:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- 6. Delete a cart ----------
export const deleteCart = async (req, res) => {
  try {
    const cart = await AbandonedCart.findByIdAndDelete(req.params.id);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json({ message: "Cart deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};