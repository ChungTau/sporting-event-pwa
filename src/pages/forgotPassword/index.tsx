import { useNavigate } from "react-router-dom";
import Column from "../../components/Column";
import InputForm, { InputFormRef } from "./InputForm";
import { ForgotPasswordHeader } from "./ForgotPasswordHeader";
import { ForgotPasswordFooter } from "./ForgotPasswordFooter";
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
import emailjs, { EmailJSResponseStatus } from "@emailjs/browser";
import AuthServices from "../../services/authServices";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [isValidationSuccessful, setIsValidationSuccessful] =
    useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const inputFormRef = useRef<InputFormRef>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalContent, setModalContent] = useState("");
  const [hasError, setHasError] = useState<boolean>(false);
  const dispatch = useDispatch();

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

  const validateFormData = (formData: { email: string }) => {
    let validationErrors = [];

    if (!formData.email) {
      validationErrors.push("Please enter your email address.");
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

  const handleBackToLogin = () => {
    navigate(routes.SIGNIN.path);
  };

  type EmailTemplateParams = {
    email: string;
    username: string;
    resetPasswordURL: string;
  };

  const handleForgotPassword = async () => {
    if (inputFormRef.current) {
      const formData = inputFormRef.current.getFormData();
      const validation = validateFormData(formData);
      var user;
      if (validation.isValid) {
        user = await AuthServices.forgotPassword(formData.email);
        console.log("user" + JSON.stringify(user));
        setIsValidationSuccessful(true);
        setValidationErrors([]);
      } else {
        setValidationErrors(validation.messages);
        setIsValidationSuccessful(false);
      }
      if (user === 0) {
        setHasError(true);
      } else {
        setIsValidationSuccessful(true);
        setValidationErrors([]);
        // console.log("user.username : " + user.username);
        // console.log("user.username : " + user.email);
        // setUsername(user.username);
        // setEmail(user.email);
        // console.log("email:" + email);
        dispatch(setUser(user.email));
        const emailTemplateParams: EmailTemplateParams = {
          email:  user.email,
          username: user.username,
          resetPasswordURL: `http://localhost:3000/reset-Password/${user.email}`,
        };
        const params: Record<string, unknown> = emailTemplateParams;

        emailjs
          .send(
            "service_601ujuj",
            "template_r4hui4s",
            params,
            "crbiHgViBv7eYf8bC"
          )
          .then(
            (response: EmailJSResponseStatus) => {
              console.log("SUCCESS!", response.status, response.text);
            },
            (error: any) => {
              console.log("FAILED...", error);
            }
          );

        setModalContent(
          "A reset pasword email will be sent to your email address. Please check your email."
        );
     
      } // please comment this line if you test the backend
      //   }                                                                           // please uncomment this line if you test the backend
      onOpen();
    }
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
            <ForgotPasswordHeader backToLogin={handleBackToLogin} />
            <InputForm ref={inputFormRef} />
            <ForgotPasswordFooter onForgotPassword={handleForgotPassword} />
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent mx={4}>
                <ModalHeader>
                  {(!isValidationSuccessful || hasError)?
                    "Email address Validation Failure":"Email address Validation Success"}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody px={10} py={4}>
                  {isValidationSuccessful ? modalContent : renderErrorList()}
                  {hasError && "Something has wrong !"}
                </ModalBody>
              </ModalContent>
            </Modal>
          </Column>
        </NewBox>
      </Center>
    </Box>
  );
}

export default ForgotPasswordPage;
