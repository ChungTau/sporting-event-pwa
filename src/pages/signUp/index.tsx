// import {motion} from "framer-motion";
// import Center from "../../components/Center";
// import {fadeVariants} from "../../constants/animateVariant";

// function SignUpPage() {

//     return (
//         <motion.div
//             variants={fadeVariants}
//             initial="hidden"
//             animate="visible"
//             exit="exit"
//             transition={{
//             duration: 0.5
//         }}>
//             <Center>Sign Up Page</Center>
//         </motion.div>
//     );
// };

// export default SignUpPage;

import Column from "../../components/Column";
import InputForm, { InputFormRef } from "./InputForm";
import { SignUpFooter } from "./SignUpFooter";
import { SignUpHeader } from "./SignUpHeader";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import User from "../../models/User";
import AuthServices from '../../services/authServices';
import { useDispatch } from "react-redux";
//import ApiService from "../../service/apiservice";

function SignUpPage() {
  const dispatch = useDispatch();
  const [isValidationSuccessful, setIsValidationSuccessful] =
    useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const inputFormRef = useRef<InputFormRef>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalContent] = useState("");

  const NewBox = styled(Box)({
    padding: "10px",
    marginTop:"20px",
    width: "95%",
    "@media (min-width: 600px)": {
      paddingTop: "7rem",
      width: "90%",
    },

    "@media (min-width: 1100px)": {
      paddingTop: "7rem",
      width: "60%",
    },

    "@media (min-width: 1600px)": {
      paddingTop: "7rem",
      width: "40%",
    },
  });

  const validateFormData = (formData: {
    username: string;
    nickname: string;
    password: string;
    confirmPassword: string;
    email: string;
    gender: string;
    DOB: string;
    phoneNumber: string;
    emergencyPerson: string;
    emergencyContact: string;
  }) => {
    let validationErrors = [];

    if (!formData.username) {
      validationErrors.push("The field 'Username' is required.");
    }
    if (!formData.email) {
      validationErrors.push("The field 'Email' is required.");
    }
    if (!formData.password) {
      validationErrors.push("The field 'Password' is required.");
    }

    if (!formData.confirmPassword) {
      validationErrors.push("The field 'Confirm Password' is required.");
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

  const navigate = useNavigate();

  const handleHavingAccount = () => {
    navigate(routes.SIGNIN.path);
  };

  const handleBackToHome = () => {
    navigate(routes.MAIN.path);
  };

  const handleSignUpSubmit = () => {
    if (inputFormRef.current) {
      const formData = inputFormRef.current.getFormData();
      const validation = validateFormData(formData);

      if (validation.isValid) {
        //setModalContent("Account created successfully!");
        const data:User = {
          username: formData.username,
          nickname: formData.nickname,
          password: formData.password,
          email: formData.email,
          gender: formData.gender,
          dob: formData.DOB,
          phoneNumber: formData.phoneNumber,
          emergencyPerson: formData.emergencyPerson,
          emergencyContact: formData.emergencyContact,
        };
        AuthServices.signUp(data, dispatch);
        setIsValidationSuccessful(true);
        setValidationErrors([]);
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
        height: "100vh",
        width: "100vw",
        opacity: "0.9",
        overflowY: "scroll",
      }}
    >
      <Center>
        <NewBox>
          <Column gap={9}>
            <SignUpHeader
              havingAccount={handleHavingAccount}
              backToHome={handleBackToHome}
            />
            <InputForm ref={inputFormRef} />
            <SignUpFooter onSubmit={handleSignUpSubmit} />
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent mx={4}>
                <ModalHeader>
                  {isValidationSuccessful
                    ? "Event Validation Success"
                    : "Event Validation Failure"}
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

export default SignUpPage;
