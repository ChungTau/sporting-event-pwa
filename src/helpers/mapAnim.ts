import { FeatureCollection, Point, Position, Properties, nearestPoint, point } from "@turf/turf";
//@ts-ignore
import mapboxgl from 'mapbox-gl';

export const calculateAnimationPhase = (distanceOfCurrentRoute: number, time: number, elapsedTime: any, startTime: any, start: any, speed: number = 1) => {
    const totalElapsed = elapsedTime.current + time - startTime.current;
    return (totalElapsed - start.current) / (distanceOfCurrentRoute * 1000) * 0.45 * speed;  // Multiply by speed
}

function getElevationForPosition(position: Position, coordinates: any[]): number {
    const targetPoint = point(position);
    const pointsGeoJSON = {
        type: 'FeatureCollection',
        features: coordinates.map(coord => point(coord))
    } as FeatureCollection<Point, Properties>;
    const nearest = nearestPoint(targetPoint, pointsGeoJSON);
    return nearest.geometry.coordinates[2]; // this will be the elevation
}

export const computeElevationChange = (lastPosition: Position, currentPosition: Position, routeCoordinates: any, data: any) => {
    if(data.info.climb !== 0) {
        const lastElevation = getElevationForPosition(lastPosition, routeCoordinates);
        const currentElevation = getElevationForPosition(currentPosition, routeCoordinates);
        return currentElevation - lastElevation;
    }
    return 0;
}

const calculateZoom = (position: Position, mapInstance: mapboxgl.Map | undefined, defaultZoom:number): number => {
    const currentElevation = mapInstance.queryTerrainElevation(position) ?? 1.25;
    return defaultZoom - ((currentElevation / 1.25) / 13) * 0.01;
};

export const executeFlyTo = (mapInstance: mapboxgl.Map | undefined, position: Position, durationTime: number, pitch: number, bearing: number, startTime: number, zoomRef: React.MutableRefObject<number>, defaultZoom: number): void => {
    if (mapInstance && position) {
        const zoomLevel = startTime === 0 ? calculateZoom(position, mapInstance, defaultZoom) : zoomRef.current;
        mapInstance.flyTo({
            center: position,
            pitch: pitch,
            bearing: bearing,
            duration: durationTime,
            zoom: zoomLevel
        });
    }
};