import Recipe from '../models/Recipe.js';

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a recipe
// @route   POST /api/recipes
// @access  Private/Admin
const createRecipe = async (req, res) => {
  try {
    const { title, time, difficulty, category, image, ingredients, instructions } = req.body;

    const recipe = new Recipe({
      title: title || 'Sample Recipe',
      time: time || '30 MIN',
      difficulty: difficulty || 'Easy',
      category: category || 'Appetizers',
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
      ingredients: ingredients || ['Sample ingredient 1', 'Sample ingredient 2'],
      instructions: instructions || ['Step 1 details', 'Step 2 details'],
    });

    const createdRecipe = await recipe.save();
    res.status(201).json(createdRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private/Admin
const updateRecipe = async (req, res) => {
  const { title, time, difficulty, category, image, ingredients, instructions } = req.body;

  try {
    const recipe = await Recipe.findById(req.params.id);

    if (recipe) {
      recipe.title = title !== undefined ? title : recipe.title;
      recipe.time = time !== undefined ? time : recipe.time;
      recipe.difficulty = difficulty !== undefined ? difficulty : recipe.difficulty;
      recipe.category = category !== undefined ? category : recipe.category;
      recipe.image = image !== undefined ? image : recipe.image;
      recipe.ingredients = ingredients !== undefined ? ingredients : recipe.ingredients;
      recipe.instructions = instructions !== undefined ? instructions : recipe.instructions;

      const updatedRecipe = await recipe.save();
      res.json(updatedRecipe);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private/Admin
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (recipe) {
      await Recipe.deleteOne({ _id: recipe._id });
      res.json({ message: 'Recipe removed' });
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
