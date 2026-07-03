import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js'; // MUST import User to register its schema
import Order from './models/Order.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const connectDB = async () => {
  try {
    console.log("MONGO_URI is:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongoose connected successfully.");
    
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    console.log("Orders found:", orders.length);
    if (orders.length > 0) {
      console.log("First order details:", JSON.stringify(orders[0], null, 2));
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Test failed with error:", error);
    process.exit(1);
  }
};

connectDB();
