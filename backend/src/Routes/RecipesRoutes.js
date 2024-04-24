const express = require('express');
const recipeRouter = express.Router();
const recipeController = require('../Controllers/RecipeController');

// Routes for recipe CRUD operations
recipeRouter.get('/all', recipeController.getAllRecipes);
recipeRouter.get('/recipeById/:recipeId', recipeController.getRecipeById);
recipeRouter.post('/create', recipeController.createRecipe);
recipeRouter.put('/update/:userId/:recipeId', recipeController.updateRecipeById);
recipeRouter.delete('/delete/:id', recipeController.deleteRecipeById);

// Routes for recipe Features  
recipeRouter.post('/like/:recipeId', recipeController.likeRecipeById);
recipeRouter.post('/comment/:recipeId', recipeController.commentRecipeById);
recipeRouter.post('/rate/:id', recipeController.RatingRecipe);
recipeRouter.get('/view/:recipeId', recipeController.trackRecipeView);

// Route for getting popular recipes
recipeRouter.get('/popular', recipeController.getPopularRecipes);

// Route for getting trending recipes
recipeRouter.get('/trending', recipeController.getTrendingRecipes);

module.exports = recipeRouter;
