import Column from "../../../../components/Column";
import { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Box,
  Center,
  Flex,
  Input,
  Select,
  InputLeftAddon,
  InputGroup,
  Button,
  Text,
  ButtonGroup,
  Spacer,
  InputRightElement,
  ModalFooter,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { COLOR_PRIMARY_RGB } from "../../../../constants/palatte";
import { CustomFormControl } from "../../../main/outlets/addEvent//CustomFormControl";
import { commonInputStyles } from "../../../../constants/styles";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const FlexBox = styled(Flex)({
  flexDirection: "row",
  gap: 20,
  "@media (max-width: 600px)": {
    flexDirection: "column",
  },
});

const FlexNew = styled(Flex)({
  flexDirection: "row",
  "@media (max-width: 600px)": {
    flexDirection: "column",
  },
});

const FlexBox2 = styled(Flex)({
  flexDirection: "row",
  gap: 30,
  "@media (max-width: 960px)": {
    flexDirection: "column",
  },
});

const NewBox = styled(Box)({
  padding: "10px",
  marginTop: "20px",
  width: "100%",
  "@media (min-width: 600px)": {
    paddingTop: "7rem",
    width: "90%",
  },

  "@media (min-width: 1200px)": {
    paddingTop: "7rem",
    width: "80%",
  },

  "@media (min-width: 1800px)": {
    paddingTop: "7rem",
    width: "70%",
  },
});

const genderOptions = [
  {
    value: "female",
    text: "Female",
  },
  {
    value: "male",
    text: "Male",
  },
  {
    value: "other",
    text: "Other",
  },
];

function MyProfilePage() {
  const [isValidationSuccessful, setIsValidationSuccessful] =
    useState<boolean>(false);
  const [isOnClickDeleteAccount, setIsOnClickDeleteAccount] =
    useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const userInfo = {
    username: "Minnie",
    nickname: "Minnie",
    password: "12345",
    email: "minnie@gmail.com.hk",
    gender: "Female",
    dob: new Date("2000-01-01"),
    phoneNumber: "12345678",
    emergencyPerson: "Mini",
    emergencyContact: "87654321",
  };

  const [username, setUsername] = useState(userInfo.username);
  const [nickname, setNickname] = useState(userInfo.nickname);
  const [password, setPassword] = useState(userInfo.password);
  const [confirmPassword, setConfirmPassword] = useState(userInfo.password);
  const [email, setEmail] = useState(userInfo.email);
  const [gender, setGender] = useState(userInfo.gender);
  const [dob, setDOB] = useState(new Date(userInfo.dob));
  const [phoneNumber, setPhoneNumber] = useState(userInfo.phoneNumber);
  const [emergencyPerson, setEmergencyPerson] = useState(
    userInfo.emergencyPerson
  );
  const [emergencyContact, setEmergencyContact] = useState(
    userInfo.emergencyContact
  );

  const [isReadonly, setIsReadonly] = useState<boolean>(true);

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const handleClickPassword = () => setShow(!show);
  const handleClickConfirmPassword = () => setShow2(!show2);

  const handleEditProfile = () => {
    setIsReadonly(!isReadonly);
  };

  const validateFormData = () => {
    let validationErrors = [];
    if (!username) {
      validationErrors.push("The field 'Username' is required.");
    }
    if (!email) {
      validationErrors.push("The field 'Email' is required.");
    }
    if (!password) {
      validationErrors.push("The field 'Password' is required.");
    }
    if (!confirmPassword) {
      validationErrors.push("The field 'Confirm Password' is required.");
    }
    if (password !== confirmPassword) {
      validationErrors.push(
        "The field 'Password' and 'Confirm Password'  do not match."
      );
    }
    return {
      isValid: validationErrors.length === 0,
      messages: validationErrors,
    };
  };

  const renderErrorList = () => (
    <ul>
      {validationErrors.map((error, index) => (
        <li key={index}>{error}</li>
      ))}
    </ul>
  );

  const handleChangeUsername = (e: any) => {
    setUsername(e.target.value);
  };
  const handleChangeNickname = (e: any) => {
    setNickname(e.target.value);
  };
  const handleChangeEmail = (e: any) => {
    setEmail(e.target.value);
  };
  const handleChangeGender = (e: any) => {
    setGender(e.target.value);
  };
  const handleChangePhoneNumber = (e: any) => {
    setPhoneNumber(e.target.value);
  };
  const handleChangeDOB = (e: any) => {
    setDOB(new Date(e.target.value));
  };
  const handleChangeEmergencyPerson = (e: any) => {
    setEmergencyPerson(e.target.value);
  };
  const handleChangeEmergencyContact = (e: any) => {
    setEmergencyContact(e.target.value);
  };

  const handleChangePassword = (e: any) => {
    setPassword(e.target.value);
  };

  const handleChangeConfirmPassword = (e: any) => {
    setConfirmPassword(e.target.value);
  };

  const handleCancelDeleteAccount = () => {
    onClose();
    setIsOnClickDeleteAccount(false);
  };
  const onCloseModal = () => {
    setIsOnClickDeleteAccount(false);
  };

  const onClickDeleteAccount = () => {
    setIsOnClickDeleteAccount(true);
    onOpen();
  };
  const handleDeleteAccount = () => {
    onClose();
    setIsOnClickDeleteAccount(false);
  };
  const handleUpdateProfile = () => {
    const validation = validateFormData();

    if (validation.isValid) {
      //   const data = {
      //     Username: username,
      //     Nickname: nickname,
      //     Email: email,
      //     Gender: gender,
      //     dob: dob,
      //     PhoneNumber: phoneNumber,
      //     EmergencyPerson: emergencyPerson,
      //     EmergencyContact: emergencyContact,
      //   };
      // ApiService.signUp(data);

      setIsReadonly(true);
      setIsValidationSuccessful(true);
      setValidationErrors([]);
      // const redirectPath = sessionStorage.getItem("redirectPath");
      // if (redirectPath) {
      //   navigate(redirectPath);
      //   sessionStorage.removeItem("redirectPath");
      // } else {
      //   navigate(routes.SIGNIN.path);
      // }
    } else {
      setValidationErrors(validation.messages);
      setIsValidationSuccessful(false);
    }
    onOpen();
  };

  return (
    <Box
      style={{
        overflowY: "scroll",
      }}
    >
      <Center>
        <NewBox>
          <Column gap={8}>
            <Flex direction="column">
              <FlexNew minWidth="max-content" alignItems="center" gap="2">
                <Box>
                  <Text className="page-title">My Profile</Text>
                </Box>
                <Spacer />
                <ButtonGroup gap="3" alignItems="right">
                  <Button
                    color="white"
                    bgColor={`rgba(${COLOR_PRIMARY_RGB},0.8)`}
                    _hover={{ bgColor: `rgba(${COLOR_PRIMARY_RGB},0.6)` }}
                    onClick={handleEditProfile}
                  >
                    {isReadonly ? "Edit Profile" : "Cancel"}
                  </Button>
                  <Spacer />
                  <Button
                    color="white"
                    bgColor="red"
                    _hover={{ bgColor: `rgba(${COLOR_PRIMARY_RGB},0.6)` }}
                    onClick={onClickDeleteAccount}
                  >
                    Delete Account
                  </Button>
                </ButtonGroup>
              </FlexNew>
              <Box h={2}>
                <Text>
                  {!isReadonly
                    ? "Please edit your account information below."
                    : ""}
                </Text>
              </Box>
            </Flex>
            <Column
              overflowX={"auto"}
              bgColor={`rgba(${COLOR_PRIMARY_RGB}, 0.6)`}
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
            >
              <FlexBox2>
                <Column gap={5} flex={1}>
                  <FlexBox>
                    <CustomFormControl label="Username" isRequired>
                      <Input
                        {...commonInputStyles}
                        value={username}
                        onChange={handleChangeUsername}
                        readOnly={isReadonly}
                      />
                    </CustomFormControl>
                    <CustomFormControl label="Nickname">
                      <Input
                        {...commonInputStyles}
                        value={nickname}
                        onChange={handleChangeNickname}
                        readOnly={isReadonly}
                      />
                    </CustomFormControl>
                  </FlexBox>
                  <FlexBox>
                    <CustomFormControl label="Password" isRequired>
                      <InputGroup size="md">
                        <Input
                          {...commonInputStyles}
                          type={show ? "text" : "password"}
                          readOnly={isReadonly}
                          value={password}
                          onChange={handleChangePassword}
                        />
                        <InputRightElement width="4.5rem">
                          <Button
                            h="1.75rem"
                            size="sm"
                            color="white"
                            bgColor={`rgba(${COLOR_PRIMARY_RGB},0.5)`}
                            _hover={{
                              bgColor: `rgba(${COLOR_PRIMARY_RGB},0.3)`,
                            }}
                            onClick={handleClickPassword}
                          >
                            {show ? <ViewOffIcon /> : <ViewIcon />}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </CustomFormControl>
                    <CustomFormControl label="Confirm Password" isRequired>
                      <InputGroup size="md">
                        <Input
                          {...commonInputStyles}
                          type={show2 ? "text" : "password"}
                          readOnly={isReadonly}
                          value={confirmPassword}
                          onChange={handleChangeConfirmPassword}
                        />
                        <InputRightElement width="4.5rem">
                          <Button
                            h="1.75rem"
                            size="sm"
                            color="white"
                            bgColor={`rgba(${COLOR_PRIMARY_RGB},0.5)`}
                            _hover={{
                              bgColor: `rgba(${COLOR_PRIMARY_RGB},0.3)`,
                            }}
                            onClick={handleClickConfirmPassword}
                          >
                            {show2 ? <ViewOffIcon /> : <ViewIcon />}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </CustomFormControl>
                  </FlexBox>
                  <CustomFormControl isRequired label="Email">
                    <Input
                      {...commonInputStyles}
                      value={email}
                      onChange={handleChangeEmail}
                      readOnly={isReadonly}
                    />
                  </CustomFormControl>
                  <FlexBox>
                    <CustomFormControl label="Gender" minWidth={"40%"} flex={1}>
                      <Select
                        // defaultValue={genderRef.current?.value}
                        defaultValue={gender}
                        onChange={handleChangeGender}
                        disabled={isReadonly}
                        {...commonInputStyles}
                      >
                        {genderOptions.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.text}
                          </option>
                        ))}
                      </Select>
                    </CustomFormControl>
                    <CustomFormControl label="Phone Number">
                      <InputGroup>
                        <InputLeftAddon {...commonInputStyles}>
                          +852
                        </InputLeftAddon>

                        <Input
                          value={phoneNumber}
                          {...commonInputStyles}
                          onChange={handleChangePhoneNumber}
                          readOnly={isReadonly}
                        />
                      </InputGroup>
                    </CustomFormControl>
                  </FlexBox>
                  <CustomFormControl label="Date Of Birth">
                    <Input
                      size="md"
                      type="date"
                      value={dob.toISOString().split("T")[0]}
                      {...commonInputStyles}
                      onChange={handleChangeDOB}
                    />
                  </CustomFormControl>
                  <FlexBox>
                    <CustomFormControl label="Emergency Person">
                      <Input
                        value={emergencyPerson}
                        {...commonInputStyles}
                        onChange={handleChangeEmergencyPerson}
                        readOnly={isReadonly}
                      />
                    </CustomFormControl>
                    <CustomFormControl label="Emergency Contact">
                      <Input
                        value={emergencyContact}
                        {...commonInputStyles}
                        onChange={handleChangeEmergencyContact}
                        readOnly={isReadonly}
                      />
                    </CustomFormControl>
                  </FlexBox>
                </Column>
              </FlexBox2>
            </Column>
            {!isReadonly && (
              <Button
                mt={3}
                height={"60px"}
                color="white"
                bgColor={`rgba(${COLOR_PRIMARY_RGB},1)`}
                _hover={{ bgColor: `rgba(${COLOR_PRIMARY_RGB},0.8)` }}
                onClick={handleUpdateProfile}
              >
                Update Profile
              </Button>
            )}
            <Modal
              isOpen={isOpen}
              onClose={() => {
                onClose();
                onCloseModal();
              }}
            >
              <ModalOverlay />
              <ModalContent mx={4}>
                <ModalHeader>
                  {isValidationSuccessful &&
                    !isOnClickDeleteAccount &&
                    "Profile successfully updated."}
                  {!isValidationSuccessful && "Profile Update Failure"}
                  {isOnClickDeleteAccount && "Delete Account"}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody px={10} py={4}>
                  {!isValidationSuccessful && renderErrorList()}
                  {isOnClickDeleteAccount &&
                    "Are you sure? You can't undo this action afterwards."}
                </ModalBody>
                {isOnClickDeleteAccount && (
                  <ModalFooter>
                    <Button onClick={handleCancelDeleteAccount}>Cancel</Button>
                    <Button
                      colorScheme="red"
                      onClick={handleDeleteAccount}
                      ml={3}
                    >
                      Delete
                    </Button>
                  </ModalFooter>
                )}
              </ModalContent>
            </Modal>
          </Column>
        </NewBox>
      </Center>
    </Box>
  );
}

export default MyProfilePage;
