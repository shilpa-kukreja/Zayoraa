import mongoose from "mongoose";

const abandonedItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  slug: { type: String, required: true },                     // for product link
  quantity: { type: Number, required: true, min: 1 },
  priceSnapshot: { type: Number, required: true },            // discounted price
  originalPrice: { type: Number },                            // MRP for strikethrough
  image: String,                                              // full URL of variant image
  variant: {
    color: String,
    colorcode: String,
    size: String,
    image: String,                                            // optional variant image URL
  },
  productUpdatedAt: { type: Date, required: true },
});

const abandonedCartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,   // one active abandoned cart per user at a time
    },
    email: String,     // pulled from user if needed, but we'll store the user's email directly
    phoneNumber: String,
    items: [abandonedItemSchema],
    restoreToken: { type: String, index: true },
    restoreTokenExpiry: { type: Date, index: true },


      // NEW: replace remindersSent object
    reminderCount: { type: Number, default: 0 },          // how many reminders sent (0-7)
    lastReminderSentAt: { type: Date, default: null },


    // Track which reminders have been sent (multi-stage)
    // remindersSent: {
    //   stage1: { type: Boolean, default: false },   // e.g., after 1 hour
    //   stage2: { type: Boolean, default: false },   // after 24 hours
    //   stage3: { type: Boolean, default: false },   // after 72 hours
    // },

    lastActivity: { type: Date, default: Date.now },
    isRestored: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ---------- Virtuals for admin dashboard ----------
abandonedCartSchema.virtual("cartTotal").get(function () {
  return this.items.reduce((sum, item) => sum + item.priceSnapshot * item.quantity, 0);
});

abandonedCartSchema.virtual("itemCount").get(function () {
  return this.items.length;
});

abandonedCartSchema.virtual("daysAbandoned").get(function () {
  const now = new Date();
  const diffTime = now - this.lastActivity;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
});

abandonedCartSchema.virtual("remindersSent").get(function () {
  return this.reminderCount;
});

abandonedCartSchema.virtual("lastReminderSent").get(function () {
  return this.lastReminderSentAt;
});

// TTL index: automatically delete expired restore tokens
abandonedCartSchema.index(
  { restoreTokenExpiry: 1 },
  { expireAfterSeconds: 0 }
);
abandonedCartSchema.index({ lastActivity: 1 });

export default mongoose.model("AbandonedCart", abandonedCartSchema);