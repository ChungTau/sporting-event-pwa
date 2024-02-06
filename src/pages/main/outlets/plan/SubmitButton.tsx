import { Button, Text } from "@chakra-ui/react";
import { COLOR_PRIMARY_RGB } from "../../../../constants/palatte";
import { useMap } from "../../../../contexts/MapContext";
import { useGPX } from "../../../../contexts/GPXContext";

const SubmitButton = () => {
    const map = useMap();
    const gpx = useGPX();

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
        //gpx.setGPXXML(xmlDoc);
        console.log(xmlDoc);
        console.log("Markers saved to GPX XML.");
    };
    
    
    
    return(
        <Button onClick={()=>{
            console.log(map.markers);
            console.log(gpx.gpxState.xml);
            addMarkersToXML();
        }} bgColor={`rgba(${COLOR_PRIMARY_RGB}, 0.7)`} _hover={{bgColor:`rgba(${COLOR_PRIMARY_RGB}, 0.8)`}} _active={{bgColor:`rgba(${COLOR_PRIMARY_RGB}, 0.9)`}}>
            <Text color={'white'}>Save</Text>
        </Button>
    );
};

export default SubmitButton;