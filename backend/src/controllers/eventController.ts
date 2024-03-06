import { Request, Response } from 'express';
import { EventService } from '../service/EventService';

class EventController {
  private static eventService = new EventService();

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

      if (!name || !type || !privacy || !startDateTime || !description || !ownerId) {
        return res.status(400).json({
          message: 'Name, Type, Privacy, Start Date Time, Description, and Owner ID are required',
        });
      }

      const backgroundImage = req.file as Express.Multer.File;
      if (!backgroundImage) {
        return res.status(400).json({
          message: 'Background Image is required'
        });
      }

      const newEvent = await EventController.eventService.createEvent({
        ...req.body,
        backgroundImage: backgroundImage.path,
      });

      if (!newEvent) {
        return res.status(500).json({ message: 'Error creating event' });
      }

      return res.status(201).json(newEvent);
    } catch (error) {
      console.error('Error creating event:', error);
      return res.status(500).json({ message: 'Error creating event: ' + error });
    }
  }

  static async getEvents(_req: Request, res: Response) {
    try {
      const events = await EventController.eventService.getEvents();
      return res.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      return res.status(500).json({ message: 'Error fetching events: ' + error });
    }
  }

  static async getEventById(req: Request, res: Response) {
    try {
      const eventId = parseInt(req.params.id);
      const event = await EventController.eventService.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      return res.status(200).json(event);;
    } catch (error) {
      console.error('Error fetching event:', error);
      return res.status(500).json({ message: 'Error fetching event: ' + error });
    }
  }

  static async updateEvent(req: Request, res: Response) {
    try {
      const {id, planId} = req.body;
      console.log(req.body);
      const success = await EventController.eventService.updateEvent(id, {planId});
      if (!success) {
        return res.status(404).json({ message: 'Event not found', id });
      }
      return res.status(200).json({ message: 'Event updated successfully' });
    } catch (error) {
      console.error('Error updating event:', error);
      return res.status(500).json({ message: 'Error updating event: ' + error });
    }
  }

  static async deleteEvent(req: Request, res: Response) {
    try {
      const eventId = parseInt(req.params.id);
      const success = await EventController.eventService.deleteEvent(eventId);
      if (!success) {
        return res.status(404).json({ message: 'Event not found' });
      }
      return res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      return res.status(500).json({ message: 'Error deleting event: ' + error });
    }
  }

  static async getEventsByOwnerId(req: Request, res: Response) {
    try {
      const ownerId = parseInt(req.params.ownerId);
      const events = await EventController.eventService.getEventsByOwnerId(ownerId);
      return res.status(200).json(events);
    } catch (error) {
      console.error('Error fetching events for the user:', error);
      return res.status(500).json({ message: 'Error fetching events for the user: ' + error });
    }
  }
}

export default EventController;
