import { Router } from 'express';
import PlanController from '../controllers/planController';
import { authenticate } from '../middleware/authMiddleware';
import { uploadGPX } from '../middleware/uploadMiddleware';
const router = Router();

router.post('/createPlan/:ownerId', authenticate, uploadGPX.single('gpxFile'), PlanController.createPlan);

router.get('/', authenticate, PlanController.getPlans);

router.get('/:id', authenticate, PlanController.getPlansById);

router.get('/getPlanFromEvent/:id', PlanController.getPlansById);

router.put('/:id', authenticate, PlanController.updatePlan);

router.delete('/:id', authenticate, PlanController.deletePlan);

router.get('/getPlansByOwner/:ownerId', authenticate, PlanController.getPlansByOwnerId);

router.get('/getGPXFile/:filePath', PlanController.getGPXFileByPath);

export default router;
