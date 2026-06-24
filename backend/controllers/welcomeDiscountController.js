import userModel from "../models/authModel.js";
import { createWelcomeCouponForUser } from "../utils/welcomeDiscount.js";

export const getWelcomeDiscountStatus = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      unlocked: user.firstOrderDiscountUnlocked,
      used: user.firstOrderDiscountUsed,
      couponCode: user.welcomeCouponCode,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const unlockWelcomeDiscount = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.firstOrderDiscountUsed) {
      return res.status(400).json({
        success: false,
        message: "Welcome discount already used for this phone number",
      });
    }

    const result = await createWelcomeCouponForUser(user);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    res.json({
      success: true,
      message: "Welcome discount unlocked!",
      couponCode: result.couponCode,
      discountPercent: 10,
    });
  } catch (error) {
    console.error("unlockWelcomeDiscount error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
