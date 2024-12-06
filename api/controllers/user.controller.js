import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


const registerUser = async (req, res) => {
    try {
        console.log(req.body);

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields (name, email, password) are required.' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        // General server error
        console.error(error);
        res.status(500).json({ message: 'An error occurred during registration. Please try again later.' });
    }
};



const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.cookie('access_token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            // expires: new Date(Date.now() + 3600000), // 1 hour expiry
            sameSite: 'Strict', // To prevent CSRF attacks
        });
        res.status(200).json({ message: 'Logged in successfully', user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const logoutUser = (req, res) => {
    res.clearCookie('access_token');
    res.status(200).json({ message: 'Logged out successfully' });
};

const authenticateToken = async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // Get user from token's ID
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export { registerUser, loginUser, logoutUser,authenticateToken };
