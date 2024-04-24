const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Import cors package
const userRoutes = require('./Routes/UserRoutes');
const recipeRouter = require('./Routes/RecipesRoutes');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
    methods: '*',
    credentials: true
}));


// User routes
app.use('/user', userRoutes);
app.use('/recipe', recipeRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const DB_URL = process.env.DB_URI;
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
    .then(() => {
        console.log('Connected to MongoDB');
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });
