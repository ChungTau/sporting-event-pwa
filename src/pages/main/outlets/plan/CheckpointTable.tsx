import {
    Text,
    useBreakpointValue,
    Box,
    IconButton,
    Collapse,
    Divider,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter
} from "@chakra-ui/react";
import {COLOR_PRIMARY_RGB} from "../../../../constants/palatte";
import {useState} from "react";
import {IoChevronUpOutline, IoChevronDownOutline} from "react-icons/io5";
import Column from "../../../../components/Column";
import Row from "../../../../components/Row";
import {FaTrash} from "react-icons/fa";
import CheckpointModal from "./CheckpointModal";
import {MarkerData, useMap} from "../../../../contexts/MapContext";
import { getServiceIcons } from "../../../../constants/servicesOption";
import { useGPX } from "../../../../contexts/GPXContext";

const CheckpointTable = () => {
    const gpx = useGPX();
    const map = useMap();
    const isMobile = useBreakpointValue({base: true, md: false});
    const checkpoints = map.markers;
    const [isModalOpen,
        setIsModalOpen] = useState < boolean > (false);
    const [editedCheckpoint,
        setEditedCheckpoint] = useState < MarkerData | null > (null);
    const [expandedCheckpoint,
        setExpandedCheckpoint] = useState < number | null > (null);
        const [isRemoveModalOpen, setIsRemoveModalOpen] = useState<boolean>(false);
        const [checkpointToRemove, setCheckpointToRemove] = useState<MarkerData | null>(null);

    const toggleCheckpointDetails = (index : number) => {
        if (expandedCheckpoint === index) {
            setExpandedCheckpoint(null);
        } else {
            setExpandedCheckpoint(index);
        }
    };

    const openRemoveModal = (checkpoint: MarkerData) => {
        setCheckpointToRemove(checkpoint);
        setIsRemoveModalOpen(true);
      };
    
      const closeRemoveModal = () => {
        setCheckpointToRemove(null);
        setIsRemoveModalOpen(false);
      };
    
      const handleRemoveConfirmation = () => {
        if (checkpointToRemove) {
          map.removeMarker(checkpointToRemove.id);
          closeRemoveModal();
        }
      };

    const handleModalClose = () => {

        setIsModalOpen(false);
        setEditedCheckpoint(null); // Reset edited checkpoint data
    };

    const handleEditClick = (checkpoint : MarkerData) => {
        console.log(checkpoint);
        setEditedCheckpoint(checkpoint);
        setIsModalOpen(true);
    };

    const tableContent = (
        <Box
            p={isMobile
            ? 2
            : 4}
            bgColor={`rgba(${COLOR_PRIMARY_RGB}, 0.7)`}
            borderRadius={12}>
            <Box
                p={isMobile
                ? 3
                : 4}
                bgColor="whiteAlpha.200"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderTopRadius={12}
                fontWeight="bold"
                color="gray.100">
                <Text fontSize={'small'} flex="3">Point</Text>
                <Text fontSize={'small'} flex="2">Dist. (KM)</Text>
                {!isMobile && <Text fontSize={'small'} flex="2">Dist. inter(KM)</Text>}
                <Text fontSize={'small'} flex="2" minWidth="90px">
                    Ele. Gain(M)
                </Text>
                <Box width="30px"/> {/* Empty space for the collapse button */}
            </Box>

            {checkpoints.map((pt, index) => {
                const checkpoint = ((pt as any).data as MarkerData);
                const isExpanded = expandedCheckpoint === index;
                const isOddRow = index % 2 === 0;
                const handleModalSubmit = (markerData : MarkerData) => {
                    map.updateMarker(markerData);
                    setIsModalOpen(false);
                    setEditedCheckpoint(null);
                };
                return (
                    <Box
                        key={index}
                        bgColor={"whiteAlpha.200"}
                        borderBottomRadius={index === checkpoints.length - 1
                        ? isExpanded
                            ? 0
                            : 12
                        : 0}>
                        <Box
                            p={isMobile
                            ? 3
                            : 4}
                            bgColor={isOddRow
                            ? "whiteAlpha.200"
                            : "transparent"}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            borderBottomRadius={index === checkpoints.length - 1
                            ? isExpanded
                                ? 0
                                : 12
                            : 0}
                            onClick={() => toggleCheckpointDetails(index)}
                            cursor="pointer"
                            color={"white"}>
                            <Text isTruncated fontSize={'small'} flex="3">{checkpoint.name ?? `CP ${index + 1}`}</Text>
                            <Text fontSize={'small'} flex="2">{checkpoint
                                    .distance
                                    .toFixed(2)}</Text>
                            {!isMobile && <Text fontSize={'small'} flex="2">{checkpoint
                                    .distanceInter
                                    .toFixed(2)}</Text>}
                            <Text fontSize={'small'} flex="2">
                                {checkpoint
                                    .elevationGain
                                    .toFixed(0)}
                            </Text>
                            <IconButton
                                size="small"
                                colorScheme="unset"
                                aria-label={isExpanded
                                ? "Collapse"
                                : "Expand"}
                                icon={isExpanded
                                ? <IoChevronUpOutline/>
                                : <IoChevronDownOutline/>}/>
                        </Box>
                        <Collapse in={isExpanded} animateOpacity>
                            <Column
                                bgColor={isOddRow
                                ? "whiteAlpha.200"
                                : "transparent"}
                                px={isMobile
                                ? 3
                                : 4}
                                pb={2}
                                justifyContent="flex-start"
                                alignItems="flex-start"
                                gap={0}
                                color={'white'}
                                borderBottomRadius={index === checkpoints.length - 1
                                ? isExpanded
                                    ? 12
                                    : 0
                                : 0}>
                                <Divider mb={2}/>
                                <Row
                                    justifyContent={'space-between'}
                                    p={2}
                                    w={'100%'}
                                    bgColor={'blackAlpha.200'}
                                    overflow="hidden">
                                    <Text fontSize="small" fontWeight={600}>{'Point: '}</Text>
                                    <Text fontSize="small" isTruncated>{checkpoint.name}</Text>
                                </Row>

                                <Row justifyContent={'space-between'} p={2} w={'100%'}>
                                    <Text fontSize="small" fontWeight={600}>{'Distance (KM): '}</Text>
                                    <Text fontSize="small">{checkpoint
                                            .distance
                                            .toFixed(2)}</Text>
                                </Row>
                                <Row
                                    justifyContent={'space-between'}
                                    p={2}
                                    w={'100%'}
                                    bgColor={'blackAlpha.200'}>
                                    <Text fontSize="small" fontWeight={600}>{'Distance Inter (KM): '}</Text>
                                    <Text fontSize="small">{checkpoint
                                            .distanceInter
                                            .toFixed(2)}</Text>
                                </Row>
                                <Row justifyContent={'space-between'} p={2} w={'100%'}>
                                    <Text fontSize="small" fontWeight={600}>{'Elevation (M): '}</Text>
                                    <Text fontSize="small">{(checkpoint.elevation as number)
                                            ? (checkpoint.elevation as number).toFixed(0)
                                            : 'UNKNOWN'}</Text>
                                </Row>
                                <Row
                                    justifyContent={'space-between'}
                                    p={2}
                                    w={'100%'}
                                    bgColor={'blackAlpha.200'}>
                                    <Text fontSize="small" fontWeight={600}>{'Elevation Gain (M): '}</Text>
                                    <Text fontSize="small">{checkpoint
                                            .elevationGain
                                            .toFixed(0)}</Text>
                                </Row>
                                <Row justifyContent={'space-between'} p={2} w={'100%'}>
                                    <Text fontSize="small" fontWeight={600}>{'Services: '}</Text>
                                    <Row alignItems={'center'}>
                                        {getServiceIcons(checkpoint.services)}
                                    </Row>
                                </Row>
                                <Row w={'100%'}>
                                    <Button
                                        size={'small'}
                                        py={2}
                                        my={1}
                                        width={'100%'}
                                        onClick={() => handleEditClick(checkpoint)}>
                                        Edit
                                    </Button>
                                    <IconButton
                                        _hover={{
                                        bgColor: '#e3495b'
                                    }}
                                        color={'white'}
                                        bgColor={'#d4394b'}
                                        py={2}
                                        my={1}
                                        w={'40px'}
                                        size={'small'}
                                        aria-label="remove-checkpoint"
                                        icon={< FaTrash />}
                                        onClick={() => openRemoveModal(checkpoint) }
                                        isDisabled={index === 0 || index === checkpoints.length - 1}/>
                                </Row>
                                <CheckpointModal isOpen={isModalOpen} onClose={handleModalClose} onSubmit={handleModalSubmit} checkpointData={editedCheckpoint !} // Pass editedCheckpoint to the modal
                                />

                            </Column>

                        </Collapse>

                    </Box>

                );
            })}
            <Modal isOpen={isRemoveModalOpen} onClose={closeRemoveModal} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Removal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to remove this checkpoint?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeRemoveModal}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleRemoveConfirmation}>
              Remove
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </Box>
    );

    const emptyContent = (
        <Box
            p={isMobile
            ? 2
            : 4}
            bgColor={`rgba(${COLOR_PRIMARY_RGB}, 0.7)`}
            borderRadius={12}>
            <Box
                bgColor={'whiteAlpha.200'}
                alignItems={'center'}
                justifyContent={'center'}
                p={isMobile
                ? 2
                : 4}
                borderRadius={12}
                color={'white'}>
                <Text
                    justifyItems={'center'}
                    fontSize={'medium'}
                    fontWeight={500}
                    textAlign={'center'}>Please upload the route first!</Text>
            </Box>
        </Box>
    );

    return gpx.gpxState.data
        ? tableContent
        : emptyContent
};

export default CheckpointTable;