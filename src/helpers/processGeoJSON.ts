import { Info } from "../models/GpxData";
import * as turf from '@turf/turf';

export function processGeoJSON(geoJSON: any) {
    let totalDistance = 0;
    let totalClimb = 0;
    let totalFall = 0;
    let highestPoint = -Infinity;
    let lowestPoint = Infinity;
    const waypoints: turf.Feature[] = [];
    const processLineStringCoords = (coords: turf.Position[]) => {
        for (let i = 0; i < coords.length - 1; i++) {
            const from = coords[i] as turf.Position;
            const to = coords[i + 1] as turf.Position;

            // Distance
            const lineSegment = turf.lineString([from, to]);
            totalDistance += turf.length(lineSegment, { units: 'kilometers' });

            // Climbs and Falls
            const elevationDifference = to[2] - from[2];
            if (elevationDifference > 0) {
                totalClimb += elevationDifference;
            } else {
                totalFall += Math.abs(elevationDifference);
            }

            // Highest and Lowest points
            highestPoint = Math.max(highestPoint, from[2], to[2]);
            lowestPoint = Math.min(lowestPoint, from[2], to[2]);
        }
    }

    geoJSON.features.forEach((feature: turf.Feature) => {
        if (feature.geometry.type === 'LineString') {
            const coords = feature.geometry.coordinates as turf.Position[];
            processLineStringCoords(coords);
        } else if (feature.geometry.type === 'MultiLineString') {
            const lineStrings = feature.geometry.coordinates as turf.Position[][];
            lineStrings.forEach(coords => processLineStringCoords(coords));
        } else if (feature.geometry.type === 'Point') {
            waypoints.push(feature);
        }
    });

    return {
        distance: totalDistance,
        climb: totalClimb,
        fall :totalFall,
        max: highestPoint,
        min: lowestPoint,
        waypoints: waypoints
    } as Info;
}