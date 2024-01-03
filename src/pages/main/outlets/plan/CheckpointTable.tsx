import {useSelector} from "react-redux";
import {RootState} from "../../../../store";
import {
    Text,
    useBreakpointValue,
    Box,
    IconButton,
    Collapse
} from "@chakra-ui/react";
import {COLOR_PRIMARY_RGB} from "../../../../constants/palatte";
import { useState } from "react";
import { IoChevronUpOutline, IoChevronDownOutline } from "react-icons/io5";
import Column from "../../../../components/Column";

const CheckpointTable = () => {
    const {data} = useSelector((state : RootState) => state.gpx);
    const isMobile = useBreakpointValue({base: true, md: false});
    // const checkpoints = useSelector((state : RootState) =>
    // state.checkpoints.checkpoints);
    const [expandedCheckpoint, setExpandedCheckpoint] = useState<number | null>(
        null
      );
    const checkpoints = [
        {
            name: "checkpoint1",
            distance: 100,
            distanceInter: 100,
            elevationGain: 1000
        }, {
            name: "checkpoint2",
            distance: 100,
            distanceInter: 100,
            elevationGain: 1000
        }
    ];

    const toggleCheckpointDetails = (index: number) => {
        if (expandedCheckpoint === index) {
          setExpandedCheckpoint(null);
        } else {
          setExpandedCheckpoint(index);
        }
      };

      const tableContent = (
        <Box p={isMobile ? 2 : 4} bgColor={`rgba(${COLOR_PRIMARY_RGB}, 0.7)`} borderRadius={12}>
          <Box
            p={isMobile ? 2 : 4}
            bgColor="whiteAlpha.200"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderTopRadius={12}
            borderBottom="1px solid white" // Add border styles
            fontWeight="bold"
            color="gray.100"
          >
            <Text flex="1">{isMobile ? "CP" : "Checkpoint"}</Text>
            <Text flex="1">Dist. (km)</Text>
            {!isMobile && <Text flex="1">Dist. inter(M)</Text>}
            <Text flex="1" minWidth="90px">
              Ele. Gain(M)
            </Text>
            <Box width="30px" /> {/* Empty space for the collapse button */}
          </Box>
    
          {checkpoints.map((checkpoint, index) => {
            const isExpanded = expandedCheckpoint === index;
            const isOddRow = index % 2 === 0;
    
            return (
              <Box key={index} bgColor={"whiteAlpha.200"}>
                <Box
                  p={isMobile ? 2 : 4}
                  bgColor={isOddRow ? "whiteAlpha.300" : "transparent"}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom="1px solid white" // Add border styles
                  onClick={() => toggleCheckpointDetails(index)}
                  cursor="pointer"
                  color={"white"}
                >
                  <Text flex="1">{checkpoint.name ?? `CP ${index + 1}`}</Text>
                  <Text flex="1">{checkpoint.distance.toFixed(2)}</Text>
                  {!isMobile && <Text flex="1">{checkpoint.distanceInter.toFixed(2)}</Text>}
                  <Text flex="1" minWidth="90px">
                    {checkpoint.elevationGain.toFixed(0)}
                  </Text>
                  <IconButton
                    size="small"
                    colorScheme="unset"
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                    icon={isExpanded ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                  />
                </Box>
                <Collapse in={isExpanded} animateOpacity>
                  <Column
                    bgColor={isOddRow ? "whiteAlpha.300" : "transparent"}
                    p={isMobile ? 2 : 4}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text fontSize="small">{`CP: ${checkpoint.name}`}</Text>
                  </Column>
                </Collapse>
              </Box>
            );
          })}
        </Box>
      );

    const emptyContent = (
        <Box p={isMobile?2:4} bgColor={`rgba(${COLOR_PRIMARY_RGB}, 0.7)`} borderRadius={12}>
            <Box bgColor={'whiteAlpha.200'} alignItems={'center'} justifyContent={'center'} p={4} borderRadius={12} color={'white'}>
                <Text fontSize={'medium'} fontWeight={500} textAlign={'center'}>Please upload the route first!</Text>
            </Box>
        </Box>
    );

    return data
        ? tableContent
        : emptyContent
};

export default CheckpointTable;