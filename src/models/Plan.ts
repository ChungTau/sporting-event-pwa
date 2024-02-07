import { BaseModel } from "./BaseModel";

interface Plan extends BaseModel {
    name: string;
    thumbnail: Blob;
    path: Blob;
    ownerId: number;
}

export default Plan;