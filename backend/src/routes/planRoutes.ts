import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import {uploadPlanGPX} from "../middleware/uploadMiddleware";
import PlanController from "../controllers/planController";

const router = Router();

router.post('/add-plan', authenticate, uploadPlanGPX.single('gpx'), PlanController.createPlan);
router.get('/', PlanController.getPlans);
router.get('/:id', PlanController.getPlansById);
router.put('/:id', authenticate, PlanController.updatePlan);
router.delete('/:id', authenticate, PlanController.deletePlan);

export default router;