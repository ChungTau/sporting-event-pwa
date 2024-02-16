import { PointDetails } from "../pages/main/outlets/addEvent/DetailsBox";
import { BaseModel } from "./BaseModel";
interface EventData extends BaseModel{
    name: string;
    type: string;
    privacy: string;
    maxOfParti: number;
    startDateTime: Date;
    endDateTime?: Date| undefined;
    backgroundImage?: string;
    description: string;
    remark: string;
    venue: PointDetails;
    file?: string|undefined;
    ownerId?: number|null;
}

export default EventData;