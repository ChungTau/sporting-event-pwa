import { Request, Response } from 'express';
import Event from '../models/Event';

class EventController {
    static async createEvent(req: Request, res: Response) {
        try {
            const {
                name,
                type,
                privacy,
                startDateTime,
                description,
                ownerId,
            } = req.body;
    
            // Initialize variables for file paths
            let gpxFilePath = '';
            let backgroundImagePath = '';
    
            // Check if a GPX file was uploaded
            if (req.file) {
                console.log(req.file);
                //res.send(req.file);
                if (req.file.fieldname === 'gpxFile') {
                    gpxFilePath = req.file.path; // Set the GPX file path
                } else if (req.file.fieldname === 'backgroundImage') {
                    backgroundImagePath = req.file.path; // Set the background image file path
                }
            }
    
            if (
                !name ||
                !type ||
                !privacy ||
                !startDateTime ||
                !description ||
                !ownerId
            ) {
                return res.status(400).json({
                    message:
                        'Name, Type, Privacy, Max of Parti, Start Date Time, Description, Owner ID, and GPX file are required',
                });
            }
    
            // Create a new Event instance and set the properties explicitly
            const event = await Event.create({
                ...req.body,
                file: gpxFilePath, // Use the GPX file path here
                backgroundImage: backgroundImagePath, // Use the background image file path here
            });
    
            // Save the Event instance to the database using Sequelize
            try {
                await event.save();
                return res.status(201).json(event);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error creating event: ' + error });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error creating event: ' + error });
        }
    }
    

    static async getEvents(res: Response) {
        try{
            const events = await Event.findAll();
            return res.status(201).json(events);
        }catch(error){
            console.error(error);
            return res.status(500).json({message: 'Error fetching users: '+error});
        }
    }

    static async getEventsById(req: Request, res: Response){
        const eventId = req.params.id;
        try{
            const event = await Event.findByPk(eventId);
            if(!event){
                return res.status(404).json({ message: 'Event not found' });
            }else{
                return res.status(201).json(event);
            }
        }catch(error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching event' });
        }
    }

    static async updateEvent(req:Request, res: Response) {
        const eventId = req.params.id;
        try{
            const [updatedRowsCount] = await Event.update(req.body, {where: {id: eventId}});
            if(updatedRowsCount === 0){
                return res.status(404).json({ message: 'Event not found' });
            } else {
                return res.status(201).json({ message: 'Event updated successfully' });
            }
        }catch(error){
            console.error(error);
            return res.status(500).json({ message: 'Error updating event' });
        }
    }

    static async deleteEvent(req:Request, res: Response) {
        const eventId = req.params.id;
        try{
            const deletedRowCount = await Event.destroy({where: {id:eventId}});
            if(deletedRowCount === 0){
                return res.status(404).json({message: 'Event not found'});
            }else{
                return res.json({ message: 'User deleted successfully' });
            }
        }catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error deleting user' });
        }
    }
}

export default EventController;