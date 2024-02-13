import { BaseModel } from "./BaseModel";

interface Plan extends BaseModel {
    name: string;
    thumbnail: string;
    path: Blob;
    ownerId: number;
}

export default Plan;