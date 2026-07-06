import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    volume: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
      default: null,
    },
    badgeType: {
      type: String,
      default: null,
    },
    images: {
      type: [String],
      default: [],
    },
    countInStock: {
      type: Number,
      required: true,
      default: 10,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
