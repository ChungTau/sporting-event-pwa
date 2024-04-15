'use client';

import PrivateRoute from "@/components/PrivateRoute";
import {useState, useEffect, useCallback} from "react";
import {useDropzone} from "react-dropzone";
import {gpx} from "@tmcw/togeojson";
import UploadArea from "@/containers/plan-page/upload-area";
import {
    extractMetadata,
    processGeoJSON,
} from "@/utils/map";
import {useGpxDataStore} from "@/store/useGpxDataStore";
import { PlanMapView } from "@/containers/plan-page";
import PlanDetails from "@/containers/plan-page/plan-details";

const readFile = (file : File, onLoad : (event : ProgressEvent < FileReader >) => void) => {
    const reader = new FileReader();
    reader.onload = onLoad;
    reader.readAsText(file);
};


export default function PlanPage() {
    const [fileSelected,
        setFileSelected] = useState(false);
    const {init, reset, setXML, setInPage} = useGpxDataStore();
    const onDrop = useCallback((acceptedFiles : File[]) => {
        const acceptedFile = acceptedFiles[0];
        if (acceptedFile) {
            readFile(acceptedFile, (event) => {
                const xml = new DOMParser().parseFromString(event.target
                    ?.result as string, "text/xml");
                setXML(xml);
                const {name, author} = extractMetadata(xml);
                const geojson = gpx(xml);
                const info = processGeoJSON(geojson);
                const routes = geojson.features[0];
                init({name, author, info, routes});
                setFileSelected(true);
                setInPage("plan");
            });
        } else {
            setFileSelected(false);
            console.warn("Rejected non-gpx files");
        }
    }, [init]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {
            'application/gpx+xml': ['.gpx']
        },
        maxSize: 5000000
    });

    useEffect(() => {
        return () => {
            setFileSelected(false);
            reset();
        };
    }, [reset]);
    return (
        <PrivateRoute>
            <div className="w-full h-full flex flex-col gap-4">
            <div className="w-full h-auto min-h-[500px] relative rounded-lg overflow-clip">
                {fileSelected && <PlanMapView/>}
                <UploadArea {...{ getInputProps, getRootProps, isDragActive, fileSelected }}/>
            </div>
            {fileSelected && <PlanDetails/>}
           
            </div>
        </PrivateRoute>
    );
}
  


