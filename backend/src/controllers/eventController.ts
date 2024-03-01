import { Request, Response } from 'express';
import { EventService } from '../service/EventService';
import path from 'path';
import fs from 'fs';

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

      // Check if required fields are missing
      if (!name || !type || !privacy || !startDateTime || !description || !ownerId) {
        return res.status(400).json({
          message: 'Name, Type, Privacy, Start Date Time, Description, and Owner ID are required',
        });
      }

      const gpxFilePath = req.file?.path; // Get file path from request object (using optional chaining)
      const backgroundImagePath = req.file?.path; // Get file path from request object (using optional chaining)

      if (!gpxFilePath || !backgroundImagePath) {
        return res.status(400).json({ message: 'GPX file and background image are required' });
      }

      const backgroundImageBlob = fs.readFileSync(backgroundImagePath);

      const newEvent = await EventController.eventService.createEvent({
        ...req.body,
        gpxFile: gpxFilePath,
        backgroundImage: backgroundImageBlob,
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
      return res.json(event);
    } catch (error) {
      console.error('Error fetching event:', error);
      return res.status(500).json({ message: 'Error fetching event: ' + error });
    }
  }

  static async updateEvent(req: Request, res: Response) {
    try {
      const eventId = parseInt(req.params.id);
      const success = await EventController.eventService.updateEvent(eventId, req.body);
      if (!success) {
        return res.status(404).json({ message: 'Event not found' });
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

  static async getGPXFileByPath(req: Request, res: Response) {
    // Assuming 'userId' and 'filePath' are passed as query parameters or URL parameters
    const userId = req.params.userId;
    const filePath = req.params.filePath;
    const fullPath = path.resolve(__dirname, `../../uploads/events/${userId}/`, filePath);

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

export default EventController;
