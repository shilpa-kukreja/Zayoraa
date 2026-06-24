// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   username: { type: String,  },
//   email:    { type: String,  unique: true },
//   number:   { type: String, required: true, unique: true },
//   img :     { type : String, default : null },
//   verifiedAt: { type: Date, default: Date.now },
//   address: { type: Array, default: [] },
// }, { timestamps: true });

// const userModel = mongoose.models.User || mongoose.model("User", userSchema);
// export default userModel;

import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address1: { type: String, required: true },
    address2: { type: String },
    addresstype: {
      type: String,
      enum: ['Home', 'Work', 'Other', ],
      default: 'Home'
    }
    ,
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    landmark: { type: String },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true } // ensures each address gets its own _id
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String },
    email: { type: String, unique: true },
    number: { type: String, required: true, unique: true },
    img: { type: String, default: null },
    verifiedAt: { type: Date, default: Date.now },
    address: { type: [addressSchema], default: [] }, // array of subdocuments
    firstOrderDiscountUnlocked: { type: Boolean, default: false },
    firstOrderDiscountUsed: { type: Boolean, default: false },
    welcomeCouponCode: { type: String, default: null },
  },
  { timestamps: true }
);

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;

