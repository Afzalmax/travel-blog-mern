const User = require('../models/User');
const bcrypt = require('bcrypt');
const post = require('../models/Post');
const tokenGenerator = require('../utils/tokenGenerator');

exports.createUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed Password:', hashedPassword);  // Log the hashed password for debugging
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error during user creation:', error.message);
        res.status(500).json({ message: error.message });
    }
};



exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Fetch user from the database
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log('Password does not match');
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate token if the password matches
        const token = tokenGenerator(user._id);
           return res.status(200).json({ token, user });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        console.log(req.user);
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error getting user:', error.message);
        res.status(500).json({ message: error.message });
    }
}
exports.getProfile = async (req, res) => {
    try {
        const user = await user.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const posts = await post.find({ CreatedBy: req.user.id });
        res.status(200).json({ posts });
    } catch (error) {
        console.error('Error getting profile:', error.message);
        res.status(500).json({ message: error.message });
    }
}
