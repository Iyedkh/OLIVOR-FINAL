import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discount: {
      type: Number,
      required: true, // e.g. 0.10 for 10%
      default: 0,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
    expirationDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
