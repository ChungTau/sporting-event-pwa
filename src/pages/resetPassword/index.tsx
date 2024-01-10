import { useNavigate } from "react-router-dom";
import Column from "../../components/Column";
import InputForm, { InputFormRef } from "./InputForm";
import { ResetPasswordFooter } from "./resetPasswordFooter";
import { ResetPasswordHeader } from "./resetPasswordHeader";
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

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [isValidationSuccessful, setIsValidationSuccessful] =
    useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const inputFormRef = useRef<InputFormRef>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalContent, setModalContent] = useState("");

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
    confirmPassword: string;
  }) => {
    let validationErrors = [];

    if (!formData.password) {
      validationErrors.push("The field 'Password' is required.");
    }
    if (!formData.confirmPassword) {
      validationErrors.push("The field 'Confirm Password' is required.");
    }
    if (formData.password !== formData.confirmPassword) {
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

  const handleBackToHome = () => {
    navigate(routes.MAIN.path);
  };

  const handleResetPassword = () => {
    if (inputFormRef.current) {
      const formData = inputFormRef.current.getFormData();
      const validation = validateFormData(formData);

      if (validation.isValid) {
        ApiService.resetPassword(formData.password);
        setIsValidationSuccessful(true);
        setModalContent("Now you can login your account.");
        setValidationErrors([]);
        navigate(routes.SIGNIN.path);
      } else {
        setValidationErrors(validation.messages);
        setIsValidationSuccessful(false);
      }
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
            <ResetPasswordHeader backToHome={handleBackToHome} />
            <InputForm ref={inputFormRef} />
            <ResetPasswordFooter onResetPassword={handleResetPassword} />
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent mx={4}>
                <ModalHeader>
                  {isValidationSuccessful
                    ? "Successfully reset password!"
                    : "Reset password Failure"}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody px={10} py={4}>
                  {isValidationSuccessful ? modalContent : renderErrorList()}
                </ModalBody>
              </ModalContent>
            </Modal>
          </Column>
        </NewBox>
      </Center>
    </Box>
  );
}

export default ResetPasswordPage;
