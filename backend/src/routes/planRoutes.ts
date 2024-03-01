import { Router } from 'express';
import PlanController from '../controllers/planController';
import { authenticate } from '../middleware/authMiddleware';
const router = Router();

router.post('/createPlan', authenticate, PlanController.createPlan);

router.get('/getPlans', authenticate, PlanController.getPlans);

router.get('/getPlan/:id', authenticate, PlanController.getPlansById);

router.put('/updatePlan/:id', authenticate, PlanController.updatePlan);

router.delete('/deletePlan/:id', authenticate, PlanController.deletePlan);

router.get('/getPlansByOwner/:ownerId', authenticate, PlanController.getPlansByOwnerId);

router.get('/getGPXFile/:userId/:filePath', authenticate, PlanController.getGPXFileByPath);

export default router;
