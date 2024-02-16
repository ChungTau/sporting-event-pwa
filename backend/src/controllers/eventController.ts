import { Request, Response } from 'express';
import Event from '../models/Event';
import path from 'path';
import fs from 'fs';
import mime from 'mime';
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
            const files= req.files as  {[fieldname: string]: Express.Multer.File[]};
            if (files !== null) {
                if(files['gpx']){
                    gpxFilePath = files['gpx'][0].path;
                }else if (files['backgroundImage']){
                    backgroundImagePath = files['backgroundImage'][0].path;
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
    

    static async getEvents(_req: Request, res: Response) {
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

    static async getEventsByOwnerId(req: Request, res: Response): Promise<Response | void> {
        const ownerId = parseInt(req.params.ownerId);
        try {
            const events = await Event.findAll({
                where: {
                    ownerId: ownerId
                }
            });
    
            if (events.length === 0) {
                return res.status(404).json({ message: 'No events found for this user.' });
            }
    
            const eventsJson = events.map(event => {
                event.venue = JSON.parse(event.venue);
                // Convert backgroundImage to base64
                if (event.backgroundImage) {
                    const fullPath = path.resolve(__dirname, `../../`, event.backgroundImage);
                    if (fs.existsSync(fullPath)) {
                        const mimeType = mime.lookup(fullPath);
                        if (mimeType) {
                            const fileData = fs.readFileSync(fullPath);
                            const base64Image = Buffer.from(fileData).toString('base64');
                            event.backgroundImage = `data:${mimeType};base64,${base64Image}`;
                        }
                    }
                }
    
                // Return the event as a plain object
                return event.toJson();
            });
    
            return res.status(200).json(eventsJson);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching events for the user: ' + error });
        }
    }
    
}

export default EventController;