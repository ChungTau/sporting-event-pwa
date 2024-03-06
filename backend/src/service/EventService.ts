import { Repository } from "typeorm";
import { AppDataSource } from "../config/dbConfig";
import Event from "../models/Event";
import { UserService } from "./UserService";
import { PlanService } from "./PlanService";
import path from "path";
import fs from 'fs';
import mime from 'mime';

export class EventService {
    private repository: Repository<Event>;

    constructor() {
        this.repository = AppDataSource.getRepository(Event);
    }

    async createEvent(eventData: Partial<Event>): Promise<Event | undefined> {
        try {
            const newEvent = this.repository.create(eventData);
            return await this.repository.save(newEvent);
        } catch (error) {
            console.error("Error creating event:", error);
            return undefined;
        }
    }

    async getEvents(): Promise<Event[]> {
        try {
            return await this.repository.find();
        } catch (error) {
            console.error("Error fetching events:", error);
            return [];
        }
    }

    private async processEvent(event: Event): Promise<Event> {
        if (event.venue) {
            event.venue = JSON.parse(event.venue);
        }

        if (event.ownerId) {
            const userService = new UserService();
            event.owner = await userService.getUserById(event.ownerId);
        }

        if (event.planId) {
            const planService = new PlanService();
            event.plan = await planService.getPlanById(event.planId);
        }

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

        return event;
    }

    async getEventById(id: number): Promise<Event | null> {
        try {
            const event = await this.repository.findOneBy({ id });

            if (!event) {
                return null;
            }

            return await this.processEvent(event);
        } catch (error) {
            console.error("Error fetching event by ID:", error);
            throw error;
        }
    }

    async updateEvent(id: number, eventData: Partial<Event>): Promise<boolean> {
        try {
            console.log(eventData);
            const result = await this.repository.update(id, eventData);
            return result.affected !== undefined && result.affected > 0;
        } catch (error) {
            console.error("Error updating event:", error);
            return false;
        }
    }

    async deleteEvent(id: number): Promise<boolean> {
        try {
            const result = await this.repository.delete(id);
            return result.affected !== null && result.affected !== undefined && result.affected > 0;
        } catch (error) {
            console.error("Error deleting event:", error);
            return false;
        }
    }

    async getEventsByOwnerId(ownerId: number): Promise<Event[]> {
        try {
            const events = await this.repository.find({ where: { ownerId } });
            return await Promise.all(events.map(async (event) => {
                return await this.processEvent(event);
            }));
        } catch (error) {
            console.error("Error fetching events by owner ID:", error);
            return [];
        }
    }
}
