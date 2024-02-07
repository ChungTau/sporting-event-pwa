import { Request, Response } from 'express';
import Plan from '../models/Plan';

class PlanController {
    static async createPlan(req: Request, res: Response) {
        try {
            const {
                name,
                path,
                ownerId,
            } = req.body;
    
            // Initialize variables for file paths
            let gpxFilePath = '';
    
            // Check if a GPX file was uploaded
            const files= req.files as  {[fieldname: string]: Express.Multer.File[]};
            if (files !== null) {
                if(files['gpx']){
                    gpxFilePath = files['gpx'][0].path;
                }
            }
    
            if (
                !name ||
                !path ||
                !ownerId
            ) {
                return res.status(400).json({
                    message:
                        'Name, Type, Privacy, Max of Parti, Start Date Time, Description, Owner ID, and GPX file are required',
                });
            }
    
            // Create a new Event instance and set the properties explicitly
            const plan = await Plan.create({
                ...req.body,
                file: gpxFilePath, 
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
}

export default PlanController;