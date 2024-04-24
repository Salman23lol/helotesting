const express = require('express');
const { loginUser, registerUser } = require('../Controllers/UserController');
const userRouters = express.Router();

// User  route
userRouters.post('/register', registerUser);
userRouters.post('/login', loginUser);

module.exports = userRouters;
