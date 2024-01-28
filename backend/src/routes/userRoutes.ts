import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import UserController from '../controllers/userController';

const router = Router();

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Create a new event.
 *     description: Create a new event with the provided name, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: Bad request, validation error, or missing fields.
 *       500:
 *         description: Internal server error.
 */
router.post('/register', UserController.createUser);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Authenticate user and get JWT token.
 *     description: Authenticate a user with their email and password and return a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentication successful, JWT token generated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: Internal server error.
 */
router.post('/login', UserController.loginUser);

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Get all users.
 *     description: Get a list of all users.
 *     responses:
 *       200:
 *         description: List of users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error.
 */
router.get('/', authenticate, UserController.getUsers);

/**
 * @swagger
 * /api/{id}:
 *   get:
 *     summary: Get user by ID.
 *     description: Get a user's details by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:id', authenticate, UserController.getUserById);

/**
 * @swagger
 * /api/{id}:
 *   put:
 *     summary: Update user by ID.
 *     description: Update a user's details by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.put('/:id', authenticate, UserController.updateUser);

/**
 * @swagger
 * /api/{id}:
 *   delete:
 *     summary: Delete user by ID.
 *     description: Delete a user by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.delete('/:id', authenticate, UserController.deleteUser);

export default router;
