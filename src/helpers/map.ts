import { Feature, LineString, MultiLineString, Properties, bbox, lineString } from "@turf/turf";
//@ts-ignore
import mapboxgl from 'mapbox-gl';
import { MAP_PADDING } from "../constants/map";

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