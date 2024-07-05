const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const tokenGenerator = require('../utils/tokenGenerator');

exports.createAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed Password:', hashedPassword);  // Log the hashed password for debugging
        const user = new Admin({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error during user creation:', error.message);
        res.status(500).json({ message: error.message });
    }
};



exports.loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Fetch user from the database
        const admin = await Admin.findOne({ username });
        if (!admin) {
            console.log('Admin not found');
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            console.log('Password does not match');
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate token if the password matches
        const token = tokenGenerator(admin._id);
           return res.status(200).json({ token });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.getAdmin = async (req, res) => {
    try {
        console.log(req.user);
        const admin = await Admin.findOne({ _id: req.user.id });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json({ admin });
    } catch (error) {
        console.error('Error getting user:', error.message);
        res.status(500).json({ message: error.message });
    }
}