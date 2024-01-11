import { Router } from 'express';
import * as userController from '../controllers/userController';

const router = Router();

router.post('/users', userController.createUser);
router.get('/users/:id', userController.getUserById);
export default router;
