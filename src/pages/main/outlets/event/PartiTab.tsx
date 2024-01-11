import {motion} from "framer-motion";
import {tabVariants} from "../../../../constants/animateVariant";
import Column from "../../../../components/Column";
import {COLOR_PRIMARY_RGB} from "../../../../constants/palatte";
import {Avatar, Box, Button, Collapse, Flex, IconButton, Input, Spacer, Text, useBreakpointValue} from "@chakra-ui/react";
import {commonInputStyles} from "../../../../constants/styles";
import { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import Row from "../../../../components/Row";

const PartiTab = () => {
    const [showParticipants, setShowParticipants] = useState(true);
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
            key="parti"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={tabVariants}
            transition={{ duration: 0.5 }}>
            <Column gap={4}>
                <Column
                    p={4}
                    gap={4}
                    bgColor={`rgba(${COLOR_PRIMARY_RGB}, 0.7)`}
                    borderRadius="12px"
                    color={'white'}
                    position="relative">
                    <Text fontSize={'larger'} fontWeight={600}>Participants</Text>
                    <Input placeholder="Find participants" {...commonInputStyles} />
                    <Button
                        rightIcon={showParticipants ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => setShowParticipants(!showParticipants)}
                        mt={2}
                    >
                        {showParticipants ? 'Hide All' : 'Show All'}
                    </Button>
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

export default PartiTab;