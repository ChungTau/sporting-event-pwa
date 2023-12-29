import {Box, IconButton, Stack, Text} from "@chakra-ui/react";
import styled from "@emotion/styled";
// @ts-ignore
import togeojson from 'togeojson';
import {hongKongCoordinates} from "../../../../constants/map";
import {useMap} from "../../../../contexts/MapContext";
import {useDropzone} from "react-dropzone";
import {Suspense, useCallback, useEffect, useState} from "react";
import Column from "../../../../components/Column";

import {RiUploadCloud2Fill} from "react-icons/ri";
import React from "react";
import FallbackSpinner from "../../../../components/FallbackSpinner";
import {processGeoJSON} from "../../../../helpers/processGeoJSON";
import {GpxData} from "../../../../models/GpxData";
import {useDispatch, useSelector} from "react-redux";
import {setGPXData} from "../../../../store/gpxSlice";
import {RootState} from "../../../../store";
import {addLayersToMap, removeAllRoutes, resizeMap} from "../../../../helpers/map";

const BaseMap = React.lazy(() => import ('../../../../components/BaseMap'));
const MapContainer = styled(Box)({width: '100%', height: '650px'});

export const PlanMapView : React.FC = () => {
    const [fileSelected,
        setFileSelected] = useState(false);
    const mapRef = useMap();
    const dispatch = useDispatch();
    const {data} = useSelector((state : RootState) => state.gpx);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop: (acceptedFiles : File[]) => {
            if (acceptedFiles.length) {
                const reader = new FileReader();
                reader.onload = async(event) => {
                    const fileContent = event.target
                        ?.result as string;
                    const parser = new DOMParser();
                    const xml = parser.parseFromString(fileContent as string, 'text/xml');
                    const metadataElement = xml.querySelector("metadata");
                    let name = '';
                    if (metadataElement) {
                        name = metadataElement.querySelector("name")
                            ?.textContent || '';
                    }
                    //console.log(xml);
                    const convertedGeoJSON = togeojson.gpx(xml);
                    const gpxData = {
                        name: name,
                        info: processGeoJSON(convertedGeoJSON),
                        routes: convertedGeoJSON.features[0]
                    }as GpxData;
                    //console.log(gpxData);
                    setFileSelected(true);
                    removeAllRoutes(mapRef);
                    dispatch(setGPXData(gpxData));
                };

                reader.readAsText(acceptedFiles[0]);
            } else {
                setFileSelected(false);
                console.warn('Rejected non-gpx files');
            }
        },
        accept: {
            'application/gpx+xml': ['.gpx']
        },
        maxSize: 5000000
    });

    const dropzoneStyle = {
        transition: 'opacity 1s ease-out',
        opacity: fileSelected
            ? 0
            : 1,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        color: 'white',
        borderRadius: 12
    };

    useEffect(() => {

        if (mapRef.current) {

            const mapInstance = mapRef
                .current
                .getMapInstance();
            if (mapInstance._fullyLoaded) {
                addLayersToMap(mapRef, "#ff30a2", data
                    ?.routes);
            }
            //addLayersToMap(mapRef,"#ff30a2", data?.routes);
        }
    }, [data
            ?.routes, mapRef]);

    const handleResize = useCallback(() => {
        resizeMap(data
            ?.routes, mapRef);
    }, [data
            ?.routes, mapRef]);

    useEffect(() => {
        if (data
            ?.routes) {
            handleResize();
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [
        data
            ?.routes,
        handleResize
    ]);

    return (
        <MapContainer
            style={{
            position: 'relative',
            w: '100%',
            height: '400px',
            overflow: 'hidden'
        }}>
            <Stack>
                <Suspense fallback={< FallbackSpinner />}>
                    <BaseMap
                        ref={mapRef}
                        center={hongKongCoordinates}
                        zoom={17}
                        style={{
                        position: 'relative',
                        width: '100%',
                        height: '400px',
                        borderRadius: 12
                    }}/>
                </Suspense>
                {fileSelected
                    ? <IconButton {...getRootProps()} m={2} aria-label={"upload-file"} icon={<RiUploadCloud2Fill/>} pos={'absolute'} right={0} backgroundColor={'rgba(0,0,0,0.6)'} color={'white'} backdropFilter={'blur(4px)'} _hover={{bgColor:'rgba(0,0,0,0.5)'}}/>
                    : <Box pos={'absolute'} {...dropzoneStyle} {...getRootProps()}>
                        <input {...getInputProps()}/>
                        <Column align={'center'} justifyContent={'center'}>
                            <RiUploadCloud2Fill size={'40px'}/>
                            <Text mx={3}>{isDragActive
                                    ? 'Drop the file here ...'
                                    : 'Drag & drop an image here, or select a file'}</Text>
                        </Column>
                    </Box>}
            </Stack>
        </MapContainer>
    );
}