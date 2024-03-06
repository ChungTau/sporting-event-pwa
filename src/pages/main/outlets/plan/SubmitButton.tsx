import { Button, Text } from "@chakra-ui/react";
import { COLOR_PRIMARY_RGB } from "../../../../constants/palatte";
import { useMap } from "../../../../contexts/MapContext";
import { useGPX } from "../../../../contexts/GPXContext";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import PlanServices from "../../../../services/planServices";
import bbox from '@turf/bbox';
import { Feature, LineString, MultiLineString, Properties, simplify } from "@turf/turf";



const generateMapboxImageUrl = (routes: Feature<MultiLineString | LineString, Properties> | undefined, tolerance: number = 0.01): string => {
    if (!routes) {
        throw new Error("Routes data is undefined");
    }

    // Simplify the routes
    const simplifiedRoutes = simplify(routes, {tolerance});

    // Style the route (e.g., width: 8 pixels, color: orange)
    simplifiedRoutes.properties = {
        ...simplifiedRoutes.properties,
        'stroke': '#e16924', // orange line color
        'stroke-width': 7,   // line width
        'stroke-opacity': 1  // line opacity
    };

    const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN; // Replace with your Mapbox access token
    const style = 'mapbox/streets-v12'; // Or any other style you prefer
    const size = '400x250'; // Image size

    // Calculate bounding box using Turf.js
    const boundingBox = bbox(simplifiedRoutes);
    const encodedGeoJson = encodeURIComponent(JSON.stringify(simplifiedRoutes));

    // Define pitch and padding (customize these values as needed)
    const pitch = 70; // Camera tilt in degrees
    const padding = 40; // Padding around the image in pixels

    const url = `https://api.mapbox.com/styles/v1/${style}/static/geojson(${encodedGeoJson})/[${boundingBox.join(',')}]/${size}?access_token=${accessToken}&pitch=${pitch}&padding=${padding}`;
    return url;
};



const SubmitButton = () => {
    const map = useMap();
    const gpx = useGPX();

    const {user} = useSelector((state : RootState) => state.user);
    const addMarkersToXML = () => {
        if (!map.markers || map.markers.length === 0) {
            console.log("No markers to save.");
            return;
        }
    
        const xmlDoc = gpx.gpxState.xml?.cloneNode(true) as Document | null;
        if (!xmlDoc) {
            console.log("GPX XML document is null.");
            return;
        }
    
        const gpxElement = xmlDoc.querySelector("gpx") as Element | null;
        if (!gpxElement) {
            console.log("No 'gpx' element found in the GPX XML.");
            return;
        }

        // Remove existing <wpt> elements
        const existingWptElements = xmlDoc.querySelectorAll("wpt");
        existingWptElements.forEach((wptElement) => {
            gpxElement.removeChild(wptElement);
        });
    
        // Iterate through markers and create <wpt> elements
        map.markers.forEach((marker) => {
            const { data } = marker;
            if (data) {
                const wptElement = xmlDoc.createElement("wpt");
                wptElement.setAttribute("lat", String(data.position[1]));
                wptElement.setAttribute("lon", String(data.position[0]));
        
                // Add custom field for name
                const nameElement = xmlDoc.createElement("name");
                nameElement.textContent = data.name; // Use the marker's name
                wptElement.appendChild(nameElement);
        
                // Add custom fields for services, if available
                if (data.services && data.services.length > 0) {
                    const servicesElement = xmlDoc.createElement("services");
                    data.services.forEach((service: string) => {
                        const serviceElement = xmlDoc.createElement("service");
                        serviceElement.textContent = service;
                        servicesElement.appendChild(serviceElement);
                    });
                    wptElement.appendChild(servicesElement);
                }
        
                // Add the <wpt> element to the GPX
                gpxElement.appendChild(wptElement);
            }
        });

        // Update the GPX context with the modified XML
        gpx.setGPXXML(xmlDoc);
        //console.log(xmlDoc);
        console.log("Markers saved to GPX XML.");
    };

    const handleSubmit = async () => {
        if (!gpx.gpxState.xml) {
            console.log("GPX XML document is null.");
            return;
        }
    
        // Generate Mapbox Image URL
        const mapboxImageUrl = await generateMapboxImageUrl(gpx.gpxState.data?.routes, 0.002);
        console.log(mapboxImageUrl);
    
        // Convert the XML Document to a string
        const xmlString = new XMLSerializer().serializeToString(gpx.gpxState.xml);
    
        // Create a Blob from the XML string
        const file = new Blob([xmlString], { type: 'application/gpx+xml' });
    
        // Create FormData and append the Blob
        const planFormData = new FormData();
        planFormData.append("name", gpx.gpxState.data?.name || 'UNDEFINED');
        planFormData.append("gpxFile", file);
        planFormData.append("ownerId", user?.id?.toString() || '');
        planFormData.append("thumbnail", mapboxImageUrl);
        if (gpx.gpxState.data?.info) {
            planFormData.append("info", JSON.stringify(gpx.gpxState.data.info));
        }
        console.log(planFormData);
        try {
            const response = await PlanServices.createPlan(planFormData);
            console.log(response);
            if (response) {
                console.log("Plan created successfully!");
            }
        } catch (error) {
            console.error("Error creating plan:", error);
            // Handle error
        }
    };
    
    
    
    
    return(
        <Button onClick={async()=>{
            //console.log(map.markers);
            //console.log(gpx.gpxState.xml);
            await addMarkersToXML();
            await handleSubmit();
        }} bgColor={`rgba(${COLOR_PRIMARY_RGB}, 0.7)`} _hover={{bgColor:`rgba(${COLOR_PRIMARY_RGB}, 0.8)`}} _active={{bgColor:`rgba(${COLOR_PRIMARY_RGB}, 0.9)`}}>
            <Text color={'white'}>Save</Text>
        </Button>
    );
};

export default SubmitButton;