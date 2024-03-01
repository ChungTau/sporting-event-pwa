import { Router } from 'express';
import EventController from '../controllers/eventController';
import { authenticate } from '../middleware/authMiddleware';
import { uploadGPX, uploadBackgroundImage } from '../middleware/uploadMiddleware'; // Import upload middlewares

const router = Router();

router.post('/createEvent', authenticate, uploadGPX.single('gpxFile'), uploadBackgroundImage.single('backgroundImage'), EventController.createEvent); // Use single instead of fields for single file upload

router.get('/getEvents', EventController.getEvents);

router.get('/getEvent/:id', EventController.getEventById);

router.put('/updateEvent/:id', authenticate, EventController.updateEvent);

router.delete('/deleteEvent/:id', authenticate, EventController.deleteEvent);

router.get('/getEventsByOwner/:ownerId', authenticate, EventController.getEventsByOwnerId);

export default router;
