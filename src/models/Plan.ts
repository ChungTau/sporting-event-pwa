import { BaseModel } from "./BaseModel";
import { Info } from "./GpxData";

interface Plan extends BaseModel {
    name: string;
    thumbnail: string;
    gpxFile: Buffer;
    ownerId: number;
    info : Info;
}

export default Plan;