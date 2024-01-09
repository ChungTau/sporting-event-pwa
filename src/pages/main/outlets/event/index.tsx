import {Box, Button, Divider, Image, Text} from "@chakra-ui/react";
import Column from "../../../../components/Column";
import {COLOR_PRIMARY_RGB, COLOR_SECONDARY} from "../../../../constants/palatte";
import Row from "../../../../components/Row";
import { FaUser } from "react-icons/fa";
import { FaEarthAmericas } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function EventPage() {
    const [activeTab, setActiveTab] = useState('about');
    const [showFullText, setShowFullText] = useState(false);
    const aboutRef = useRef(null);
    const mapRef = useRef(null);
    const [underlinePosition, setUnderlinePosition] = useState({ left: 0, width: 0 });
    const description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."; // Your full description text
    const displayText = showFullText ? description : `${description.substring(0, 280)}... `;
    const tabVariants = {
        initial: { opacity: 0, x: -100 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 100 },
    };

    const updateUnderline = (ref:React.MutableRefObject<any>) => {
        if (ref && ref.current) {
            const { offsetLeft, offsetWidth } = ref.current;
            setUnderlinePosition({ left: offsetLeft, width: offsetWidth });
        }
    };

    // Call updateUnderline when the component mounts or activeTab changes
    useEffect(() => {
        if (activeTab === 'about') {
            updateUnderline(aboutRef);
        } else if (activeTab === 'map') {
            updateUnderline(mapRef);
        }
    }, [activeTab]);

    return (
        <Column gap={4}>
            <Column bgColor={`rgba(${COLOR_PRIMARY_RGB}, 0.7)`} borderRadius="12px" h="500px" position="relative" // Set the position to relative
            >
                <Image
                    w="100%"
                    borderTopRadius="12px"
                    h="380px"
                    fit="cover"
                    src="./images/temp_event_background.png"/> {/* Gradient Overlay */}
                <Box position="absolute" top="0" left="0" right="0" bottom="0" background={`linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, #7a6d61 75%, #7a6d61 100%)`} borderRadius="12px" // Match the border-radius of the image
                />

                <Column
                    w={'100%'}
                    color={'gray.300'}
                    pos={'absolute'}
                    bottom={'0px'}
                    p={4}
                    zIndex={1}
                    gap={1}>
                    <Text fontWeight={600}>FRIDAY, 1 DECEMBER 2023 AT 00:00</Text>
                    <Text fontWeight={600} fontSize={'larger'}>HKUST Campus Run</Text>
                    <Text>Leisure</Text>
                    <Divider my={2}/>
                    <Row justifyContent={'space-between'} alignItems={'baseline'}>
                    <Row>
                    <Button _hover={{bgColor:'transparent'}} color={activeTab==='about'?'rgb(216, 227, 215)':'gray.300'} ref={aboutRef} size="small" h="36px" w="80px" onClick={() => setActiveTab('about')} bgColor={'transparent'}>
                    About
                </Button>
                <Button _hover={{bgColor:'transparent'}} color={activeTab==='map'?'rgb(216, 227, 215)':'gray.300'} ref={mapRef} size="small" h="36px" w="80px" onClick={() => setActiveTab('map')} bgColor={'transparent'}>
                    Map
                </Button>
                <motion.div
                    layoutId="underline"
                    initial={false}
                    animate={{ left: underlinePosition.left, width: underlinePosition.width }}
                    transition={{ type: "spring", stiffness: 100 }}
                    style={{
                        position: "absolute",
                        bottom: 10,
                        height: "2px",
                        backgroundColor: COLOR_SECONDARY, // Adjust as needed
                    }}
                />
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
            {activeTab === 'about' && (
                    <motion.div
                        key="about"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={tabVariants}
                        transition={{ duration: 0.5 }}
                    >
                        <Column gap={4}>
                        <Column
                p={4}
                gap={4}
                maxW={'500px'}
                bgColor={`rgba(${COLOR_PRIMARY_RGB}, 0.7)`}
                borderRadius="12px"
                color={'white'}
                position="relative">
                <Text fontSize={'larger'} fontWeight={600}>Details</Text>
                <Column>
                <Row alignItems={'center'}>
                    <FaUser color="#bcbcbc"/>
                    <Text>
                        Hosted by HKUST
                    </Text>
                </Row>
                <Row alignItems={'center'}>
                <FaEarthAmericas color="#bcbcbc"/>
                    <Text>
                        Public · Anyone on or off Sport Event PWA
                    </Text>
                </Row>
                <Text>
                    {displayText}
                    {!showFullText && (
                        <Text as="span" color={'blackAlpha.600'} fontWeight={500} cursor="pointer" onClick={() => setShowFullText(true)}>
                            {"  See more"}
                        </Text>
                    )}
                    {showFullText && (
                        <Text as="span" color={'blackAlpha.600'} fontWeight={500} cursor="pointer" onClick={() => setShowFullText(false)}>
                            {"  See less"}
                        </Text>
                    )}
                </Text>
                </Column>
            </Column>
            <Column
                p={4}
                gap={4}
                maxW={'500px'}
                bgColor={`rgba(${COLOR_PRIMARY_RGB}, 0.7)`}
                borderRadius="12px"
                color={'white'}
                position="relative">
                <Text fontSize={'larger'} fontWeight={600}>Guest</Text>
                
            </Column>
                        </Column>
                    </motion.div>
                )}

                {activeTab === 'map' && (
                    <motion.div
                        key="map"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={tabVariants}
                        transition={{ duration: 0.5 }}
                    >
                        <Column
                            p={4}
                            bgColor={`rgba(${COLOR_PRIMARY_RGB}, 0.7)`}
                            borderRadius="12px"
                            color="white">
                            <Text>Join</Text>
                        </Column>
                    </motion.div>
                )}
            </AnimatePresence>
           
        </Column>
    );
};

export default EventPage;