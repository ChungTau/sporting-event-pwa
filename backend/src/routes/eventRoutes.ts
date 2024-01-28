import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import EventController from '../controllers/eventController';

const router = Router();

/* *
 * @swagger
 * /api/register:
 *   post:
 *     summary: Create a new event.
 *     description: Create a new user with the provided name, eventType, privacy, maxOfParti, startDateTime, endDateTime, backgroundImage, description, remark, geoData
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               eventType:
 *                 type: string
 *               privacy:
 *                 type: string
 *               maxOfParti:
 *                 type: number
 *               startDateTime:
 *                 type: date
 *               endDateTime:
 *                 type: date
 *               backgroundImage:
 *                 type: string
 *               description:
 *                 type: string
 *               remark:
 *                 type: string
 *               geoData:
 *                 type: json
 * 
 * 
 *     responses:
 *       201:
 *         description: Event created successfully.
 *       400:
 *         description: Bad request, validation error, or missing fields.
 *       500:
 *         description: Internal server error.
 */
router.post('/register', EventController.createEvent);

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Get all events.
 *     description: Get a list of all events.
 *     responses:
 *       200:
 *         description: List of events retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Internal server error.
 */
 router.get('/', authenticate, EventController.getEvents);

 /**
 * @swagger
 * /api/{name}:
 *   get:
 *     summary: Get event by name.
 *     description: Get a event's details by their name.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Event name
 *     responses:
 *       200:
 *         description: Event details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:name', authenticate, EventController.getEventByName);

/**
 * @swagger
 * /api/{name}:
 *   put:
 *     summary: Update event by name.
 *     description: Update a event's details by their ID.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Event name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Event updated successfully.
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Internal server error.
 */
 router.put('/:name', authenticate, EventController.updateEvent);

 /**
 * @swagger
 * /api/{name}:
 *   delete:
 *     summary: Delete event by name.
 *     description: Delete a event by their name.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Event name
 *     responses:
 *       200:
 *         description: Event deleted successfully.
 *       404:
 *         description: Evemt not found.
 *       500:
 *         description: Internal server error.
 */
router.delete('/:name', authenticate, EventController.deleteEvent);