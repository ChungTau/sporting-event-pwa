import {motion} from "framer-motion";
import {FaUser} from "react-icons/fa";
import {FaEarthAmericas} from "react-icons/fa6";
import { IoMdPin } from "react-icons/io";
import Column from "../../../../components/Column";
import Row from "../../../../components/Row";
import {COLOR_PRIMARY_RGB} from "../../../../constants/palatte";
import {tabVariants} from "../../../../constants/animateVariant";
import {Avatar, Box, Button, Collapse, Spacer, Text, useBreakpointValue} from "@chakra-ui/react";
import {useState} from "react";
import { TabProps } from ".";

const AboutTab = ({event}:TabProps) => {
    const [showFullText,
        setShowFullText] = useState(false);
    const displayText = showFullText
        ? event?.description
        : `${event?.description.substring(0, 280)}... `;

        const [showParticipants] = useState(true);
        const isMobile = useBreakpointValue({base: true, sm: false});
        // Sample data for participants
        const avatarSize = isMobile ? 'md' : 'md';
        const fontSize = isMobile ? 'sm' : 'md';
        const buttonSize = isMobile ? 'sm' : 'md';
    
        // Sample data for participants
        const participants = [
            { name: 'John Doe', role: 'Speaker', bio: 'Expert in AI and Machine Learning.', avatarUrl: './images/avataaars.png' },
            { name: 'Jane Smith', role: 'Attendee', bio: 'Passionate about digital marketing.', avatarUrl: './images/avataaars.png' },
            // ... more participants
        ];
    return (
        <motion.div
            key="about"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={tabVariants}
            transition={{
            duration: 0.5
        }}>
            <Column gap={4}>
                <Column
                    p={4}
                    gap={4}
                    bgColor={`rgba(${COLOR_PRIMARY_RGB}, 0.7)`}
                    borderRadius="12px"
                    color={'white'}
                    position="relative">
                    <Text fontSize={'larger'} fontWeight={600}>Details</Text>
                    <Column>
                        <Row alignItems={'center'}>
                            <FaUser color="#bcbcbc"/>
                            <Text>
                                {`Hosted by ${event?.owner?.username}`} 
                            </Text>
                        </Row>
                        <Row alignItems={'center'}>
                            <IoMdPin color="#bcbcbc"/>
                            <Text>
                                {event?.venue.address}
                            </Text>
                        </Row>
                        <Row alignItems={'center'}>
                            <FaEarthAmericas color="#bcbcbc"/>
                            <Text>
                                {`${event?.privacy} · Anyone on or off Sport Event PWA`}
                            </Text>
                        </Row>
                        
                        <Text>
                            {displayText}
                            {!showFullText && (
                                <Text
                                    as="span"
                                    color={'blackAlpha.600'}
                                    fontWeight={500}
                                    cursor="pointer"
                                    onClick={() => setShowFullText(true)}>
                                    {"  See more"}
                                </Text>
                            )}
                            {showFullText && (
                                <Text
                                    as="span"
                                    color={'blackAlpha.600'}
                                    fontWeight={500}
                                    cursor="pointer"
                                    onClick={() => setShowFullText(false)}>
                                    {"  See less"}
                                </Text>
                            )}
                        </Text>
                    </Column>
                </Column>
                <Column
                    p={4}
                    gap={4}
                    bgColor={`rgba(${COLOR_PRIMARY_RGB}, 0.7)`}
                    borderRadius="12px"
                    color={'white'}
                    position="relative">
                    <Text fontSize={'larger'} fontWeight={600}>Guest</Text>
                    <Collapse in={showParticipants}>
                        {participants.map((participant, index) => (
                            <Box key={index} p={2} m={1} bgColor="transparent" borderRadius="md">
                                <Row alignItems={'end'}>
                                    <Avatar size={avatarSize} src={participant.avatarUrl} />
                                    <Box mx="1" overflow="hidden">
                                        <Text isTruncated fontWeight="bold" fontSize={fontSize}>{participant.name}</Text>
                                        <Text isTruncated fontSize={fontSize}>{participant.bio}</Text>
                                    </Box>
                                    <Spacer />
                                    <Button size={buttonSize} colorScheme="blue">Follow</Button>
                                </Row>
                            </Box>
                        ))}
                    </Collapse>
                </Column>
            </Column>
        </motion.div>
    );
};

export default AboutTab;