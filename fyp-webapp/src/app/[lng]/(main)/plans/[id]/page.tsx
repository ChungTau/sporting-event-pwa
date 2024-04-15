'use client';

import PrivateRoute from "@/components/PrivateRoute";
import { PlanDetails, PlanMapView } from "@/containers/plan-page";
import { useGpxDataStore } from "@/store/useGpxDataStore";
import { extractMetadata, processGeoJSON } from "@/utils/map";
import { gpx } from "@tmcw/togeojson";
import { useEffect } from "react";

function PlanIdPage({params} : {
    params: {
        id: number
    }
}){
    const {setXML, init, reset, setInPage} = useGpxDataStore();
    useEffect(() => {
        const fetchPlan = async() => {
            try {
                if (!params.id) {
                    throw new Error("User ID not found");
                }

                const response = await fetch(`/api/plans/${params.id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch plan");
                }

                const data = await response.json();
                const xmlString = data.gpxFile;
                const parser = new DOMParser();
                const xml = parser.parseFromString(xmlString, 'text/xml');
                const {name, author} = extractMetadata(xml);
                const geojson = gpx(xml);
                const info = processGeoJSON(geojson);
                const routes = geojson.features[0];
                init({name, author, info, routes});
                setXML(xml);
                setInPage("event");
            } catch (error) {
                console.error("Error fetching plans:", error);
            }
        };

        fetchPlan();
        
    }, [params.id]);

    useEffect(() => {
        return () => {
            reset();
        };
    }, [reset]);

    return(
        <PrivateRoute>
            <div className="w-full h-full flex flex-col gap-4">
                <div className="w-full h-auto min-h-[500px] relative rounded-lg overflow-clip">
                    <PlanMapView/>
                </div>
                <PlanDetails isCreating={false}/>
            </div>
        </PrivateRoute>
    );
};

export default PlanIdPage;