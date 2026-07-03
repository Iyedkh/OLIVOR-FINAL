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
import Category from '../models/Category.js';
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
    await Category.deleteMany();

    // Collect all unique categories from products
    const uniqueCategoryNames = [...new Set(products.map(p => p.category))];

    // Create Category documents
    const createdCategories = [];
    for (const name of uniqueCategoryNames) {
      const cat = await Category.create({
        name,
        description: `${name} premium collection.`
      });
      createdCategories.push(cat);
    }

    // Map category name to its ID
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Update products array to use Category ObjectIds
    const updatedProducts = products.map(product => ({
      ...product,
      category: categoryMap[product.category]
    }));

    // Insert new users
    await User.create(users);

    // Insert products with their category references
    await Product.insertMany(updatedProducts);

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
    await Category.deleteMany();

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
