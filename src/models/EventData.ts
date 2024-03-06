import { PointDetails } from "../pages/main/outlets/addEvent/DetailsBox";
import { BaseModel } from "./BaseModel";
import Plan from "./Plan";
import User from "./User";
interface EventData extends BaseModel{
    name: string;
    type: string;
    privacy: string;
    maxOfParti: number;
    startDateTime: string;
    endDateTime?: string| undefined;
    backgroundImage?: string | null;
    description: string;
    remark: string;
    venue: PointDetails;
    plan?: Plan|undefined;
    owner?: User|undefined;
    participant?: User[]|[];
}

export default EventData;