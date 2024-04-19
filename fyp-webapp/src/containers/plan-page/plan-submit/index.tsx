import { Button } from "@/components/ui/button";
import { useGpxDataStore } from "@/store/useGpxDataStore";
import { useMarkerStore } from "@/store/useMarkerStore";
//@ts-ignore
import bbox from '@turf/bbox';
//@ts-ignore
import { Feature, LineString, MultiLineString, Properties, simplify } from "@turf/turf";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import ResponseDialog from "../../../components/dialog/ResponseDialog";
import { SubmissionStatus } from "@/types/submissionStatus";

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

    const accessToken = process.env.MapboxAccessToken; // Replace with your Mapbox access token
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

function PlanSubmit(){
    const {markers} = useMarkerStore();
    const {xml, setXML, name, routes, info} = useGpxDataStore();
    const [readyToSubmit, setReadyToSubmit] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(SubmissionStatus.Inactive);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const session = useSession();
    const addMarkersToXML = () => {
        if (markers && markers.length === 0) {
            console.log("No markers to save.");
            return;
        }
    
        const xmlDoc = xml?.cloneNode(true) as Document | null;
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
        markers.slice(1, -1).forEach((marker) => {
            const { data } = marker;
            console.log(data);
            if (data) {
                const wptElement = xmlDoc.createElement("wpt");
                wptElement.setAttribute("lat", String(data.position[1]));
                wptElement.setAttribute("lon", String(data.position[0]));
        
                // Add custom field for name
                const nameElement = xmlDoc.createElement("name");
                nameElement.textContent = data.name!; // Use the marker's name
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
        setXML(xmlDoc);
        //console.log(xmlDoc);
        console.log("Markers saved to GPX XML.");
        setReadyToSubmit(true);
    };

    useEffect(() => {
        if (readyToSubmit) {
            handleSubmit();
            setReadyToSubmit(false); // Reset state to avoid re-running handleSubmit
        }
    }, [readyToSubmit]);

    const handleSubmit = async () => {
        if (!xml) {
            console.log("GPX XML document is null.");
            setSubmissionStatus(SubmissionStatus.Error);
            return;
        }
        setSubmissionStatus(SubmissionStatus.Loading);
        setIsModalOpen(true);
    
        // Generate Mapbox Image URL
        const mapboxImageUrl = await generateMapboxImageUrl(routes, 0.002);
        console.log(mapboxImageUrl);
    
        // Convert the XML Document to a string
        const xmlString = new XMLSerializer().serializeToString(xml);
    
        try {
            const userId = (session.data?.user as any).id;
            console.log(session.data);
        if (!userId) {
            console.error("User ID not found in session data.");
            setSubmissionStatus(SubmissionStatus.Error);
            return;
        }
        

            const response = await fetch('/api/plans',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name || 'UNDEFINED',
                    gpxFile: xmlString,
                    thumbnail: mapboxImageUrl,
                    info: info,
                    ownerId: userId
                })
            });
            if (response.ok) {
                setSubmissionStatus(SubmissionStatus.Finished);
            }else{
                console.error("Failed to create plan.");
                setSubmissionStatus(SubmissionStatus.Error);
            }
        } catch (error) {
            console.error("Error creating plan:", error);
            setSubmissionStatus(SubmissionStatus.Error);
        }
    };

    return(
        <Fragment>
            <Button onClick={addMarkersToXML} className="w-full h-10 mt-8 text-lg ">
            Submit
        </Button>
        <ResponseDialog open={isModalOpen} status={submissionStatus} name="Plan" redirectPath="my-plans"/>
        </Fragment>
    );
}

export default PlanSubmit;