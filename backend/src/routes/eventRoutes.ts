import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import EventController from '../controllers/eventController';

const router = Router();

router.post('/createEvent', EventController.createEvent);

router.get('/allEvents', authenticate, EventController.getAllEvents);

router.get('/:name', authenticate, EventController.getEventByName);

router.put('/:name', authenticate, EventController.updateEvent);

router.delete('/:name', authenticate, EventController.deleteEvent);

export default router;