import { PointDetails } from "../pages/main/outlets/addEvent/DetailsBox";

export interface Event{
    name: string;
    eventType: string;
    privacy: string;
    maxOfParti: number;
    startDateTime: Date;
    endDateTime?: Date|null;
    backgroundImage: string;
    description: string;
    remark: string;
    geoData: PointDetails;
}