import styled from "@emotion/styled";
import { COLOR_PRIMARY_RGB } from "../../../../constants/palatte";
import {
  Select,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Box,
  Text,
  Flex,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { commonInputStyles } from "../../../../constants/styles";
import { CustomFormControl } from "../../../main/outlets/addEvent//CustomFormControl";
import { GrMapLocation } from "react-icons/gr";
// import { useNavigate } from "react-router-dom";
// import { routes } from "../../../../constants/routes";

const eventTypes = [
  {
    value: "race",
    text: "Race",
  },
  {
    value: "companion",
    text: "Companion",
  },
  {
    value: "challenge",
    text: "Challenge",
  },
];

const sortByTypes = [
  {
    value: "title",
    text: "Title",
  },
  {
    value: "date",
    text: "Date ",
  },
];

const FlexMain = styled(Flex)({
  flexDirection: "row",
  paddingRight: 40,
  paddingLeft: 30,
  paddingTop: 10,
  paddingBottom: 10,
  "@media (max-width: 1000px)": {
    flexDirection: "column",
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
});
const FlexMobileMain = styled(Flex)({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-around",
});
const FlexMobileMain2 = styled(Flex)({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-around",
  gap: 30,
  "@media (max-width: 1000px)": {
    gap: 0,
  },
});

const FlexSortBy = styled(Flex)({
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
  "@media (max-width: 1000px)": {
    flexDirection: "column",
    gap: 0,
  },
});

const FlexSortByButton = styled(Flex)({
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
  "@media (max-width: 600px)": {
    gap: 8,
  },
});
const NewText = styled(Text)({
  fontSize: "20px",
  textAlign: "center",
  "@media (max-width: 600px)": {
    fontSize: "12px",
  },
});
const BoxNearestEvent = styled(Box)({
  width: "20%",
  "@media (max-width: 600px)": {
    width: "25%",
  },
  "@media (max-width: 1000px)": {
    width: "30%",
  },
});
const BoxNearestEventIcon = styled(Box)({
  width: "100%",
  paddingLeft: "35%",
  "@media (max-width: 600px)": {
    width: 90,
  },
});
const NewButton = styled(Button)({
  "@media (max-width: 600px)": {
    width: "30px",
    height: "25px",
  },
});

interface SearchAndFilterEventProps {
  onSearch: (event: any) => void;
  onSort: (sortBy: string) => void;
  onShowNearestEvent: () => void;
  onChangeEventType: (event: any) => void;
  value: string;
}

function SearchAndFilterEvent({
  onSearch,
  onSort,
  onShowNearestEvent,
  onChangeEventType,
  value,
}: SearchAndFilterEventProps) {
  // const navigate = useNavigate();
  return (
    <FlexMain overflowX={"auto"} bgColor={`rgba(${COLOR_PRIMARY_RGB}, 0.6)`}>
      <FlexMobileMain>
        <BoxNearestEvent style={{ cursor: "pointer" }}>
          <CustomFormControl>
            <BoxNearestEventIcon
              onClick={onShowNearestEvent}
              color={"black"}
              _hover={{ color: "white" }}
            >
              <GrMapLocation size="40%" />
            </BoxNearestEventIcon>
            <NewText>Nearest Event</NewText>
          </CustomFormControl>
        </BoxNearestEvent>
        <Box>
          <CustomFormControl>
            <Select
              placeholder="- Event Type -"
              onChange={onChangeEventType}
              {...commonInputStyles}
            >
              {eventTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.text}
                </option>
              ))}
            </Select>
          </CustomFormControl>
        </Box>
        <Box>
          <CustomFormControl>
            <FlexSortBy>
              <NewText>Sort by :</NewText>
              <FlexSortByButton>
                {sortByTypes.map((type) => (
                  <NewButton
                    color="white"
                    bgColor={`rgba(${COLOR_PRIMARY_RGB},0.3)`}
                    _hover={{ bgColor: `rgba(${COLOR_PRIMARY_RGB},0.2)` }}
                    onClick={() => onSort(type.value)}
                    key={type.value}
                    value={type.value}
                  >
                    <NewText>{type.text}</NewText>
                  </NewButton>
                ))}
              </FlexSortByButton>
            </FlexSortBy>
          </CustomFormControl>
        </Box>
      </FlexMobileMain>
      <FlexMobileMain2>
        <Box>
          <CustomFormControl>
            <InputGroup>
              <Input
                onChange={onSearch}
                value={value}
                placeholder="Query name of event"
                {...commonInputStyles}
              />
              <InputRightElement width="3rem">
                <Button
                  h="2.5rem"
                  size="md"
                  color="white"
                  bgColor={`rgba(${COLOR_PRIMARY_RGB},0.2)`}
                >
                  <SearchIcon />
                </Button>
              </InputRightElement>
            </InputGroup>
          </CustomFormControl>
        </Box>
        <Box>
          <CustomFormControl>
            <Button
              colorScheme="yellow.700"
              variant="outline"
              bgColor={`rgba(${COLOR_PRIMARY_RGB},0.2)`}
              _hover={{
                bgColor: `rgba(${COLOR_PRIMARY_RGB},0.2)`,
                color: "white",
              }}
            >
              <NewText>Add Event</NewText>
            </Button>
          </CustomFormControl>
        </Box>
      </FlexMobileMain2>
    </FlexMain>
  );
}
export default SearchAndFilterEvent;
