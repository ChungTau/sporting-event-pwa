import { BaseModel } from "./BaseModel";

interface Plan extends BaseModel {
    name: string;
    thumbnail: string;
    gpxFile: Buffer;
    ownerId: number;
    info : string;
}

export default Plan;