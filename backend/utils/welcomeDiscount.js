import Coupon from "../models/couponModel.js";
import userModel from "../models/authModel.js";

export const WELCOME_DISCOUNT_PERCENT = 10;

export const normalizePhone = (phone) => {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
};

export const phonesMatch = (a, b) => normalizePhone(a) === normalizePhone(b);

export const generateWelcomeCouponCode = (phone) => {
  const suffix = normalizePhone(phone).slice(-4) || "0000";
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `WELCOME10-${suffix}${rand}`;
};

export const createWelcomeCouponForUser = async (user) => {
  const phone = normalizePhone(user.number);

  const previouslyUsed = await Coupon.findOne({
    assignedPhone: phone,
    isWelcomeCoupon: true,
    isUsed: true,
  });
  if (previouslyUsed || user.firstOrderDiscountUsed) {
    return { success: false, message: "Welcome discount already used for this phone number" };
  }

  if (user.welcomeCouponCode && user.firstOrderDiscountUnlocked) {
    const existing = await Coupon.findOne({ couponCode: user.welcomeCouponCode });
    if (existing && !existing.isUsed) {
      return { success: true, couponCode: user.welcomeCouponCode, coupon: existing };
    }
  }

  let couponCode = generateWelcomeCouponCode(user.number);
  let attempts = 0;
  while (attempts < 5) {
    const exists = await Coupon.findOne({ couponCode });
    if (!exists) break;
    couponCode = generateWelcomeCouponCode(user.number);
    attempts++;
  }

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);

  const coupon = await Coupon.create({
    couponCode,
    discount: WELCOME_DISCOUNT_PERCENT,
    discounttype: "percentage",
    expiryDate,
    minPurchaseAmount: 0,
    isActive: true,
    isWelcomeCoupon: true,
    assignedPhone: normalizePhone(user.number),
    assignedUserId: user._id,
    isUsed: false,
  });

  user.firstOrderDiscountUnlocked = true;
  user.welcomeCouponCode = couponCode;
  await user.save();

  return { success: true, couponCode, coupon };
};

export const computeCouponDiscount = (coupon, totalAmount) => {
  let discount = Number(coupon.discount) || 0;

  if (coupon.discounttype === "percentage") {
    discount = Math.floor((Number(totalAmount) * discount) / 100);
    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }
  } else if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
    discount = coupon.maxDiscountAmount;
  }

  return discount;
};

export const validateWelcomeCoupon = async ({ coupon, userId, addressPhone }) => {
  if (!coupon.isWelcomeCoupon) return { valid: true };

  if (!userId) {
    return { valid: false, message: "Please sign in to use your welcome discount" };
  }

  const user = await userModel.findById(userId);
  if (!user) {
    return { valid: false, message: "User not found" };
  }

  if (user.firstOrderDiscountUsed) {
    return { valid: false, message: "Welcome discount already used for this phone number" };
  }

  const previouslyUsed = await Coupon.findOne({
    assignedPhone: normalizePhone(user.number),
    isWelcomeCoupon: true,
    isUsed: true,
  });
  if (previouslyUsed) {
    return { valid: false, message: "Welcome discount already used for this phone number" };
  }

  if (!user.firstOrderDiscountUnlocked) {
    return { valid: false, message: "Welcome discount is not unlocked for your account" };
  }

  if (user.welcomeCouponCode !== coupon.couponCode) {
    return { valid: false, message: "This welcome coupon does not belong to your account" };
  }

  if (!phonesMatch(user.number, addressPhone || user.number)) {
    return { valid: false, message: "Welcome discount can only be used with your registered phone number" };
  }

  if (coupon.isUsed || !coupon.isActive) {
    return { valid: false, message: "This welcome coupon has already been used" };
  }

  return { valid: true, user };
};

export const consumeWelcomeDiscount = async (userId, couponCode) => {
  if (!userId || !couponCode) return;

  const user = await userModel.findById(userId);
  if (!user || user.welcomeCouponCode !== couponCode) return;

  user.firstOrderDiscountUsed = true;
  user.firstOrderDiscountUnlocked = false;
  await user.save();

  await Coupon.findOneAndUpdate(
    { couponCode, isWelcomeCoupon: true },
    { isUsed: true, isActive: false, assignedPhone: normalizePhone(user.number) }
  );
};
