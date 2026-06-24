import mongoose from 'mongoose';

const supportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: String, // or mongoose.Schema.Types.ObjectId if you reference Order
      required: true,
    },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Resolved'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

const Support = mongoose.model('Support', supportSchema);

export default Support;