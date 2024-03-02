import Column from "../../../../components/Column";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
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
  ModalFooter,
  Avatar,
  Link,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { COLOR_PRIMARY_RGB } from "../../../../constants/palatte";
import { CustomFormControl } from "../../../main/outlets/addEvent//CustomFormControl";
import { commonInputStyles } from "../../../../constants/styles";
import UserServices from "../../../../services/userServices";
import AuthServices from "../../../../services/authServices";
import User from "../../../../models/User";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../../constants/routes";
import { useParams } from "react-router-dom";

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
  paddingTop: "3rem",
  marginBottom: "5rem",
  width: "95%",
  "@media (min-width: 600px)": {
    width: "90%",
  },

  "@media (min-width: 1100px)": {
    width: "60%",
  },

  "@media (min-width: 1600px)": {
    width: "40%",
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
  const { userEmail } = useParams();

  const [profilePic, setProfilePic] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [dob, setDOB] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [emergencyPerson, setEmergencyPerson] = useState<string>("");
  const [emergencyContact, setEmergencyContact] = useState<string>("");

  const [isReadonly, setIsReadonly] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  //const [Icon, setIcon] = useState<string>("");
  const [profilePicFormData, setProfilePicFormData] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  // const handleUploadIcon = (e: any) => {
  //   if (e.target.files.length !== 0) {
  //     setIcon("");
  //     setIcon(URL.createObjectURL(e.target.files[0]));
  //     const formData = new FormData();
  //     formData.append(
  //       "file",
  //       e.target.files[0],
  //       email.substring(0, email.indexOf("@")) + "_" + e.target.files[0].name
  //     );
  //     console.log("formdata : " + formData);
  //     setProfilePicFormData(formData);
  //     setProfilePic(
  //       email.substring(0, email.indexOf("@")) + "_" + e.target.files[0].name
  //     );
  //     console.log("profilePic : " + profilePic);
  //   }
  // };
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
  const handleChangeGender = (e: any) => {
    setGender(e.target.value);
  };
  const handleChangePhoneNumber = (e: any) => {
    setPhoneNumber(e.target.value);
  };
  const handleChangeDOB = (e: any) => {
    setDOB(e.target.value);
  };
  const handleChangeEmergencyPerson = (e: any) => {
    setEmergencyPerson(e.target.value);
  };
  const handleChangeEmergencyContact = (e: any) => {
    setEmergencyContact(e.target.value);
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
  const handleDeleteAccount = async () => {
    await AuthServices.signOut(dispatch);
    navigate(routes.MAIN.path);
    await UserServices.deleteUser(email, dispatch);
    onClose();

    setIsOnClickDeleteAccount(false);
  };
  const handleUpdateProfile = async () => {
    const validation = validateFormData();
    setHasError(false);
    if (validation.isValid) {
      const data: User = {
        profilePic: profilePic,
        username: username,
        nickname: nickname,
        password: password,
        email: email,
        gender: gender,
        dob: dob,
        phoneNumber: phoneNumber,
        emergencyPerson: emergencyPerson,
        emergencyContact: emergencyContact,
      };
      console.log("data :" + JSON.stringify(data));
      const response = await UserServices.updateMyProfile(data);
      if (
        !(
          Object.keys(profilePicFormData).length === 0 &&
          profilePicFormData.constructor === Object
        )
      ) {
        await UserServices.saveProfilePic(profilePicFormData);
      }
      if (response.status==201) {
        setIsReadonly(true);
        setIsValidationSuccessful(true);
        setValidationErrors([]);
      } else if(response.status==404) {
        setHasError(true);
      }
    } else {
      setValidationErrors(validation.messages);
      setIsValidationSuccessful(false);
    }
    onOpen();
  };

  const fetchUserData = async () => {
    let emailTemp: string = userEmail!;
    console.log("userEmail: " + emailTemp);
    const data = {
      email: emailTemp,
    };
    console.log("data" + JSON.stringify(data));

    const result = await UserServices.getUserByEmail(data);

    setProfilePic(result.profilePic);
    setUsername(result.username);
    setNickname(result.nickname);
    setPassword(result.password);
    setEmail(result.email);
    setGender(result.gender);
    setDOB(result.dob);
    setPhoneNumber(result.phoneNumber);
    setEmergencyPerson(result.emergencyPerson);
    setEmergencyContact(result.emergencyContact);
    if (result.profilePic !== "") {
      //setIcon("http://localhost:5067/image/" + result.profilePic);
    }
    setIsValidationSuccessful(true);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

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
                <ButtonGroup gap="2" alignItems="right">
                  <Button
                    color="white"
                    bgColor={`rgba(${COLOR_PRIMARY_RGB},0.8)`}
                    _hover={{ bgColor: `rgba(${COLOR_PRIMARY_RGB},0.6)` }}
                    onClick={handleEditProfile}
                  >
                    {isReadonly ? "Edit Profile" : "Cancel"}
                  </Button>
                  <Button
                    color="white"
                    bgColor={`rgba(${COLOR_PRIMARY_RGB},0.8)`}
                    _hover={{ bgColor: `rgba(${COLOR_PRIMARY_RGB},0.6)` }}
                  >
                    <Link href={"/reset-Password/" + email}>
                      {" "}
                      Reset Password
                    </Link>
                  </Button>

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
                  <CustomFormControl isRequired label="Email">
                    <Input
                      {...commonInputStyles}
                      value={email}
                      readOnly={true}
                    />
                  </CustomFormControl>
                  <FlexBox>
                    <CustomFormControl label="Gender" minWidth={"40%"} flex={1}>
                      <Select
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
                      value={dob}
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
                  {/* <CustomFormControl label="Profile Picture:">
                    <Button
                      variant="solid"
                      style={{ maxWidth: "26vw", minWidth: "10vw" }}
                      colorScheme="teal"
                      onClick={handleClick}
                      isDisabled={isReadonly}
                    >
                      <p>Upload Icon</p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple={false}
                        onChange={handleUploadIcon}
                        ref={hiddenFileInput}
                        style={{ display: "none" }}
                      />
                    </Button>
                    <Center>
                      <Avatar src={Icon} sx={{ width: 60, height: 60 }} />
                    </Center>
                  </CustomFormControl> */}
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
                  {(!isValidationSuccessful || hasError) &&
                    "Profile Update Failure"}
                  {isOnClickDeleteAccount && "Delete Account"}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody px={10} py={4}>
                  {!isValidationSuccessful && renderErrorList()}
                  {isOnClickDeleteAccount &&
                    "Are you sure? You can't undo this action afterwards."}
                  {hasError && "Something has wrong ! "}
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
