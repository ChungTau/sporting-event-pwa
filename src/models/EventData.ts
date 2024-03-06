import { PointDetails } from "../pages/main/outlets/addEvent/DetailsBox";
import { BaseModel } from "./BaseModel";
import GpxData from "./GpxData";

interface EventData extends BaseModel{
    name: string;
    type: string;
    privacy: string;
    maxOfParti: number;
    startDateTime: Date;
    endDateTime?: Date|null;
    backgroundImage: Buffer | null;
    description: string;
    remark: string;
    venue: PointDetails;
    route?: GpxData;
}

export default EventData;