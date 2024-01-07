import Center from "../../../../components/Center";
import styled from "@emotion/styled";
import SlideShow from "../../../main/outlets/home/SlideShow";
import {
  Card,
  CardHeader,
  Image,
  Text,
  Stack,
  Heading,
  Divider,
  ButtonGroup,
  Button,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";
import { Grid, GridItem } from "@chakra-ui/react";

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const Grid1 = styled(Grid)({
  "@media (min-width: 580px)": {
    gridTemplateColumns: "repeat(1, 1fr)",
  },
  "@media (min-width: 800px)": {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  "@media (min-width: 1000px)": {
    gridTemplateColumns: "repeat(3, 1fr)",
  },
});

function ListEvents() {
  return (
    <Center>
      <Grid1 gap={10}>
        {" "}
        {cards.map((card) => (
          <GridItem key={card}>
            <Card maxW="sm">
              <CardBody>
                <Image
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                  alt="Green double couch with wooden legs"
                  borderRadius="lg"
                />
                <Stack mt="6" spacing="3">
                  <Heading size="md">Living room Sofa</Heading>
                  <Text>
                    This sofa is perfect for modern tropical spaces, baroque
                    inspired spaces, earthy toned spaces and for people who love
                    a chic design with a sprinkle of vintage design.
                  </Text>
                  <Text color="blue.600" fontSize="2xl">
                    $450
                  </Text>
                </Stack>
              </CardBody>
              <Divider />
              <CardFooter>
                <ButtonGroup spacing="2">
                  <Button variant="solid" colorScheme="blue">
                    Buy now
                  </Button>
                  <Button variant="ghost" colorScheme="blue">
                    Add to cart
                  </Button>
                </ButtonGroup>
              </CardFooter>
            </Card>
          </GridItem>
        ))}
      </Grid1>
    </Center>
  );
}

export default ListEvents;
