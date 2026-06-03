import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  number: { type: String, required: true }, // mobile number
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } 
});

const otpModel = mongoose.models.Otp || mongoose.model("Otp", otpSchema);
export default otpModel;
