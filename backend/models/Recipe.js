import mongoose from 'mongoose';

const recipeSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Intermediate', 'Advanced'],
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    ingredients: [
      {
        type: String,
      }
    ],
    instructions: [
      {
        type: String,
      }
    ]
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
