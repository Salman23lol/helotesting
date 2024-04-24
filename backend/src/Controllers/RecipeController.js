const Recipe = require("../modals/RecipeModal");
const User = require("../modals/UserModal");

// Get all recipes
const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a specific recipe by ID
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const createRecipe = async (req, res) => {
  const { title, description, image, steps, ingredients, type, userId } = req.body;

  try {
    // Create a new recipe document
    const newRecipe = new Recipe({
      title,
      description,
      image,
      steps,
      ingredients,
      type,
      owner: userId, // Assign the user ID as the owner of the recipe
      rateMeta: {
        ratedCount: 0, // Initialize rated count to 0
        ratedBy: [],   // Initialize rated by to an empty array
      },
    });

    await newRecipe.save();
    console.log("Successfully Created Recipe");

    res
      .status(201)
      .json({ success: true, message: "Recipe created successfully" });
  } catch (error) {
    console.error("Error creating recipe:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create recipe" });
  }
};


const updateRecipeById = async (req, res) => {
  try {
    const { recipeId, userId } = req.params;
    const { title, description } = req.body;

    if (!recipeId) {
      return res
        .status(400)
        .json({ message: "Recipe ID is missing in the URL" });
    }
    if (!userId) {
      return res.status(400).json({ message: "User ID is missing in the URL" });
    }

    const isUserOwner = await User.findOne({ _id: userId }).lean();

    if (!isUserOwner) {
      return res.status(404).json({ error: "User not found" });
    }

    const findRecipe = await Recipe.findOne({ _id: recipeId }).lean();
    if (!findRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    if (userId == findRecipe.owner) {
      // Update the recipe if both user and recipe are found
      const updatedRecipe = await Recipe.findByIdAndUpdate(
        recipeId,
        { title, description },
        { new: true }
      );
      if (!updatedRecipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
    } else {
      return res
        .status(401)
        .json({ message: "You can't change someone else's recipe" });
    }

    // Recipe updated successfully
    res.status(200).json({ message: "Recipe updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteRecipeById = async (req, res) => {
  const { userId } = req.body;

  try {
    if (!userId) {
      return res.status(403).json({ error: "Please provide a user ID" });
    }

    // Check if the user exists and has permission to delete
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.role !== "Creator") {
      return res
        .status(403)
        .json({ error: "You don't have permission to delete" });
    }

    // Proceed with deleting the recipe
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const likeRecipeById = async (req, res) => {
  const { recipeId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Check if the user has already liked the recipe
    if (recipe.like.likedBy.includes(userId)) {
      return res
        .status(403)
        .json({ error: "You have already liked the recipe" });
    }

    // Increment the likeCount and push the new user ID to LikedBy array
    recipe.like.likeCount += 1;
    recipe.like.likedBy.push(userId);
    await recipe.save();

    res.status(200).json({ message: "Recipe liked successfully", recipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const RatingRecipe = async (req, res) => {
  const { id } = req.params;
  const { userId, rating } = req.body;
  
  try {
    const recipe = await Recipe.findById(id);
    
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Check if the user has already rated the recipe
    const existingRatingIndex = recipe.rate.findIndex(item => item.userId === userId);

    if (existingRatingIndex !== -1) {
      // Update the existing rating
      recipe.rate[existingRatingIndex].rating = rating;
    } else {
      // If user hasn't rated, add a new rating
      recipe.rate.push({
        userId: userId,
        rating: rating
      });
      // Update rateMeta accordingly
      recipe.rateMeta.ratedCount += 1;
      recipe.rateMeta.ratedBy.push(userId);
    }

    await recipe.save();

    res.status(200).json({ message: "Recipe rating updated successfully", recipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



const commentRecipeById = async (req, res) => {
  const { recipeId } = req.params;
  const { comment, userId, image, username } = req.body;

  if (!comment || !userId) {
    return res.status(400).json({ error: "Comment and User ID are required" });
  }

  try {
    // Find the recipe by ID
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Create a new comment object with user's information
    const newComment = {
      userId,
      username: username, 
      image: image, 
      text: comment,
    };

    recipe.comment.Comments.push(newComment);
    recipe.comment.CommentBy.push(userId)
    recipe.comment.CommentCount += 1;

    await recipe.save();
    res.status(200).json({ message: "Comment added successfully", recipe });
    console.log('Successfully Commented')
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const trackRecipeView = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const ip = req.ip; // Get the user's IP address (assuming IP-based tracking)

    // Check if the IP has viewed the recipe in the last minute
    const lastView = recipe.stats.views[ip];
    const now = Date.now();
    if (!lastView || now - lastView >= 60000) {
      // If there's no recent view or the last view was more than a minute ago
      // Increment the view count and update the timestamp
      recipe.stats.views[ip] = now;
      recipe.stats.viewsCount += 1;
      await recipe.save();
      res.status(200).json({
        message: "View added successfully",
        viewsCount: recipe.stats.viewsCount,
      });
    } else {
      // If the view limit is exceeded, return a 403 Forbidden response
      res.status(403).json({ error: "View limit exceeded" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTrendingRecipes = async (req, res) => {
  try {
    // Fetch all recipes
    const allRecipes = await Recipe.find();

    // Sort recipes by a combination of factors such as createdAt, likeCount, and views
    const trendingRecipes = allRecipes.sort((a, b) => {
      // First, compare by createdAt
      if (a.createdAt > b.createdAt) return -1;
      if (a.createdAt < b.createdAt) return 1;

      // If createdAt is the same, compare by likeCount
      if (a.stats.like.LikeCount > b.stats.like.LikeCount) return -1;
      if (a.stats.like.LikeCount < b.stats.like.LikeCount) return 1;

      // If likeCount is also the same, compare by views
      if (a.stats.views > b.stats.views) return -1;
      if (a.stats.views < b.stats.views) return 1;

      // If everything is the same, keep the order unchanged
      return 0;
    });

    // Return the trending recipes as a response
    res.json(trendingRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPopularRecipes = async (req, res) => {
  try {
    // Fetch the most popular recipes based on views and like counts
    const popularRecipes = await Recipe.find(Recipe);
    // .sort({ views: -1, likeCount: -1 }) // Sort recipes by views and like counts in descending order
    // .limit(10); // Limit the number of recipes to 10

    // Return the popular recipes as a response
    res.json({ popularRecipes });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error fetching popular recipes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipeById,
  deleteRecipeById,
  likeRecipeById,
  commentRecipeById,
  getTrendingRecipes,
  getPopularRecipes,
  RatingRecipe,
  trackRecipeView,
};
