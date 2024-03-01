import { Router } from 'express';

import UserController from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/signUp', UserController.createUser);

router.post('/signIn', UserController.loginUser);

router.get('/', authenticate, UserController.getUsers);

router.get('/:id', authenticate, UserController.getUserById);

router.put('/:id', authenticate, UserController.updateUser);

router.delete('/:id', authenticate, UserController.deleteUser);

export default router;
