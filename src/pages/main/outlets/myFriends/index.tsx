import Center from "../../../../components/Center";
import {
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Box,
  useBreakpointValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { commonInputStyles } from "../../../../constants/styles";
import { CustomFormControl } from "../../../main/outlets/addEvent//CustomFormControl";
import { COLOR_PRIMARY_RGB } from "../../../../constants/palatte";
import { useState } from "react";
import User from "../../../../models/User";
import ListUser from "./ListUser";

const userInfo: User[] = [
  {
    profilePic: "profilePic",
    username: "Minnie",
    nickname: "Minnie",
    password: "12345",
    email: "minnie@gmail.com.hk",
    gender: "Female",
    dob: "2000-01-01",
    phoneNumber: "12345678",
    emergencyPerson: "Mini",
    emergencyContact: "87654321",
  },
  {
    profilePic: "profilePic",
    username: "Mi",
    nickname: "Mi",
    password: "12345",
    email: "Mi@gmail.com.hk",
    gender: "Female",
    dob: "2000-02-02",
    phoneNumber: "12345678",
    emergencyPerson: "Pe",
    emergencyContact: "87654321",
  },
  {
    profilePic: "profilePic",
    username: "Mini",
    nickname: "Mini",
    password: "12345",
    email: "mini@gmail.com.hk",
    gender: "Female",
    dob: "2000-03-03",
    phoneNumber: "12345678",
    emergencyPerson: "Jo",
    emergencyContact: "87654321",
  },
  {
    profilePic: "profilePic",
    username: "Ada",
    nickname: "Ada",
    password: "12345",
    email: "ada@gmail.com.hk",
    gender: "Female",
    dob: "2000-04-04",
    phoneNumber: "12345678",
    emergencyPerson: "Da",
    emergencyContact: "87654321",
  },
];
const friendsInfo: User[] = [
  {
    profilePic: "profilePic",
    username: "Minnie",
    nickname: "Minnie",
    password: "12345",
    email: "minnie@gmail.com.hk",
    gender: "Female",
    dob: "2000-01-01",
    phoneNumber: "12345678",
    emergencyPerson: "Mini",
    emergencyContact: "87654321",
  },
  {
    profilePic: "profilePic",
    username: "Peter",
    nickname: "Peter",
    password: "12345",
    email: "peter@gmail.com.hk",
    gender: "Male",
    dob: "2000-02-02",
    phoneNumber: "12345678",
    emergencyPerson: "Pe",
    emergencyContact: "87654321",
  },
];

function MyFriendsPage() {
  const [value, setValue] = useState("");
  const [filteredUser, setFilteredUser] = useState<User[]>([]);
  const isMobile = useBreakpointValue({ base: true, md: false });

  function handleSearch(event: any) {
    setValue(event.target.value);
    if (value !== "") {
      const user = userInfo.filter((user) =>
        user.username.toLowerCase().includes(event.target.value.toLowerCase())
      );

      setFilteredUser([...user]);
    }
  }
  return (
    <div>
      <Center>
        <Tabs>
          <TabList>
            <Tab>My Friends</Tab>
            <Tab>Search Friends</Tab>
          </TabList>{" "}
          <TabPanels>
            <TabPanel>
              <ListUser users={friendsInfo} />
            </TabPanel>
            <TabPanel>
              <Box mt={12}>
                <CustomFormControl>
                  <InputGroup>
                    <Input
                      h="4rem"
                      w={isMobile ? "100vw" : "55vw"}
                      onChange={handleSearch}
                      value={value}
                      placeholder="Query name of user"
                      {...commonInputStyles}
                    />
                    <InputRightElement width="4rem">
                      <Button
                        mt="23px"
                        h="4rem"
                        size="lg"
                        color="white"
                        bgColor={`rgba(${COLOR_PRIMARY_RGB},0.3)`}
                      >
                        <SearchIcon />
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </CustomFormControl>
                {value !== "" && <ListUser users={filteredUser} />}
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Center>
    </div>
  );
}

export default MyFriendsPage;
