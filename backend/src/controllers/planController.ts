import { Request, Response } from 'express';
import { PlanService } from '../service/PlanService';
import path from 'path';
import fs from 'fs';
import { UserService } from '../service/UserService';
import User from '../models/User';

class PlanController {
  private static planService = new PlanService();
  private static userService = new UserService();

  static async createPlan(req: Request, res: Response) {
    try {
      const {
        name,
        ownerId,
        thumbnail,
        info
      } = req.body;

      // Check if required fields are missing
      if (!name || !thumbnail || !info || !ownerId) {
        return res.status(400).json({
          message: 'Name, Owner ID, Thumbnail, and Info are required',
        });
      }

      const file = req.file as Express.Multer.File;
      if (!file) {
          return res.status(400).json({
              message: 'GPX file is required',
          });
      }

      // Read the uploaded GPX file as Buffer
      const gpxFileBuffer = fs.readFileSync(file.path);

      // Create a new plan with the GPX file as Buffer
      const newPlan = await PlanController.planService.createPlan({
          ...req.body,
          gpxFile: gpxFileBuffer,
      });

      // Delete the temporary file after reading
      fs.unlinkSync(file.path);


      if (!newPlan) {
        return res.status(500).json({ message: 'Error creating plan' });
      }

      return res.status(201).json(newPlan);
    } catch (error) {
      console.error('Error creating plan:', error);
      return res.status(500).json({ message: 'Error creating plan: ' + error });
    }
  }

  static async getPlans(_req: Request, res: Response) {
    try {
      const plans = await PlanController.planService.getPlans();
      return res.json(plans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      return res.status(500).json({ message: 'Error fetching plans: ' + error});
    }
  }

  static async getPlansById(req: Request, res: Response) {
    try {
      const planId = parseInt(req.params.id);
      const plan = await PlanController.planService.getPlanById(planId);
      if (!plan) {
        return res.status(404).json({ message: 'Plan not found' });
      }
      return res.json(plan);
    } catch (error) {
      console.error('Error fetching plan:', error);
      return res.status(500).json({ message: 'Error fetching plan: ' + error });
    }
  }

  static async updatePlan(req: Request, res: Response) {
    try {
      const planId = parseInt(req.params.id);
      const success = await PlanController.planService.updatePlan(planId, req.body);
      if (!success) {
        return res.status(404).json({ message: 'Plan not found' });
      }
      return res.status(200).json({ message: 'Plan updated successfully' });
    } catch (error) {
      console.error('Error updating plan:', error);
      return res.status(500).json({ message: 'Error updating plan: ' + error });
    }
  }

  static async deletePlan(req: Request, res: Response) {
    try {
      const planId = parseInt(req.params.id);
      const success = await PlanController.planService.deletePlan(planId);
      if (!success) {
        return res.status(404).json({ message: 'Plan not found' });
      }
      return res.json({ message: 'Plan deleted successfully' });
    } catch (error) {
      console.error('Error deleting plan:', error);
      return res.status(500).json({ message: 'Error deleting plan: ' + error });
    }
  }

  static async getPlansByOwnerId(req: Request, res: Response) {
    try {
      const ownerId = parseInt(req.params.ownerId);
      const plans = await PlanController.planService.getPlansByOwnerId(ownerId);
      const plansJson = plans.map(plan => {
        plan.info = JSON.parse(plan.info);
        PlanController.userService.getUserById(ownerId).then((data:User|null) => plan.owner = data!);
        return plan;
      });
      return res.status(200).json(plansJson);
    } catch (error) {
      console.error('Error fetching plans for the user:', error);
      return res.status(500).json({ message: 'Error fetching plans for the user: ' + error });
    }
  }

  static async getGPXFileByPath(req: Request, res: Response) {
    // Assuming 'userId' and 'filePath' are passed as query parameters or URL parameters
    const filePath = req.params.filePath;
    const fullPath = path.resolve(__dirname, `../../uploads/plans/${filePath}`);

    fs.readFile(fullPath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error reading GPX file: ' + err.message });
      }

      // Send the GPX file content
      return res.type('application/gpx+xml').send(data);
    });
  }
}

export default PlanController;
