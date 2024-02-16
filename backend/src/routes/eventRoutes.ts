import { Router } from "express";
import EventController from "../controllers/eventController";
import { authenticate } from "../middleware/authMiddleware";
import {uploadBgImage} from "../middleware/uploadMiddleware";

const router = Router();

router.post('/add-event', authenticate, uploadBgImage.fields([{name: 'gpx', maxCount:1}, {name: 'backgroundImage', maxCount:1}]), EventController.createEvent);
router.get('/', EventController.getEvents);
router.get('/:id', EventController.getEventsById);
router.put('/:id', authenticate, EventController.updateEvent);
router.delete('/:id', authenticate, EventController.deleteEvent);
router.get('/events-by-owner/:ownerId', authenticate, EventController.getEventsByOwnerId);

export default router;