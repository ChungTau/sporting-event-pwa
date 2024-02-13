import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import {uploadPlanGPX} from "../middleware/uploadMiddleware";
import PlanController from "../controllers/planController";

const router = Router();

router.post('/add-plan/:ownerId', authenticate, uploadPlanGPX.single('path'), PlanController.createPlan);
router.get('/', PlanController.getPlans);
router.get('/:id', PlanController.getPlansById);
router.put('/:id', authenticate, PlanController.updatePlan);
router.delete('/:id', authenticate, PlanController.deletePlan);
// Add this route in your router setup

router.get('/plans-by-owner/:ownerId', authenticate, PlanController.getPlansByOwnerId);


export default router;