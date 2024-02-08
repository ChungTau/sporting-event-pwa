import {
  GridItem,
  Avatar,
  Button,
  Center,
  Card,
  Heading,
  Flex,
  Grid,
  useBreakpointValue,
} from "@chakra-ui/react";

import Column from "../../../../components/Column";
import User from "../../../../models/User";
import { FaRocketchat } from "react-icons/fa";

interface UserList {
  users: User[];
}

function ListUser(friendList: UserList) {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Column
      overflowX={"auto"}
      bgColor={`rgba(255,255,255,0.5)`}
      px={{
        base: 5,
        sm: 8,
      }}
      py={{
        base: 6,
        sm: 8,
      }}
      gap={5}
      borderRadius={12}
      mt={isMobile ? "8" : "12"}
    >
      <Center>
        <Grid gap={isMobile ? "4" : "8"}>
          {friendList.users.map((list) => (
            <GridItem key={list.nickname}>
              <Card
                direction="row"
                overflow="hidden"
                variant="outline"
                w={isMobile ? "90vw" : "50vw"}
                h={isMobile ? "20" : "24"}
              >
                <Flex
                  direction="row"
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  flexBasis={isMobile ? "96%" : "90%"}
                >
                  <Flex direction="row" alignItems={"center"} flexBasis={"30%"}>
                    <Avatar
                      ml={isMobile ? "3" : "8"}
                      mr={isMobile ? "3" : "8"}
                      name={list.nickname}
                      size={isMobile ? "md" : "lg"}
                      src="https://bit.ly/dan-abramov"
                    />
                    <Heading size={isMobile ? "sm" : "md"}>
                      {list.nickname}
                    </Heading>
                  </Flex>
                  <Button height={"45px"} colorScheme="blue">
                    follow
                  </Button>
                </Flex>
              </Card>
            </GridItem>
          ))}
        </Grid>
      </Center>
    </Column>
  );
}

export default ListUser;
