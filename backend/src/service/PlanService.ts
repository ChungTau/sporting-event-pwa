import { Repository } from "typeorm";
import { AppDataSource } from "../config/dbConfig";
import Plan from "../models/Plan";

export class PlanService {
    private repository: Repository<Plan>;

    constructor() {
        this.repository = AppDataSource.getRepository(Plan);
    }

    async createPlan(planData: Partial<Plan>): Promise<Plan | undefined> {
        try {
            const newPlan = this.repository.create(planData);
            return await this.repository.save(newPlan);
        } catch (error) {
            console.error("Error creating plan:", error);
            return undefined;
        }
    }

    async getPlans(): Promise<Plan[]> {
        try {
            return await this.repository.find();
        } catch (error) {
            console.error("Error fetching plans:", error);
            return [];
        }
    }

    async getPlanById(id: number): Promise<Plan | null> {
        try {
            return await this.repository.findOneBy({id});
        } catch (error) {
            console.error("Error fetching plan by ID:", error);
            throw error;
        }
    }

    async updatePlan(id: number, planData: Partial<Plan>): Promise<boolean> {
        try {
            const result = await this.repository.update(id, planData);
            return result.affected !== undefined && result.affected > 0;
        } catch (error) {
            console.error("Error updating plan:", error);
            return false;
        }
    }

    async deletePlan(id: number): Promise<boolean> {
        try {
            const result = await this.repository.delete(id);
            return result.affected !== null && result.affected !== undefined && result.affected > 0;
        } catch (error) {
            console.error("Error deleting plan:", error);
            return false;
        }
    }

    async getPlansByOwnerId(ownerId: number): Promise<Plan[]> {
        try {
            return await this.repository.find({ where: { ownerId } });
        } catch (error) {
            console.error("Error fetching plans by owner ID:", error);
            return [];
        }
    }
}