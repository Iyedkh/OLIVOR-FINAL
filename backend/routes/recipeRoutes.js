import express from 'express';
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipeController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getRecipes)
  .post(protect, admin, createRecipe);

router.route('/:id')
  .get(getRecipeById)
  .put(protect, admin, updateRecipe)
  .delete(protect, admin, deleteRecipe);

export default router;
