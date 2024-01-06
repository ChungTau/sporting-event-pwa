import { Feature, LineString, MultiLineString, Position, Properties, bbox, lineString, multiLineString, nearestPointOnLine, point, pointOnLine } from "@turf/turf";
//@ts-ignore
import mapboxgl from 'mapbox-gl';
import { MAP_PADDING } from "../constants/map";
export type RouteFeature = Feature<LineString> | Feature<MultiLineString>;
export type RouteCoordinates = Position[] | Position[][];
export const addLayersToMap = (mapRef: React.RefObject<mapboxgl.Map>, color:string, routes:Feature<MultiLineString, Properties> | Feature<LineString, Properties> | undefined) : void => {
    const addLayers = () => {
        if (routes
            ?.geometry.type === "LineString") {
            const layerId = `routeLayer`;
            addLineLayer(layerId, mapRef, color, routes);
            //updateLayerOpacity(mapInstance, layerId);
        } else if (routes
            ?.geometry.type === "MultiLineString") {
                routes
                .geometry
                .coordinates
                .forEach((route, index) => {
                    const layerId = `routeLayer${index}`;
                    addLineLayer(layerId, mapRef, color, lineString(route));
                    //updateLayerOpacity(mapInstance, layerId);
                });
        }
    };
    addLayers();

};

export const resizeMap =(routes:Feature<MultiLineString, Properties> | Feature<LineString, Properties> | undefined, mapRef: React.RefObject<mapboxgl.Map>) =>{
    if (routes && mapRef.current
        ?.getMapInstance()) {
        const [minLng,
            minLat,
            maxLng,
            maxLat] = bbox(routes);
        setTimeout(() => {
            mapRef.current
                ?.getMapInstance()
                    ?.fitBounds([
                        [
                            minLng, minLat
                        ],
                        [maxLng, maxLat]
                    ], {
                        padding: MAP_PADDING,
                        duration: 2600,
                    });
        }, 400);
    }
};

export const addLineLayer = (
    customId: string | undefined,
    mapRef: React.RefObject<mapboxgl.Map>,
    color: string,
    route: Feature<LineString, Properties> | Feature<MultiLineString, Properties>
  ) => {
    let id = customId;
  
    if (!id) {
      let idCounter = 1;
      while (mapRef.current.getMapInstance().getSource(`line${idCounter}`)) {
        idCounter++;
      }
      id = `line${idCounter}`;
    }
 
    if (mapRef.current.getMapInstance().getSource(id)) {
      const source = mapRef.current.getMapInstance().getSource(id);
      source.setData(route);
    } else {
      mapRef.current.getMapInstance().addSource(id, {
        type: 'geojson',
        data: route
      });
  
      mapRef.current.getMapInstance().addLayer({
        type: 'line',
        source: id,
        id: id,
        paint: {
          'line-color': color,
          'line-width': 4,
          'line-opacity': 0.8
        }
      });
    }
  };


  export const removeAllRoutes = (mapRef: React.RefObject<mapboxgl.Map>) => {
    const mapInstance = mapRef.current?.getMapInstance();
    if (!mapInstance) return;

    mapInstance.getStyle().layers.forEach((layer: any) => {
        if (layer.id.startsWith('routeLayer')) {
            // Remove the layer
            mapInstance.removeLayer(layer.id);
            // Remove the corresponding source if it exists
            if (mapInstance.getSource(layer.id)) {
                mapInstance.removeSource(layer.id);
            }
        }
    });
};

export function calculateElevationGainToPoint(routeFeature: RouteFeature, targetPoint: [number, number]|Position|Position[]): number {
  let totalElevationGain = 0;
  let previousElevation: number | null = null;

  for (const coord of routeFeature.geometry.coordinates) {
      const [lng, lat, ele] = coord;
      
      if (previousElevation !== null && ele as number > previousElevation) {
          totalElevationGain += ele as number - previousElevation;
      }

      previousElevation = ele as number;

      // Stop the loop once the target point is reached or passed
      if (lng as number === targetPoint[0] && lat as number === targetPoint[1]) {
          break;
      }
  }

  return totalElevationGain;
}

function getRouteCoordinates(routeFeature: RouteFeature): Position[] {
  return routeFeature.geometry.type === 'LineString' ? 
      routeFeature.geometry.coordinates : 
      routeFeature.geometry.coordinates.flat(1);
}

export function findNearestPointOnRoute(markerLngLat: any, route: Feature<MultiLineString, Properties> | Feature<LineString, Properties>): Position | null {
    const pt = point([markerLngLat.lng, markerLngLat.lat]);
    let nearest;

    if (route.geometry.type === 'LineString') {
        const line = lineString(route.geometry.coordinates as Position[]);
        nearest = nearestPointOnLine(line, pt);
    }
    // Check if it's a MultiLineString
    else if (route.geometry.type === 'MultiLineString') {
        const multiLine = multiLineString(route.geometry.coordinates as Position[][]);
        nearest = nearestPointOnLine(multiLine, pt);
    }

    return nearest ? nearest.geometry.coordinates : null;
}


export function calculateDistanceAlongRoute(pt: Position, routeFeature: RouteFeature): number {
    const line = lineString(getRouteCoordinates(routeFeature));
    const along = pointOnLine(line, point(pt));
    return along.properties.location!;
}

export function getElevationAtPoint(routeFeature: RouteFeature, point: Position): number | null {

  for (const coord of routeFeature.geometry.coordinates) {
      const [routeLng, routeLat, ele] = coord;
      if (routeLng === point[0] && routeLat === point[1]) {
          return ele as number;
      }
  }
  return null; // Return null if no matching point is found
}

export function sortMarkers(markersArray: mapboxgl.Marker[], routes:RouteFeature)  {
  return markersArray.map(marker => {
      const lngLat = marker.getLngLat();
      return {
          marker,
          distance: calculateDistanceAlongRoute([lngLat.lng, lngLat.lat], routes)
      };
  }).sort((a, b) => a.distance - b.distance)
    .map(item => item.marker);
};