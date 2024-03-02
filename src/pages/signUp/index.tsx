import Column from "../../components/Column";
import { useState, useRef } from "react";
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
  Avatar,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { COLOR_PRIMARY_RGB } from "../../constants/palatte";
import { CustomFormControl } from "../main/outlets/addEvent//CustomFormControl";
import { commonInputStyles } from "../../constants/styles";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";
import image from "../../assets/images/bgImage2.png";
import AuthServices from "../../services/authServices";
import User from "../../models/User";
import UserServices from "../../services/userServices";

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

const FlexBox = styled(Flex)({
  flexDirection: "row",
  gap: 20,
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

function SignUpPage() {
  const [isValidationSuccessful, setIsValidationSuccessful] =
    useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalContent] = useState("");

  const [profilePicFormData, setProfilePicFormData] = useState({});

  const [Icon, setIcon] = useState<string>("");

  const [profilePic, setProfilePic] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [dob, setDOB] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [emergencyPerson, setEmergencyPerson] = useState<string>("");
  const [emergencyContact, setEmergencyContact] = useState<string>("");

  const [hasError, setHasError] = useState<boolean>(false);

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const handleClickPassword = () => setShow(!show);
  const handleClickConfirmPassword = () => setShow2(!show2);

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    hiddenFileInput.current?.click();
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
    setDOB(e.target.value);
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

  const navigate = useNavigate();

  const havingAccount = () => {
    navigate(routes.SIGNIN.path);
  };
  const backToHome = () => {
    navigate(routes.MAIN.path);
  };

  const handleUploadIcon = (e: any) => {
    if (e.target.files.length !== 0) {
      setIcon("");
      setIcon(URL.createObjectURL(e.target.files[0]));
      const formData = new FormData();
      formData.append(
        "file",
        e.target.files[0],
        email.substring(0, email.indexOf("@")) + "_" + e.target.files[0].name
      );
      console.log("formdata : " + formData);
      setProfilePicFormData(formData);
      setProfilePic(
        email.substring(0, email.indexOf("@")) + "_" + e.target.files[0].name
      );
      console.log("profilePic : " + profilePic);
    }
  };

  const handleSignUp = async () => {
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
      const response = await AuthServices.signUp(data);
      if (
        !(
          Object.keys(profilePicFormData).length === 0 &&
          profilePicFormData.constructor === Object
        )
      ) {
        //await UserServices.saveProfilePic(profilePicFormData);
      }
      if (response) {
        setIsValidationSuccessful(true);
        setValidationErrors([]);
        const redirectPath = sessionStorage.getItem("redirectPath");
        if (redirectPath) {
          navigate(redirectPath);
          sessionStorage.removeItem("redirectPath");
        } else {
          navigate(routes.SIGNIN.path);
        }
      } else if(!response) {
        setHasError(true);
      }
    } else {
      setValidationErrors(validation.messages);
      setIsValidationSuccessful(false);
    }
    onOpen();
  };

  return (
    <Column gap={5}>
      <Box
        style={{
          backgroundImage: `url(${image})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: "100vh",
          width: "100vw",
          opacity: "0.9",
          overflowY: "scroll",
        }}
      >
        <Center>
          <NewBox>
            <Column gap={9}>
              <Flex minWidth="max-content" alignItems="center" gap="2">
                <Box p="2">
                  <Text className="page-title">Sign Up</Text>
                </Box>
                <Spacer />
                <ButtonGroup gap="2">
                  <Button
                    color="white"
                    bgColor={`rgba(${COLOR_PRIMARY_RGB},0.8)`}
                    _hover={{ bgColor: `rgba(${COLOR_PRIMARY_RGB},0.6)` }}
                    onClick={havingAccount}
                  >
                    Sign in
                  </Button>
                  <Button
                    color="white"
                    bgColor={`rgba(${COLOR_PRIMARY_RGB},0.8)`}
                    _hover={{ bgColor: `rgba(${COLOR_PRIMARY_RGB},0.6)` }}
                    onClick={backToHome}
                  >
                    Back to home
                  </Button>
                </ButtonGroup>
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
                          onChange={handleChangeUsername}
                          value={username}
                          {...commonInputStyles}
                        />
                      </CustomFormControl>
                      <CustomFormControl label="Nickname">
                        <Input
                          onChange={handleChangeNickname}
                          value={nickname}
                          {...commonInputStyles}
                        />
                      </CustomFormControl>
                    </FlexBox>
                    <FlexBox>
                      <CustomFormControl label="Password" isRequired>
                        <InputGroup size="md">
                          <Input
                            value={password}
                            onChange={handleChangePassword}
                            {...commonInputStyles}
                            type={show ? "text" : "password"}
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
                            value={confirmPassword}
                            onChange={handleChangeConfirmPassword}
                            {...commonInputStyles}
                            type={show2 ? "text" : "password"}
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
                        value={email}
                        onChange={handleChangeEmail}
                        {...commonInputStyles}
                      />
                    </CustomFormControl>
                    <FlexBox>
                      <CustomFormControl
                        label="Gender"
                        minWidth={"40%"}
                        flex={1}
                      >
                        <Select
                          defaultValue={gender}
                          onChange={handleChangeGender}
                          placeholder="Select Gender"
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
                            onChange={handleChangePhoneNumber}
                            {...commonInputStyles}
                          />
                        </InputGroup>
                      </CustomFormControl>
                    </FlexBox>
                    <CustomFormControl label="Date Of Birth">
                      <Input
                        value={dob}
                        onChange={handleChangeDOB}
                        placeholder="Select Date Of Birth"
                        size="md"
                        type="date"
                        {...commonInputStyles}
                      />
                    </CustomFormControl>
                    <FlexBox>
                      <CustomFormControl label="Emergency Person">
                        <Input
                          value={emergencyPerson}
                          onChange={handleChangeEmergencyPerson}
                          {...commonInputStyles}
                        />
                      </CustomFormControl>
                      <CustomFormControl label="Emergency Contact">
                        <Input
                          value={emergencyContact}
                          onChange={handleChangeEmergencyContact}
                          {...commonInputStyles}
                        />
                      </CustomFormControl>
                    </FlexBox>
                    <CustomFormControl label="Profile Picture:">
                      <Button
                        variant="solid"
                        style={{ maxWidth: "26vw", minWidth: "10vw" }}
                        colorScheme="teal"
                        onClick={handleClick}
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
                    </CustomFormControl>
                  </Column>
                </FlexBox2>
              </Column>

              <Button
                mt={3}
                height={"60px"}
                color="white"
                bgColor={`rgba(${COLOR_PRIMARY_RGB},1)`}
                _hover={{ bgColor: `rgba(${COLOR_PRIMARY_RGB},0.8)` }}
                onClick={handleSignUp}
              >
                Submit
              </Button>
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent mx={4}>
                  <ModalHeader>
                    {(!isValidationSuccessful || hasError) && "Sign up Failure"}
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody px={10} py={4}>
                    {isValidationSuccessful ? modalContent : renderErrorList()}
                    {hasError && "Email already exist !"}
                  </ModalBody>
                </ModalContent>
              </Modal>
            </Column>
          </NewBox>
        </Center>
      </Box>
    </Column>
  );
}

export default SignUpPage;
