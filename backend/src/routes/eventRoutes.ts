import { Router } from 'express';
import EventController from '../controllers/eventController';
import { authenticate } from '../middleware/authMiddleware';
import { uploadBackgroundImage } from '../middleware/uploadMiddleware'; // Import upload middlewares

const router = Router();

router.post('/createEvent', authenticate, uploadBackgroundImage.single('backgroundImage'), EventController.createEvent); // Use single instead of fields for single file upload

router.get('/', EventController.getEvents);

router.get('/:id', EventController.getEventById);

router.put('/:id', authenticate, EventController.updateEvent);

router.delete('/:id', authenticate, EventController.deleteEvent);

router.get('/getEventsByOwner/:ownerId', authenticate, EventController.getEventsByOwnerId);

export default router;
