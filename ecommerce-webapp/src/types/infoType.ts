//@ts-ignore
import { Feature, MultiLineString, LineString, Properties } from '@turf/turf';

export interface Info{
    distance: number;
    climb: number;
    fall: number;
    max: number;
    min: number;
    waypoints: Feature[];
}