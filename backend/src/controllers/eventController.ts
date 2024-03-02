import { Request, Response } from 'express';
import { Event } from '../models/Event';

class EventController {
  static async createEvent(req: Request<{}, {}, Event>, res: Response) {
    try {
      const {name,type,privacy,maxOfParti,startDateTime,description,remark,venue,ownerId,...rest} = req.body; //now can be " " is fine

      if (!name || !type || !privacy ||maxOfParti<0 ||!startDateTime||!description||!remark||!venue||!ownerId) {
        return res.status(400).json({ message: 'Eventname, type, privacy, maxOfParti, startDateTime, description, remark, venue and ownerId are required' });
      }

      const existingEvent = await Event.findOne({ where: { name } });
      if (existingEvent) {
        return res.status(400).json({ message: 'Event is already exist' });
      }

      const event = await Event.create({name,type,privacy,maxOfParti,startDateTime,description,remark,venue,ownerId,...rest});
  
      return res.status(201).json(event);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error creating event: '+error });
    }
  }
  
  // Get all events
  static async getAllEvents(_req: Request,res: Response) {
    try {
      const events = await Event.findAll()
      res.json(events);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching events' });
    }
  }
  

  // Get event by name
  static async getEventByName(req: Request, res: Response) {
    const name = req.params.name;
    try {
      const event = await Event.findOne({ where: { name } });
      if (!name) {
        res.status(404).json({ message: 'Event not found' });
      } else {
        res.json(event);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching event' });
    }
  }

  // Update event by name 
  static async updateEvent(req: Request, res: Response) {
    const name = req.params.name;
    try {
      const event= req.body;
      const [updatedRowsCount] = await Event.update(event, {
        where: { name: name },
      });
      if (updatedRowsCount === 0) {
        res.status(404).json({ message: 'Event not found' });
      } else {
        res.json({ message: 'Event updated successfully' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating event' });
    }
  }

  // Delete user by Email
  static async deleteEvent(req: Request, res: Response) {
    const name = req.params.name;
    try {
      const deletedRowCount = await Event.destroy({
        where: { name: name },
      });
      if (deletedRowCount === 0) {
        res.status(404).json({ message: 'Event not found' });
      } else {
        res.json({ message: 'Event deleted successfully' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting event' });
    }
  }
}

export default EventController;
