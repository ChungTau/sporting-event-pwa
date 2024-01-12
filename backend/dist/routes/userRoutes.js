"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const UserController_1 = require("../controllers/UserController");
const router = (0, express_1.Router)();
// Public route: Create a new user
router.post('/register', UserController_1.UserController.createUser);
// Public route: Authenticate user and get JWT token
router.post('/login', UserController_1.UserController.loginUser); // Use the loginUser method for login
// Private route: Get all users
router.get('/', authMiddleware_1.authenticate, UserController_1.UserController.getUsers);
// Private route: Get user by ID
router.get('/:id', authMiddleware_1.authenticate, UserController_1.UserController.getUserById);
// Private route: Update user by ID
router.put('/:id', authMiddleware_1.authenticate, UserController_1.UserController.updateUser);
// Private route: Delete user by ID
router.delete('/:id', authMiddleware_1.authenticate, UserController_1.UserController.deleteUser);
exports.default = router;
