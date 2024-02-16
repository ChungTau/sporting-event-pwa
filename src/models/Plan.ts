import { BaseModel } from "./BaseModel";
import { Info } from "./GpxData";

interface Plan extends BaseModel {
    name: string;
    thumbnail: string;
    path: string;
    ownerId: number;
    info : string;
}

export default Plan;