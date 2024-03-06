import {
    Box,
    Button,
    Divider,
    Flex,
    IconButton,
    Image,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    useBreakpointValue
} from "@chakra-ui/react";
import Column from "../../../../components/Column";
import {COLOR_PRIMARY_RGB, COLOR_SECONDARY} from "../../../../constants/palatte";
import Row from "../../../../components/Row";
import {Suspense, useEffect, useMemo, useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import CustomTabButton from "./CustomTabButton";
import EventRouteInfo from "./EventRouteInfo";
import {GPXProvider} from "../../../../providers/GPXProvider";
import React from "react";
import {MdDelete} from "react-icons/md";
import {MdOutlineFavoriteBorder} from "react-icons/md";
import {MdEditLocationAlt} from "react-icons/md";
import {MdModeEdit} from "react-icons/md";
import {IoMdShare} from "react-icons/io";
import {IoMdMore} from "react-icons/io";
import FallbackSpinner from "../../../../components/FallbackSpinner";
import EventServices from "../../../../services/eventServices";
import {useParams} from "react-router-dom";
import EventData from "../../../../models/EventData";
import {eventTypes} from "../addEvent/InputForm";

export interface TabProps {
    event: EventData|null;
}
const AboutTab = React.lazy(() => import ('./AboutTab'));
const MapTab = React.lazy(() => import ('./MapTab'));
const RecordingTab = React.lazy(() => import ('./RecordingTab'));
const menuItemStyle = {
    bg: 'transparent',
    _hover: {
        bg: `rgba(255,255,255,0.2)`,
        color: 'gray.600'
    },
    color: 'gray.700',
    fontSize: '14px'
};

function getTypeTextByValue(value : string) : string | undefined {
    const eventType = eventTypes.find(eventType => eventType.value === value);
    return eventType
        ?.text;
}

function formatDate(dateString : string) {
    const date = new Date(dateString);

    const options : Intl.DateTimeFormatOptions | undefined = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };

    return new Intl
        .DateTimeFormat('en-US', options)
        .format(date)
        .toUpperCase() + ' AT ' + date
        .getHours()
        .toString()
        .padStart(2, '0') + ':' + date
        .getMinutes()
        .toString()
        .padStart(2, '0');
}

