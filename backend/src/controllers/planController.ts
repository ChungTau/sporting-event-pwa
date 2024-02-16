import { Request, Response } from 'express';
import Plan from '../models/Plan';
import path from 'path';
import fs from 'fs';
class PlanController {
    static async createPlan(req: Request, res: Response) {
        try {
            const {
                name,
                ownerId,
                thumbnail,
                info
            } = req.body;
    
            // Initialize variables for file paths

            // Check if a GPX file was uploaded
            const file= req.file as  Express.Multer.File;
            if (file == null) return;
    
            if (
                !name ||
                !thumbnail ||
                !info ||
                !ownerId
            ) {
                return res.status(400).json({
                    message:
                        'Name, Owner ID, and GPX file are required',
                });
            }
    
            // Create a new Event instance and set the properties explicitly
            const plan = await Plan.create({
                ...req.body,
                path: file.path, 
            });
    
            // Save the Event instance to the database using Sequelize
            try {
                await plan.save();
                return res.status(201).json(plan);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error creating plan: ' + error });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error creating plan: ' + error });
        }
    }
    

    static async getPlans(_req: Request, res: Response) {
        try{
            const plans = await Plan.findAll();
            return res.status(201).json(plans);
        }catch(error){
            console.error(error);
            return res.status(500).json({message: 'Error fetching plans: '+error});
        }
    }

    static async getPlansById(req: Request, res: Response){
        const planId = req.params.id;
        try{
            const plan = await Plan.findByPk(planId);
            if(!plan){
                return res.status(404).json({ message: 'Plan not found' });
            }else{
                return res.status(201).json(plan);
            }
        }catch(error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching plan' });
        }
    }

    static async updatePlan(req:Request, res: Response) {
        const planId = req.params.id;
        try{
            const [updatedRowsCount] = await Plan.update(req.body, {where: {id: planId}});
            if(updatedRowsCount === 0){
                return res.status(404).json({ message: 'Plan not found' });
            } else {
                return res.status(201).json({ message: 'Plan updated successfully' });
            }
        }catch(error){
            console.error(error);
            return res.status(500).json({ message: 'Error updating plan' });
        }
    }

    static async deletePlan(req:Request, res: Response) {
        const planId = req.params.id;
        try{
            const deletedRowCount = await Plan.destroy({where: {id:planId}});
            if(deletedRowCount === 0){
                return res.status(404).json({message: 'Plan not found'});
            }else{
                return res.json({ message: 'Plan deleted successfully' });
            }
        }catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error deleting plan' });
        }
    }

    // Add this method inside the PlanController class

static async getPlansByOwnerId(req: Request, res: Response) {
    const ownerId = parseInt(req.params.ownerId);
    try {
        const plans = await Plan.findAll({
            where: {
                ownerId: ownerId
            }
        });

        if (plans.length === 0) {
            return res.status(404).json({ message: 'No plans found for this user.' });
        }

        return res.status(200).json(plans);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching plans for the user: ' + error });
    }
}

static async getGPXFileByPath(req: Request, res: Response) {
    // Assuming 'userId' and 'filePath' are passed as query parameters or URL parameters
    const userId = req.params.userId;
    const filePath = req.params.filePath;
    const fullPath = path.resolve(__dirname, `../../uploads/plans/${userId}/`, filePath);

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