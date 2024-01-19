"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = require("jsonwebtoken");
const dbConfig_1 = require("../config/dbConfig");
class UserController {
    // Create a new user
    static async createUser(req, res) {
        try {
            const { username, email, password } = req.body;
            if (!req.body.password) {
                return res.status(400).json({ message: 'Password is required' });
            }
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            console.log(hashedPassword);
            const user = await User_1.User.create({ username, email, password: hashedPassword });
            return res.status(201).json(user); // Add 'return' here
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error creating user' });
        }
    }
    // Get all users
    static async getUsers(res) {
        try {
            const users = await User_1.User.findAll();
            res.json(users);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching users' });
        }
    }
    // Get user by ID
    static async getUserById(req, res) {
        const userId = req.params.id;
        try {
            const user = await User_1.User.findByPk(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
            }
            else {
                res.json(user);
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching user' });
        }
    }
    // Update user by ID
    static async updateUser(req, res) {
        const userId = req.params.id;
        try {
            const [updatedRowsCount] = await User_1.User.update(req.body, {
                where: { id: userId },
            });
            if (updatedRowsCount === 0) {
                res.status(404).json({ message: 'User not found' });
            }
            else {
                res.json({ message: 'User updated successfully' });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating user' });
        }
    }
    // Delete user by ID
    static async deleteUser(req, res) {
        const userId = req.params.id;
        try {
            const deletedRowCount = await User_1.User.destroy({
                where: { id: userId },
            });
            if (deletedRowCount === 0) {
                res.status(404).json({ message: 'User not found' });
            }
            else {
                res.json({ message: 'User deleted successfully' });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error deleting user' });
        }
    }
    // Login with password verification
    static async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User_1.User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const passwordMatch = await bcrypt_1.default.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const token = (0, jsonwebtoken_1.sign)({
                userId: user.id,
                username: user.username,
            }, dbConfig_1.JWT_SECRET, {
                expiresIn: '1h',
            });
            return res.json({ token });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error logging in' });
        }
    }
}
exports.default = UserController;
