import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import logger from '../logger.js';

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            logger.warn('Registration failed: Missing fields');
            return res.status(400).json({ message: 'All fields (name, email, password) are required.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            logger.warn(`Registration failed: Email already exists (${email})`);
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        logger.info(`User registered successfully: ${email}`);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        logger.error(`Error during user registration: ${error.message}`);
        res.status(500).json({ message: 'An error occurred during registration. Please try again later.' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            logger.warn(`Login failed: User not found (${email})`);
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn(`Login failed: Invalid credentials (${email})`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.cookie('access_token', token, {
            httpOnly: true,
            sameSite: 'Strict',
        });

        logger.info(`User logged in: ${email}`);
        res.status(200).json({ message: 'Logged in successfully', user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        logger.error(`Error during login: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

const logoutUser = (req, res) => {
    res.clearCookie('access_token');
    logger.info(`User logged out: ${req.user._id}`);
    res.status(200).json({ message: 'Logged out successfully' });
};

const authenticateToken = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        logger.info(`User authentication successful: ${req.user.id}`);
        res.status(200).json({ user });
    } catch (err) {
        logger.error(`Authentication error: ${err.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

export {
    registerUser,
    loginUser,
    logoutUser,
    authenticateToken
};
