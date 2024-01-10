import { useDispatch } from "react-redux";
import { setLoggedIn } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import Column from "../../components/Column";
import InputForm, { InputFormRef } from "./InputForm";
import { SignInFooter } from "./SignInFooter";
import { SignInHeader } from "./SignInHeader";
import { useRef, useState } from "react";
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
} from "@chakra-ui/react";
import image from "../../assets/images/bgImage2.png";
import { routes } from "../../constants/routes";
import styled from "@emotion/styled";
import ApiService from "../../service/apiservice";

function SignInPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isValidationSuccessful, setIsValidationSuccessful] =
    useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const inputFormRef = useRef<InputFormRef>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const NewBox = styled(Box)({
    padding: "10px",
    marginTop: "20px",
    width: "95%",
    "@media (min-width: 600px)": {
      paddingTop: "10rem",
      width: "60%",
    },

    "@media (min-width: 1100px)": {
      paddingTop: "10rem",
      width: "45%",
    },

    "@media (min-width: 1600px)": {
      paddingTop: "10rem",
      width: "30%",
    },
  });

  const validateFormData = (formData: {
    password: string;
    username: string;
  }) => {
    let validationErrors = [];

    if (!formData.username) {
      validationErrors.push("The field 'Username' is required.");
    }
    if (!formData.password) {
      validationErrors.push("The field 'Password' is required.");
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

  const handleCreateAccount = () => {
    navigate(routes.SIGNUP.path);
  };

  const handleBackToHome = () => {
    navigate(routes.MAIN.path);
  };

  const handleSignIn = () => {
    if (inputFormRef.current) {
      const formData = inputFormRef.current.getFormData();
      const validation = validateFormData(formData);

      if (validation.isValid) {
        const data = {
          Username: formData.username,
          Password: formData.password,
        };
        ApiService.signIn(data);
        setIsValidationSuccessful(true);
        setValidationErrors([]);
        dispatch(setLoggedIn(true));
        const redirectPath = sessionStorage.getItem("redirectPath");
        if (redirectPath) {
          navigate(redirectPath);
          sessionStorage.removeItem("redirectPath");
        } else {
          navigate(routes.MAIN.path);
        }
      } else {
        setValidationErrors(validation.messages);
        setIsValidationSuccessful(false);
      }
      onOpen();
    }
  };

  const handleForgotPassword = () => {
    navigate(routes.FORGOT_PASSWORD.path);
  };

  return (
    <Box
      style={{
        backgroundImage: `url(${image})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        overflowY: "scroll",
        opacity: "0.9",
      }}
    >
      <Center>
        <NewBox>
          <Column gap={9}>
            <SignInHeader
              createAccount={handleCreateAccount}
              backToHome={handleBackToHome}
            />
            <InputForm ref={inputFormRef} />
            <SignInFooter
              onSignIn={handleSignIn}
              onForgotPassword={handleForgotPassword}
            />
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent mx={4}>
                <ModalHeader>
                  {!isValidationSuccessful && "Sign in Failure"}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody px={10} py={4}>
                  {!isValidationSuccessful && renderErrorList()}
                </ModalBody>
              </ModalContent>
            </Modal>
          </Column>
        </NewBox>
      </Center>
    </Box>
  );
}

export default SignInPage;
