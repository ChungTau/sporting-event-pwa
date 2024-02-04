import { Router } from "express";
import EventController from "../controllers/eventController";
import { authenticate } from "../middleware/authMiddleware";
import { uploadBackgroundImage, uploadGpxFile } from "../middleware/uploadMiddleware";

const router = Router();

router.post('/add-event', authenticate, uploadGpxFile, uploadBackgroundImage, EventController.createEvent);
router.get('/', EventController.getEvents);
router.get('/:id', EventController.getEventsById);
router.put('/:id', authenticate, EventController.updateEvent);
router.delete('/:id', authenticate, EventController.deleteEvent);

export default router;