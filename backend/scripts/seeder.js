import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import users from '../data/users.js';
import products from '../data/products.js';
import recipes from '../data/recipes.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Recipe from '../models/Recipe.js';
import connectDB from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

await connectDB();

const importData = async () => {
  try {
    // Clear database
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Recipe.deleteMany();

    // Insert new users
    const createdUsers = await User.create(users);

    // Get Admin User ID to associate with products if needed, but in our schema product doesn't strictly have a user ref.
    // If it does, we associate it. Let's look at Product schema: it doesn't have user, so we can insert directly.
    await Product.insertMany(products);

    // Insert recipes
    await Recipe.insertMany(recipes);

    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Recipe.deleteMany();

    console.log('Data Destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data destroy: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
