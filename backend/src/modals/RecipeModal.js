const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 512,
  },
  image: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  rate: {
    type: [RatingSchema],
    default: [],
  },
  rateMeta: {
    ratedCount: {
      type: Number,
      default: 0,
    },
    ratedBy: {
      type: [String],
      default: [],
    },
  },
  like: {
    likeCount: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: [String],
      default: [],
    },
  },
  ingredients: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
    default: "",
  },
  steps: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: String,
    required: true,
  },
  comment: {
    CommentCount: {
      type: Number,
      default: 0,
    },
    CommentBy: {
      type: [String],
      default: [],
    },
    Comments: {
      type: [
        {
          userId: { type: String, required: true, default: "" },
          username: { type: String, required: true, default: "" },
          image: { type: String, required: true, default: "" },
          text: { type: String, required: true, default: "" },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  },
});

const Recipe = mongoose.model("Recipe", RecipeSchema);

module.exports = Recipe;
