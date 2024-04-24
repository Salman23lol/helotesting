const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../modals/UserModal'); // Assuming you have a User model defined

const registerUser = async (req, res) => {
    const { email, username, password, image } = req.body
    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email: email,
            username:username,
            password: hashedPassword,
            image:image
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const loginUser = async (req, res) => {
    const { email, password: enteredPassword } = req.body; // Rename 'password' to 'enteredPassword'
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const passwordMatch = await bcrypt.compare(enteredPassword, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }
        const { password, ...userData } = user.toObject();
        const token = jwt.sign({ userData }, process.env.USER_SECRET, { expiresIn: '1h' });
        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



module.exports = {
    registerUser,
    loginUser
};
  