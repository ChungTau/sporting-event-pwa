import Center from "../../../../components/Center";
import * as React from "react";
import { COLOR_PRIMARY_RGB } from "../../../../constants/palatte";
import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Select,
  Flex,
  Spacer,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Box,
} from "@chakra-ui/react";

import { SearchIcon} from "@chakra-ui/icons";
import { BsPause } from "react-icons/bs";

const eventTypes = [
  {
    value: "race",
    text: "Race",
  },
  {
    value: "companion",
    text: "Companion ",
  },
  {
    value: "challenge ",
    text: "Challenge ",
  },
];
function SearchAndFilterEvent() {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  return (
    <Flex
      flexDirection="row"
      bgColor={`rgba(${COLOR_PRIMARY_RGB}, 0.7)`}
      borderRadius={15}
      h="10vh"
    >
      <Center>
        <Box w="10vw">
          <RangeSlider
            
            defaultValue={[1, 100]}
            onChangeEnd={(val) => console.log(val)}
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack bg="tomato" />
            </RangeSliderTrack>
            <RangeSliderThumb boxSize={6} index={0}>
              <Box color="tomato" as={BsPause} />
            </RangeSliderThumb>
            <RangeSliderThumb boxSize={6} index={1}>
              <Box color="tomato" as={BsPause} />
            </RangeSliderThumb>
          </RangeSlider>
        </Box>
      </Center>
      <Spacer />
      <Center>
        <Box w="10vw">
          <Select placeholder="Select Event Type">
            {eventTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.text}
              </option>
            ))}
          </Select>
        </Box>
      </Center>
      <Spacer />
      <Center>
        <Box w="10vw">
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder="Enter password"
            />
            <InputRightElement width="4.5rem">
              <IconButton
                aria-label="Search database"
                h="1.75rem"
                size="sm"
                icon={<SearchIcon />}
                onClick={handleClick}
              />
            </InputRightElement>
          </InputGroup>
        </Box>
      </Center>
    </Flex>
  );
}

export default SearchAndFilterEvent;
