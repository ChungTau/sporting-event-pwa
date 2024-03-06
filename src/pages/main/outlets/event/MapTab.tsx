import {motion} from "framer-motion";
import {tabVariants} from "../../../../constants/animateVariant";
import Column from "../../../../components/Column";

import AnimationProvider from "../../../../providers/AnimationProvider";
import {useMap} from "../../../../contexts/MapContext";
//@ts-ignore
import {Carousel} from 'react-carousel';
import {hongKongCoordinates} from "../../../../constants/map";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {TabProps} from ".";
import PlanServices from "../../../../services/planServices";
import Plan from "../../../../models/Plan";
import {
    Box,
    Button,
    Container,
    SimpleGrid,
    Slider,
    Text
} from "@chakra-ui/react";
import {PlanCard} from "../myPlan";
import Row from "../../../../components/Row";
import styled from "@emotion/styled";
import {Buffer} from 'buffer';
// @ts-ignore
import togeojson from 'togeojson';
import {GPXProvider} from "../../../../providers/GPXProvider";
import {useGPX} from "../../../../contexts/GPXContext";
import GpxData from "../../../../models/GpxData";
import {processGeoJSON} from "../../../../helpers/processGeoJSON";
import {addLayersToMap, removeAllRoutes, resizeMap} from "../../../../helpers/map";
import { COLOR_PRIMARY_RGB } from "../../../../constants/palatte";
import EventServices from "../../../../services/eventServices";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
const BaseMap = React.lazy(() => import ('../../../../components/BaseMap'));
const MapContainer = styled(Box)({width: '100%', height: '650px'});
const settings = {
    width: "300px",
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1
};

const MapTab = ({event} : TabProps) => {
    const map = useMap();
    const gpx = useGPX();
    const [plans,
        setPlans] = useState < Plan[] > ([]);
    const [selectedPlanId,
        setSelectedPlanId] = useState < string | null > (null);
    const {user} = useSelector((state : RootState) => state.user);
    const currentRoute = useMemo(() => gpx.gpxState.data
    ?.routes, [gpx.gpxState.data
        ?.routes]);

    useEffect(() => {

        if(user?.id !== event?.owner?.id){
            return;
        }
        PlanServices
            .getPlansByOwnerId(event
            ?.owner
                ?.id !)
            .then((data : Plan[] | null) => {
                if (data !== null) {
                    setPlans(data);
                    
                }
            });
            
    }, []);

    const handlePlanClick = (planId : string) => {
        setSelectedPlanId(planId);
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

    useEffect(() => {
        if(map.isStyleLoaded){
            removeAllRoutes(map.mapRef);
        }
        if (selectedPlanId !== null) {

            PlanServices
                .getPlanByIdFromEvent(selectedPlanId)
                .then(async(plan : Plan) => {
                    const buffer = Buffer.from(plan.gpxFile);

                    // Convert buffer to string
                    const decoder = new TextDecoder('utf-8');
                    const xmlString = decoder.decode(buffer);

                    // Parse XML string
                    const parser = new DOMParser();
                    const xml = parser.parseFromString(xmlString, 'text/xml');
                    const {name, author} = extractMetadata(xml);
                    const convertedGeoJSON = togeojson.gpx(xml);

                    const gpxData : GpxData = {
                        name,
                        author,
                        info: processGeoJSON(convertedGeoJSON),
                        routes: convertedGeoJSON.features[0]
                    };
                    
                    map.clearMarkers();
                    gpx.setGPXXML(xml);
                    gpx.setGPXData(gpxData);
                });
        }else{
            if(event?.plan?.id){
                setSelectedPlanId(event?.plan?.id);
            }
        }
        
        // eslint-disable-next-line
    }, [selectedPlanId, map.isStyleLoaded]);

    const addLayersIfNeeded = useCallback(() => {
        if (!map.mapRef.current || !currentRoute || !map.isStyleLoaded) {
            resizeMap(currentRoute, map.mapRef, 1200);
            setTimeout(()=>{
                
                addLayersToMap(map.mapRef, '#887d73', currentRoute);
            },500);
            return;
        }
 
        resizeMap(currentRoute, map.mapRef, 1200);
        addLayersToMap(map.mapRef, '#887d73', currentRoute);
    }, [map.isStyleLoaded, currentRoute, map.mapRef]);

    useEffect(() => {

        addLayersIfNeeded();

    }, [addLayersIfNeeded, map.isStyleLoaded]);

    const handleSubmit = async () => {
        if (selectedPlanId === null || !event?.id) {
            return;
        }
        const eventFormData = new FormData();
        eventFormData.append("id", event.id);
        
        eventFormData.append('planId', selectedPlanId);

    try {
            const response = await EventServices.updateEvent(event.id, eventFormData);
            console.log(response);
            if (response) {
                console.log("Event updated successfully!");
            }
        } catch (error) {
            console.error("Error updating event:", error);
        }
    }
    

    return (
        <motion.div
            key="map"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={tabVariants}
            transition={{
            duration: 0.5
        }}>
            <Column>
                <GPXProvider>
                    <AnimationProvider>
                        <Column>
                            <Row w={'100%'}>
                                {user?.id === event?.owner?.id  && <Slider overflowY={'scroll'} h={'550px'} {...settings}>
                                        {plans.map(plan => (<PlanCard
                                            key={plan.id}
                                            plan={plan}
                                            clickable={false}
                                            isSelected={selectedPlanId === plan.id}
                                            onClick={() => handlePlanClick(plan.id !)}/>))}
                                    </Slider>
}
                                <MapContainer
                                    style={{
                                    position: 'relative',
                                    w: '100%',
                                    minH: '500px',
                                    height: 'fit-content',
                                    maxH: '550px',
                                    overflow: 'hidden'
                                }}>
                                    <BaseMap
                                        ref={map.mapRef}
                                        center={hongKongCoordinates}
                                        zoom={17}
                                        style={{
                                        position: 'relative',
                                        width: '100%',
                                        height: '550px',
                                        borderRadius: '12px'
                                    }}/>
                                </MapContainer>
                            </Row>
                           {user?.id === event?.owner?.id  && <Button
                                onClick={async() => {
                                
                                await handleSubmit();
                            }}
                                bgColor={`rgba(${COLOR_PRIMARY_RGB}, 0.7)`}
                                _hover={{
                                bgColor: `rgba(${COLOR_PRIMARY_RGB}, 0.8)`
                            }}
                                _active={{
                                bgColor: `rgba(${COLOR_PRIMARY_RGB}, 0.9)`
                            }}>
                                <Text color={'white'}>Save</Text>
                            </Button>}
                        </Column>

                    </AnimationProvider>
                </GPXProvider>
            </Column>
        </motion.div>
    );
};

export default MapTab;