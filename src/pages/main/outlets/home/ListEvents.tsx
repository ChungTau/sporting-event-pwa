import styled from "@emotion/styled";
import {
  Card,
  CardHeader,
  Image,
  Text,
  Stack,
  Heading,
  Center,
  Button,
  CardBody,
  CardFooter,
  List,
  ListIcon,
  Box,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";
import { MdCategory, MdOutlinePeopleAlt, MdLocationOn } from "react-icons/md";
import Row from "../../../../components/Row";
import Column from "../../../../components/Column";
import Moment from "moment";
import { COLOR_PRIMARY_RGB } from "../../../../constants/palatte";
import Event from "../../../../models/Event";

const Grid1 = styled(Grid)({
  "@media (min-width: 500px)": {
    gridTemplateColumns: "repeat(1, 1fr)",
  },
  "@media (min-width: 900px)": {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  "@media (min-width: 1200px)": {
    gridTemplateColumns: "repeat(3, 1fr)",
  },
});
interface EventCards {
  eventCards: Event[];
}

function ListEvents(cards: EventCards) {
  return (
    <Column>
      <Center>
        <Grid1 gap={20} mt={12}>
          {cards.eventCards.map((card) => (
            <GridItem key={card.name}>
              <Card w="355px" h="500px" overflow="hidden">
                <Box
                  h={"100%"}
                  backgroundSize="cover"
                  borderRadius="lg"
                  bgPosition="top"
                  transform="scale(1)"
                  _hover={{ transform: "scale(1.1)", transition: "all 0.5s" }}
                  bgImage={`linear-gradient(
                  to bottom,
                  rgba(255, 255, 255, 0),
                  rgba(255, 255, 255, 1)
                ), url("https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80")`}
                >
                  <CardBody position="absolute" bottom={0} ml={4}>
                    <Stack>
                      <Heading size="md">{card.name}</Heading>
                      <List>
                        <Row>
                          <Center>
                            <ListIcon as={MdCategory} color="yellow.900" />
                          </Center>
                          <Text>{card.type}</Text>
                        </Row>

                        <Row>
                          <Center>
                            <ListIcon
                              as={MdOutlinePeopleAlt}
                              color="yellow.900"
                            />
                          </Center>
                          <Text>{card.maxOfParti}</Text>
                        </Row>

                        <Row>
                          <Center>
                            <ListIcon as={MdLocationOn} color="yellow.900" />
                          </Center>
                          <Text>{card.venue.address}</Text>
                        </Row>

                        <Row>
                          <Center>
                            <ListIcon as={CalendarIcon} color="yellow.900" />
                          </Center>
                          <Text>
                            {Moment(card.startDateTime.getTime()).format(
                              "DD/MM/YY"
                            )}
                          </Text>
                        </Row>
                      </List>
                    </Stack>
                  </CardBody>
                </Box>
                <Box>
                  <CardFooter>
                    <Button
                      w="100%"
                      size="lg"
                      color="white"
                      _hover={{ bgColor: `rgba(${COLOR_PRIMARY_RGB},0.6)` }}
                      bgImage={`linear-gradient(to bottom right, rgba(${COLOR_PRIMARY_RGB},0.2), rgba(${COLOR_PRIMARY_RGB},0.9))`}
                    >
                      DETAILS
                    </Button>
                  </CardFooter>
                </Box>
              </Card>
            </GridItem>
          ))}
        </Grid1>
      </Center>
    </Column>
  );
}

export default ListEvents;
