const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    required: true,
    maxlength: 16,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "member"
  },
  image: { 
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
