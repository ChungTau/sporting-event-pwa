import {Info} from "@/types/infoType";

import {
    length,
    bbox,
    lineString,
    Feature,
    Position,
    LineString,
    MultiLineString,
    Properties,
    along,
    lineSlice,
    point
    //@ts-ignore
} from '@turf/turf';
import mapboxgl from "mapbox-gl";
import {MapRef} from "react-map-gl";

export const MAP_PADDING = {
    top: 80,
    bottom: 80,
    left: 104,
    right: 40
};

export const terrainRate = 1.25;

export function processGeoJSON(geoJSON : any) {
    let totalDistance = 0;
    let totalClimb = 0;
    let totalFall = 0;
    let highestPoint = -Infinity;
    let lowestPoint = Infinity;
    const waypoints : Feature[] = [];
    const processLineStringCoords = (coords : Position[]) => {
        for (let i = 0; i < coords.length - 1; i++) {
            const from = coords[i]as Position;
            const to = coords[i + 1]as Position;

            // Distance
            const lineSegment = lineString([from, to]);
            totalDistance += length(lineSegment, {units: 'kilometers'});

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

    geoJSON
        .features
        .forEach((feature : Feature) => {
            if (feature.geometry.type === 'LineString') {
                const coords = feature.geometry.coordinates as Position[];
                processLineStringCoords(coords);
            } else if (feature.geometry.type === 'MultiLineString') {
                const lineStrings = feature.geometry.coordinates as Position[][];
                lineStrings.forEach(coords => processLineStringCoords(coords));
            } else if (feature.geometry.type === 'Point') {
                waypoints.push(feature);
            }
        });

    return {
        distance: totalDistance,
        climb: totalClimb,
        fall: totalFall,
        max: highestPoint,
        min: lowestPoint,
        waypoints: waypoints
    } as Info;
}

export const extractMetadata = (xml : Document) => {
    const metadataElement = xml.querySelector("metadata");
    const name = metadataElement
        ?.querySelector("name")
            ?.textContent || "";
    const author = metadataElement
        ?.querySelector("author > name")
            ?.textContent || "";
    return {name, author};
};

function addLineToMap(map : mapboxgl.Map, sourceId : string, layerId : string, data : Feature < LineString, Properties > | LineString) {
    if (map.getSource(sourceId)) {
        const source : mapboxgl.GeoJSONSource = map.getSource(sourceId)as mapboxgl.GeoJSONSource;
        console.log('Add Line To Map');
        source.setData(data);
    } else {
        map.addSource(sourceId, {
            type: 'geojson',
            data: data
        });

        map.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            paint: {
                'line-color': '#FF0000',
                'line-width': 2
            }
        });
    }
}

export function updateLineToMap(map : mapboxgl.Map, sourceId : string, layerId : string, data : Feature < LineString, Properties > | LineString, color : string) {
    if (map.getSource(sourceId)) {
        const source : mapboxgl.GeoJSONSource = map.getSource(sourceId)as mapboxgl.GeoJSONSource;

        source.setData(data);
    } else {
        map.addSource(sourceId, {
            type: 'geojson',
            data: data
        });
    }

    if (!map.getLayer(layerId)) {
        map.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            paint: {
                'line-color': color,
                'line-width': 2
            }
        });
    }
}

export function addRouteToMap(mapview : MapRef, currentRoute : Feature < MultiLineString, Properties > | Feature < LineString, Properties > | null) {
    const map = mapview.getMap();
    let sourceIdCounter = 1;
    let layerIdCounter = 1;

    if (currentRoute.geometry.type === 'LineString') {
        while (map.getSource(`source${sourceIdCounter}`)) {
            sourceIdCounter++;
        }
        const sourceId = `source${sourceIdCounter}`;
        addLineToMap(map, sourceId, 'lineLayer', currentRoute);
    } else if (currentRoute.geometry.type === 'MultiLineString') {
        currentRoute
            .geometry
            .coordinates
            .forEach((coords : Position[]) => {
                while (map.getSource(`source${sourceIdCounter}`)) {
                    sourceIdCounter++;
                }
                const sourceId = `source${sourceIdCounter}`;
                const layerId = `layer${layerIdCounter}`;
                addLineToMap(map, sourceId, layerId, lineString(coords));
                layerIdCounter++;
            });
    }

}

export const resizeMap = (mapview : MapRef | undefined, currentRoute : Feature < MultiLineString, Properties > | Feature < LineString, Properties > | null, duration : number = 2600) => {
    if (currentRoute && mapview) {
        const [minLng,
            minLat,
            maxLng,
            maxLat] = bbox(currentRoute);
        setTimeout(() => {
            mapview
                ?.fitBounds([
                    [
                        minLng, minLat
                    ],
                    [maxLng, maxLat]
                ], {
                    padding: MAP_PADDING,
                    duration: duration
                });
        }, 400);
    }
};

export const removeAllRoutes = (mapview : MapRef) => {
    const map = mapview.getMap();
    mapview
        .getStyle()
        .layers
        .forEach((layer) => {
            if (layer.id.startsWith('layer') || layer.id === 'lineLayer') {
                map.removeLayer(layer.id);
            }
        });

    Object
        .keys(map.getStyle().sources)
        .forEach((sourceId) => {
            if (sourceId.startsWith('source')) {
                map.removeSource(sourceId);
            }
        });
};

export const handleMapFullscreenToggle = (mapview : MapRef) => {
    if (mapview) {
        if (!document.fullscreenElement) {
            const mapContainer = mapview.getContainer();
            if (mapContainer.requestFullscreen) {
                mapContainer.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
};


export function lerp(start : number, end : number, t : number) : number {
    return start * (1 - t) + end * t;
}

const calculateZoom = (position : Position, map : mapboxgl.Map | null, defaultZoom : number) : number | undefined => {
    if (map) {
        const currentElevation = map.queryTerrainElevation(position) ?? 1.25;
        return defaultZoom - ((currentElevation / 1.25) / 13) * 0.01;
    }
    return undefined;
};

export const executeFlyTo = (mapInstance : MapRef | undefined, position : Position, durationTime : number, pitch : number, bearing : number, startTime : number, zoom : number, defaultZoom : number) : void => {
    if (mapInstance && position) {
        const zoomLevel = startTime === 0
            ? calculateZoom(position, mapInstance.getMap(), defaultZoom)
            : zoom;
        mapInstance.flyTo({center: position, pitch: pitch, bearing: bearing, duration: durationTime, zoom: zoomLevel});
    }
};

export const calculateAnimationPhase = (distanceOfCurrentRoute : number, time : number, elapsedTime : number, startTime : number, start : number, speed : number = 1) => {
    const totalElapsed = elapsedTime + time - startTime;
    return (totalElapsed - start) / (distanceOfCurrentRoute * 1000) * 0.25 * speed; // Multiply by speed
}

export function removeProgressLines(mapview:MapRef|undefined, progressLine:Position[][]) {
    if (mapview) {
        const map = mapview.getMap();
        if (map) {
            if (map.getLayer('layer_base')) {
                map.removeLayer('layer_base');
                map.removeSource(`progressLineSource0`)
            }else{
                for (let i = 0; i < progressLine.length; i++) {
                    if (map.getSource(`progressLineSource${i}`)) {
                        map.removeLayer(`layer_${i}`);
                        map.removeSource(`progressLineSource${i}`)
                    }
                }
            }
        }
    }
}