function EventPage() {
    const [event,
        setEvent] = useState < EventData > ();
    const [activeTab,
        setActiveTab] = useState('about');
    const [underlinePosition,
        setUnderlinePosition] = useState({left: 0, width: 0});

    const isMobile = useBreakpointValue({base: true, sm: false});
    const {eventId} = useParams();
    const aboutRef = useRef(null);
    const mapRef = useRef(null);
    const recordingRef = useRef(null);

    const tabs = useMemo(() => [
        {
            title: 'About',
            ref: aboutRef,
            component: AboutTab
        }, {
            title: 'Map',
            ref: mapRef,
            component: MapTab
        }, {
            title: 'Recording',
            ref: recordingRef,
            component: RecordingTab
        }
    ], []);

    const updateUnderline = (ref : React.MutableRefObject < any >) => {
        if (ref.current) {
            const {offsetLeft, offsetWidth} = ref.current;
            setUnderlinePosition({left: offsetLeft, width: offsetWidth});
        }
    };

    useEffect(() => {
        const activeTabInfo = tabs.find(tab => tab.title.toLowerCase() === activeTab);
        if (activeTabInfo) {
            updateUnderline(activeTabInfo.ref);
        }
    }, [activeTab, tabs]);

    useEffect(() => {

        if (eventId !== undefined) {
            EventServices
                .getEventById(eventId)
                .then((data : EventData) => {
                    setEvent(data);
                    console.log(data);
                })
                .catch(error => console.error(error));
        }
    }, []);

    return (
        <Column gap={4}>
            <Column bgColor={`rgba(${COLOR_PRIMARY_RGB}, 0.7)`} borderRadius="12px" h="500px" position="relative" // Set the position to relative
            >
                <Image
                    w="100%"
                    borderTopRadius="12px"
                    h="380px"
                    fit="cover"
                    src={event
                    ?.backgroundImage ?? "/images/temp_event_background.png"}/>
                <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    background={`linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, #7a6d61 75%, #7a6d61 100%)`}
                    borderRadius="12px"/>
                <IconButton
                    _active={{
                    bgColor: `rgba(255,255,255,0.9)`
                }}
                    _hover={{
                    bgColor: `rgba(255,255,255,0.8)`
                }}
                    backdropFilter={'blur(4px)'}
                    color={'black'}
                    aria-label="my-fav"
                    bgColor={`rgba(255,255,255,1)`}
                    icon={< MdOutlineFavoriteBorder />}
                    pos={'absolute'}
                    top={'10px'}
                    right={'60px'}/>
                <Menu>
                    <MenuButton
                        as={IconButton}
                        color={'black'}
                        pos={'absolute'}
                        top={'10px'}
                        right={'10px'}
                        _active={{
                        bgColor: `rgba(255,255,255,0.9)`
                    }}
                        _hover={{
                        bgColor: `rgba(255,255,255,0.8)`
                    }}
                        aria-label='More'
                        bgColor={`rgba(255,255,255,1)`}
                        backdropFilter={'blur(4px)'}
                        icon={< IoMdMore />}
                        variant={'primary'}/>
                    <MenuList
                        mt={2}
                        minW={'140px'}
                        zIndex={11}
                        borderColor={'transparent'}
                        bg={`rgba(255,255,255,0.7)`}
                        backdropFilter={'blur(4px)'}>

                        <MenuItem {...menuItemStyle} icon={< MdModeEdit />}>
                            Edit info
                        </MenuItem>
                        <MenuItem {...menuItemStyle} icon={< MdEditLocationAlt />}>
                            Edit route
                        </MenuItem>
                        <MenuItem {...menuItemStyle} icon={< IoMdShare />}>
                            Share event
                        </MenuItem>
                        <MenuItem {...menuItemStyle} icon={< MdDelete />}>
                            Delete event
                        </MenuItem>
                    </MenuList>
                </Menu>

                <Column
                    w={'100%'}
                    color={'gray.300'}
                    pos={'absolute'}
                    bottom={'0px'}
                    p={4}
                    zIndex={1}
                    gap={1}>
                    <Flex
                        gap={isMobile
                        ? 3
                        : 0}
                        flexDir={isMobile
                        ? 'column'
                        : 'row'}
                        justifyContent={isMobile
                        ? 'center'
                        : 'space-between'}
                        alignItems={isMobile
                        ? 'flex-start'
                        : 'end'}>
                        <Column
                            gap={0}
                            order={isMobile
                            ? 2
                            : 1}>
                            <Text fontWeight={600}>{event
                                    ?.startDateTime
                                        ? formatDate(event
                                            ?.startDateTime !)
                                        : ''}</Text>
                            <Text fontWeight={600} fontSize={'larger'}>{event
                                    ?.name}</Text>
                            <Text>{getTypeTextByValue(event
                                    ?.type !)}</Text>
                        </Column>
                        <Flex
                            flexDir={isMobile
                            ? 'row'
                            : 'column'}
                            justifyContent={isMobile
                            ? 'space-evenly'
                            : 'unset'}
                            gap={isMobile
                            ? 8
                            : 1}
                            order={isMobile
                            ? 1
                            : 2}>
                            <EventRouteInfo
                                title="Distance"
                                value={event?.plan?.info.distance.toFixed(1) ?? 0}
                                unit="KM"/>
                            <EventRouteInfo
                                title="Total Climb"
                                value={event
                                ?.plan
                                    ?.info.climb.toFixed(0) ?? 0}
                                unit="M+"/>
                        </Flex>
                    </Flex>

                    <Divider my={2}/>
                    <Row justifyContent={'space-between'} alignItems={'baseline'}>
                        <Row mr={4}>
                            {tabs.map(tab => (<CustomTabButton
                                key={tab.title}
                                ref={tab.ref}
                                title={tab.title}
                                isActive={activeTab === tab
                                .title
                                .toLowerCase()}
                                onClick={() => setActiveTab(tab.title.toLowerCase())}/>))}
                            <motion.div
                                layoutId="underline"
                                initial={false}
                                animate={{
                                left: underlinePosition.left,
                                width: underlinePosition.width
                            }}
                                transition={{
                                type: "spring",
                                stiffness: 50
                            }}
                                style={{
                                position: "absolute",
                                bottom: 10,
                                height: "2px",
                                backgroundColor: COLOR_SECONDARY
                            }}/>
                        </Row>
                        <Button
                            color={'rgb(216, 227, 215)'}
                            _hover={{
                            bgColor: 'rgb(66, 77, 65)'
                        }}
                            _active={{
                            bgColor: 'rgb(56, 67, 55)'
                        }}
                            bgColor={COLOR_SECONDARY}
                            size={'small'}
                            h={'36px'}
                            w={'100px'}>
                            Join
                        </Button>
                    </Row>
                </Column>

            </Column>
            <AnimatePresence mode="wait">
                <GPXProvider>
                    <Suspense fallback={< FallbackSpinner />}>
                        {tabs.map(tab => (activeTab === tab.title.toLowerCase() && (<tab.component key={tab.title} event={event??null}/>)))}
                    </Suspense>
                </GPXProvider>
            </AnimatePresence>

        </Column>
    );
};

export default EventPage;