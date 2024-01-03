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
import {hongKongCoordinates} from "../../../../constants/map";
import {useMap} from "../../../../contexts/MapContext";
import {useDropzone} from "react-dropzone";
import {Suspense, useCallback, useEffect, useState} from "react";
import Column from "../../../../components/Column";

import React from "react";
import FallbackSpinner from "../../../../components/FallbackSpinner";
import {processGeoJSON} from "../../../../helpers/processGeoJSON";
import {GpxData} from "../../../../models/GpxData";
import {useDispatch, useSelector} from "react-redux";
import {clearGPXData, setGPXData} from "../../../../store/gpxSlice";
import {RootState} from "../../../../store";
import {addLayersToMap, removeAllRoutes, resizeMap} from "../../../../helpers/map";
import {COLOR_PRIMARY_RGB} from "../../../../constants/palatte";
import Row from "../../../../components/Row";
import InfoItem from "./InfoItem";
import UploadArea from "./UploadArea";

const BaseMap = React.lazy(() => import ('../../../../components/BaseMap'));
const MapContainer = styled(Box)({width: '100%', height: '650px'});

export const PlanMapView : React.FC = () => {
    const [fileSelected,
        setFileSelected] = useState(false);
    const mapRef = useMap();
    const dispatch = useDispatch();
    const {data} = useSelector((state : RootState) => state.gpx);
    const isMobile = useBreakpointValue({base: true, md: false});

    const handleDrop = (acceptedFiles : File[]) => {
        if (acceptedFiles.length) {
            const reader = new FileReader();
            reader.onload = async(event) => {
                const fileContent = event.target
                    ?.result as string;
                const xml = new DOMParser().parseFromString(fileContent, "text/xml");
                const {name, author} = extractMetadata(xml);
                const convertedGeoJSON = togeojson.gpx(xml);
                const gpxData : GpxData = {
                    name,
                    author,
                    info: processGeoJSON(convertedGeoJSON),
                    routes: convertedGeoJSON.features[0]
                };
                setFileSelected(true);
                removeAllRoutes(mapRef);
                dispatch(setGPXData(gpxData));
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

    useEffect(() => {
    return () => {
      // Cleanup function to clear GPX data when component is unmounted
      dispatch(clearGPXData());
    };
  }, [dispatch]);

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
    }, [
        data
            ?.routes,
        mapRef
    ]);

    const handleResize = useCallback(() => {
        resizeMap(data
            ?.routes, mapRef);
    }, [
        data
            ?.routes,
        mapRef
    ]);

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
            minH:'470px',
            height: 'fit-content',
            maxH:'520px',
            overflow: 'hidden'
        }}>
            <Stack>
                <Suspense fallback={< FallbackSpinner />}>
                    <Column
                        width={'100%'}
                        gap={0}
                        minH={'470px'}
                        
                        bgColor={'transparent'}
                        w={'100%'}
                        borderRadius={12}>
                        <BaseMap
                            ref={mapRef}
                            center={hongKongCoordinates}
                            zoom={17}
                            style={{
                            position: 'relative',
                            width: '100%',
                            height: '400px',
                            borderRadius: '12px 12px 0px 0px'
                        }}/>
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
                                    {data
                                        ?.name ?? '---'}
                                </Text>
                                {!isMobile && (
                                    <Text w={"300px"} fontSize={"small"} color={"gray.100"}>
                                        Author: {data
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
                                    value={`${data?.info.distance.toFixed(2) ?? '---'} KM`}
                                    isMobile={isMobile}/>
                                <InfoItem
                                    label="Ele. Gain"
                                    value={`${data?.info.climb.toFixed(0) ?? '---'} M`}
                                    isMobile={isMobile}/>
                                <InfoItem
                                    label="Ele. Loss"
                                    value={`${data?.info.fall.toFixed(0) ?? '---'} M`}
                                    isMobile={isMobile}/>
                            </Row>
                        </Flex>
                    </Column>
                </Suspense>
                <UploadArea getInputProps={getInputProps} getRootProps={getRootProps} isDragActive={isDragActive} fileSelected={fileSelected}/>
            </Stack>
        </MapContainer>
    );
}