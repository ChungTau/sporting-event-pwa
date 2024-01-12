"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dbConfig_1 = require("../config/dbConfig");
const User_1 = __importDefault(require("../models/User"));
const authenticate = async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, dbConfig_1.JWT_SECRET);
        // Assuming you have a 'User' model or type definition
        const user = await User_1.default.findByPk(decoded.userId); // Fetch user data based on the decoded payload
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        // Attach user data to the request object for further use
        req.user = user;
        next();
        return; // Add this return statement
    }
    catch (ex) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
};
exports.authenticate = authenticate;
