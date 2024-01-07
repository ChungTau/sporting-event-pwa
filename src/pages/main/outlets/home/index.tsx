import Center from "../../../../components/Center";
import SlideShow from "../../../main/outlets/home/SlideShow";
import ListEvents from "../../../main/outlets/home/ListEvents";
import SearchAndFilterEvent from "../../../main/outlets/home/SearchAndFilterEvent";
import { Flex, Spacer } from '@chakra-ui/react'

function HomePage() {
  return (
    <div>
      <Center>
      <Flex  flexDirection="column" >
        <SlideShow />
        <SearchAndFilterEvent />
        <ListEvents />
        </Flex>
      </Center>
    </div>
  );
}

export default HomePage;
