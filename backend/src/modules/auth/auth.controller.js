const authService = require('./auth.service');
const { generateToken } = require('../../utils/jwt.util');

/**
 * Controller for user registration
 */
const register = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;

        // Basic validation
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        // Check if user already exists
        const existingUser = await authService.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        // Create user
        const user = await authService.registerUser({ email, password, role });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error); // Pass error to global error handler
    }
};

/**
 * Controller for user login
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        // Authenticate user
        const user = await authService.loginUser(email, password);

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Fetch faculty designations if role is faculty/coord/hod/dean
        const Faculty = require('../faculty/faculty.model');
        const facultyProfile = await Faculty.findOne({ userId: user._id });
        const designations = facultyProfile ? facultyProfile.designations : [];

        // Generate token with basic user info
        const token = generateToken(user);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            data: {
                id: user._id,
                email: user.email,
                role: user.role,
                designations: designations.length > 0 ? designations : [user.role]
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all users
 */
const getAll = async (req, res, next) => {
    try {
        const users = await authService.getAllUsers();
        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getAll,
};
