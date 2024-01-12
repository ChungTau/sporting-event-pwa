import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import UserController from '../controllers/UserController';


const router = Router();

// Public route: Create a new user
router.post('/register', UserController.createUser);

// Public route: Authenticate user and get JWT token
router.post('/login', UserController.loginUser); // Use the loginUser method for login

// Private route: Get all users
router.get('/', authenticate, UserController.getUsers);

// Private route: Get user by ID
router.get('/:id', authenticate, UserController.getUserById);

// Private route: Update user by ID
router.put('/:id', authenticate, UserController.updateUser);

// Private route: Delete user by ID
router.delete('/:id', authenticate, UserController.deleteUser);

export default router;
