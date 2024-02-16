import {
    Box,
    Divider,
    Flex,
    Stack,
    Text,
    useBreakpointValue
} from "@chakra-ui/react";
import styled from "@emotion/styled";
// @ts-ignore
import togeojson from 'togeojson';
import {useMap} from "../../../../contexts/MapContext";
import {useDropzone} from "react-dropzone";
import {Suspense, useEffect, useState} from "react";
import Column from "../../../../components/Column";

import React from "react";
import FallbackSpinner from "../../../../components/FallbackSpinner";
import {processGeoJSON} from "../../../../helpers/processGeoJSON";
import GpxData from "../../../../models/GpxData";
import {removeAllRoutes} from "../../../../helpers/map";
import {COLOR_PRIMARY_RGB} from "../../../../constants/palatte";
import Row from "../../../../components/Row";
import InfoItem from "./InfoItem";
import UploadArea from "./UploadArea";
import PlanMap from "./PlanMap";
import AnimationProvider from "../../../../providers/AnimationProvider";
import { useGPX } from "../../../../contexts/GPXContext";
import { useNavigate, useParams } from "react-router-dom";
import PlanServices from "../../../../services/planServices";
import Plan from "../../../../models/Plan";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

const MapContainer = styled(Box)({width: '100%', height: '650px'});

export const PlanMapView : React.FC = () => {
    const [fileSelected,
        setFileSelected] = useState(false);
    const map = useMap();
    const gpx = useGPX();
    const isMobile = useBreakpointValue({base: true, md: false});
    const { planId } = useParams();
    const navigator = useNavigate();
    const {user} = useSelector((state : RootState) => state.user);
    useEffect(()=>{
        if(planId !== undefined){
            
        PlanServices.getPlanById(planId).then( async(plan:Plan) => {
            PlanServices.getGPXFileContent(plan.path.split('plans\\')[1]).then(async(file:string) => {
                const xml = new DOMParser().parseFromString(file, "text/xml");
                const {name, author} = extractMetadata(xml);
                const convertedGeoJSON = togeojson.gpx(xml);
                console.log(xml);
                const gpxData : GpxData = {
                    name,
                    author,
                    info: processGeoJSON(convertedGeoJSON),
                    routes: convertedGeoJSON.features[0]
                };
                setFileSelected(true);
                removeAllRoutes(map.mapRef);
                map.clearMarkers();
                gpx.setGPXXML(xml);
                gpx.setGPXData(gpxData);
            });

        });
    }
    },[planId]);

    const handleDrop = (acceptedFiles : File[]) => {
        if (acceptedFiles.length) {
            const reader = new FileReader();
            reader.onload = async(event) => {
                const fileContent = event.target
                    ?.result as string;
                const xml = new DOMParser().parseFromString(fileContent, "text/xml");
                const {name, author} = extractMetadata(xml);
                const convertedGeoJSON = togeojson.gpx(xml);
                console.log(xml);
                const gpxData : GpxData = {
                    name,
                    author,
                    info: processGeoJSON(convertedGeoJSON),
                    routes: convertedGeoJSON.features[0]
                };
                setFileSelected(true);
                removeAllRoutes(map.mapRef);
                map.clearMarkers();
                gpx.setGPXXML(xml);
                gpx.setGPXData(gpxData);
                
            };

            reader.readAsText(acceptedFiles[0]);
        } else {
            setFileSelected(false);
            console.warn("Rejected non-gpx files");
        }
        
    };

    const extractMetadata = (xml : Document) => {
        const metadataElement = xml.querySelector("metadata");
        let name = "";
        let author = "";
        if (metadataElement) {
            name = metadataElement.querySelector("name")
                ?.textContent || "";
            const authorElement = metadataElement.querySelector("author");
            if (authorElement) {
                author = authorElement.querySelector("name")
                    ?.textContent || "";
            }
        }
        return {name, author};
    };
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop: handleDrop,
        accept: {
            'application/gpx+xml': ['.gpx']
        },
        maxSize: 5000000
    });

    return (
        <MapContainer
            style={{
            position: 'relative',
            w: '100%',
            minH: '500px',
            height: 'fit-content',
            maxH: '520px',
            overflow: 'hidden'
        }}><AnimationProvider>
            <Stack>
                <Suspense fallback={< FallbackSpinner />}>
                    <Column
                        width={'100%'}
                        gap={0}
                        minH={'500px'}
                        bgColor={'transparent'}
                        w={'100%'}
                        borderRadius={12}>
                        <PlanMap/> 
                        <Flex
                            direction={isMobile
                            ? "column"
                            : "row"}
                            w={"100%"}
                            minH={"70px"}
                            maxH={"120px"}
                            borderBottomRadius={12}
                            bgColor={`rgba(${COLOR_PRIMARY_RGB},0.7)`}
                            alignItems={"center"}
                            justifyContent={isMobile
                            ? "center"
                            : "space-between"}
                            px={isMobile
                            ? 2
                            : 4}
                            py={4}>
                            <Column
                                align={isMobile
                                ? "center"
                                : "flex-start"}
                                justify={isMobile
                                ? "center"
                                : "flex-start"}
                                w={isMobile
                                ? "100%"
                                : "auto"}>
                                <Text
                                    fontSize={"medium"}
                                    color={"white"}
                                    fontWeight={600}
                                    mr={!isMobile
                                    ? 4
                                    : 0}>
                                    {gpx.gpxState.data?.name ?? '---'}
                                </Text>
                                {!isMobile && (
                                    <Text w={"300px"} fontSize={"small"} color={"gray.100"}>
                                        Author: {gpx.gpxState.data
                                            ?.author ?? "UNKNOWN"}
                                    </Text>
                                )}
                            </Column>

                            {isMobile && (<Divider orientation="horizontal" w="100%" my={2} borderColor="white"/>)}

                            <Row
                                color={"white"}
                                gap={isMobile
                                ? 2
                                : 4}
                                w={isMobile
                                ? "100%"
                                : "auto"}>
                                <InfoItem
                                    label="Distance"
                                    value={`${gpx.gpxState.data?.info.distance.toFixed(2) ?? '---'} KM`}
                                    isMobile={isMobile}/>
                                <InfoItem
                                    label="Ele. Gain"
                                    value={`${gpx.gpxState.data?.info.climb.toFixed(0) ?? '---'} M`}
                                    isMobile={isMobile}/>
                                <InfoItem
                                    label="Ele. Loss"
                                    value={`${gpx.gpxState.data?.info.fall.toFixed(0) ?? '---'} M`}
                                    isMobile={isMobile}/>
                            </Row>
                        </Flex>
                    </Column>
                </Suspense>
                {planId?null:<UploadArea
                    getInputProps={getInputProps}
                    getRootProps={getRootProps}
                    isDragActive={isDragActive}
                    fileSelected={fileSelected}/>}

            </Stack>
            </AnimationProvider>
        </MapContainer>
    );
}