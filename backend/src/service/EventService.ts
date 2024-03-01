import { Repository } from "typeorm";
import { AppDataSource } from "../config/dbConfig";
import Event from "../models/Event";

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

    async getEventById(id: number): Promise<Event | null> {
        try {
            return await this.repository.findOneBy({id});
        } catch (error) {
            console.error("Error fetching event by ID:", error);
            throw error;
        }
    }

    async updateEvent(id: number, eventData: Partial<Event>): Promise<boolean> {
        try {
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
            return await this.repository.find({ where: { ownerId } });
        } catch (error) {
            console.error("Error fetching events by owner ID:", error);
            return [];
        }
    }
}
