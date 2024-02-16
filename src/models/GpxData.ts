import { Feature, LineString, MultiLineString, Properties } from "@turf/turf";

export interface Info{
    distance: number;
    climb: number;
    fall: number;
    max: number;
    min: number;
}

// Interface for the main output of the function
interface GpxData {
    name: string;
    author: string;
    info: Info;
    routes: Feature<MultiLineString, Properties> | Feature<LineString, Properties>; // This is a JSON string representation of a multiLineString
}

export default GpxData;