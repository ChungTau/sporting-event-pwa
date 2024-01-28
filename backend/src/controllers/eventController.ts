import { Request, Response } from 'express';
import { Event } from '../models/Event';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../config/dbConfig';

class EventController {
  // Create a new event
  static async createEvent(req: Request, res: Response) {
    try {
      const { name, eventType, privacy, maxOfParti, startDateTime, endDateTime, backgroundImage, description, remark, geoData} = req.body;
      if (!(req.body.name&&req.body.eventType)) {
        return res.status(400).json({ message: 'name and eventType is required' });
      }
      const event = await Event.create({ name, eventType, privacy, maxOfParti, startDateTime, endDateTime, backgroundImage, description, remark, geoData  });
      return res.status(201).json(event);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error creating event' });
    }
  }
  

  // Get all events
  static async getEvents(res: Response) {
    try {
      const events = await Event.findAll();
      res.json(events);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching events' });
    }
  }

  // Get event by name
  static async getEventByName(req: Request, res: Response) {
    const eventName = req.params.name;
    try {
      const event = await Event.findByPk(eventName);
      if (!event) {
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
    const eventName = req.params.name;
    try {
      const [updatedRowsCount] = await Event.update(req.body, {
        where: { id: eventName },
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

  // Delete event by name
  static async deleteEvent(req: Request, res: Response) {
    const eventName = req.params.name;
    try {
      const deletedRowCount = await Event.destroy({
        where: { id: eventName },
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
