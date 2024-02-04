import { PointDetails } from "../pages/main/outlets/addEvent/DetailsBox";
import { BaseModel } from "./BaseModel";
interface EventData extends BaseModel{
    name: string;
    type: string;
    privacy: string;
    maxOfParti: number;
    startDateTime: Date;
    endDateTime?: Date| undefined;
    backgroundImage?: Blob|undefined;
    description: string;
    remark: string;
    venue: PointDetails;
    file?: Blob|undefined;
    ownerId?: number|null;
}

export default EventData;