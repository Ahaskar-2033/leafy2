import UserModel from '../Models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Register new users
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    try {
        // Check if user with the same email or username already exists
        const oldUser = await UserModel.findOne({ $or: [{ email }, { username }] });
        if (oldUser) {
            return res.status(400).json({ message: 'A user with this email or username already exists!' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPass = await bcrypt.hash(password, saltRounds);
        req.body.password = hashedPass;

        // Create a new user
        const newUser = new UserModel(req.body);
        const user = await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_KEY, { expiresIn: '1h' });

        res.status(200).json({ user, token });
    } catch (error) {
        // Enhanced error handling
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Duplicate key error: A user with this email or username already exists.' });
        }
        res.status(500).json({ message: error.message });
    }
};

// Login users
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Find the user by email
        const user = await UserModel.findOne({ email });
        if (user) {
            // Compare password
            const validity = await bcrypt.compare(password, user.password);
            if (!validity) {
                return res.status(400).json({ message: 'Incorrect email or password!' });
            } else {
                // Generate JWT token
                secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  throw new Error('JWT_SECRET environmental variable is not defined');}
const token = jwt.sign(payload, secretKey);
console.log(token);
            }
        } else {
            return res.status(404).json({ message: 'User not found. Please register first!' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
