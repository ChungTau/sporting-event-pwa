"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const userController_1 = __importDefault(require("../controllers/userController"));
const router = (0, express_1.Router)();
// Public route: Create a new user
router.post('/register', userController_1.default.createUser);
// Public route: Authenticate user and get JWT token
router.post('/login', userController_1.default.loginUser); // Use the loginUser method for login
// Private route: Get all users
router.get('/', authMiddleware_1.authenticate, userController_1.default.getUsers);
// Private route: Get user by ID
router.get('/:id', authMiddleware_1.authenticate, userController_1.default.getUserById);
// Private route: Update user by ID
router.put('/:id', authMiddleware_1.authenticate, userController_1.default.updateUser);
// Private route: Delete user by ID
router.delete('/:id', authMiddleware_1.authenticate, userController_1.default.deleteUser);
exports.default = router;
