import styled from "@emotion/styled";
import { COLOR_PRIMARY_RGB } from "../../constants/palatte";
import {
  Flex,
  Input,
  Select,
  InputLeftAddon,
  InputRightElement,
  InputGroup,
  Button,
} from "@chakra-ui/react";
import Column from "../../components/Column";
import { CustomFormControl } from "../main/outlets/addEvent//CustomFormControl";
import { commonInputStyles } from "../../constants/styles";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

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

const gender = [
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

export interface InputFormRef {
  getFormData: () => {
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
  };
}

const InputForm = forwardRef<InputFormRef, {}>((props, ref) => {
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const nicknameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const genderRef = useRef<HTMLSelectElement | null>(null);
  const DOBRef = useRef<HTMLInputElement | null>(null);
  const phoneNumberRef = useRef<HTMLInputElement | null>(null);
  const emergencyPersonRef = useRef<HTMLInputElement | null>(null);
  const emergencyContactRef = useRef<HTMLInputElement | null>(null);

  useImperativeHandle(ref, () => ({
    getFormData: () => ({
      username: usernameRef.current?.value || "",
      nickname: nicknameRef.current?.value || "",
      password: passwordRef.current?.value || "",
      confirmPassword: confirmPasswordRef.current?.value || "",
      email: emailRef.current?.value || "",
      gender: genderRef.current?.value || "",
      DOB: DOBRef.current?.value || "",
      phoneNumber: phoneNumberRef.current?.value || "",
      emergencyPerson: emergencyPersonRef.current?.value || "",
      emergencyContact: emergencyContactRef.current?.value || "",
    }),
  }));

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const handleClickPassword = () => setShow(!show);
  const handleClickConfirmPassword = () => setShow2(!show2);

  return (
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
              <Input ref={usernameRef} {...commonInputStyles} />
            </CustomFormControl>
            <CustomFormControl label="Nickname">
              <Input ref={nicknameRef} {...commonInputStyles} />
            </CustomFormControl>
          </FlexBox>
          <FlexBox>
            <CustomFormControl label="Password" isRequired>
              <InputGroup size="md">
                <Input
                  ref={passwordRef}
                  {...commonInputStyles}
                  type={show ? "text" : "password"}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    color="white"
                    bgColor={`rgba(${COLOR_PRIMARY_RGB},0.5)`}
                    _hover={{ bgColor: `rgba(${COLOR_PRIMARY_RGB},0.3)` }}
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
                  ref={confirmPasswordRef}
                  {...commonInputStyles}
                  type={show2 ? "text" : "password"}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    color="white"
                    bgColor={`rgba(${COLOR_PRIMARY_RGB},0.5)`}
                    _hover={{ bgColor: `rgba(${COLOR_PRIMARY_RGB},0.3)` }}
                    onClick={handleClickConfirmPassword}
                  >
                    {show2 ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </CustomFormControl>
          </FlexBox>
          <CustomFormControl isRequired label="Email">
            <Input ref={emailRef} {...commonInputStyles} />
          </CustomFormControl>
          <FlexBox>
            <CustomFormControl label="Gender" minWidth={"40%"} flex={1}>
              <Select
                ref={genderRef}
                placeholder="Select Gender"
                defaultValue={genderRef.current?.value}
                {...commonInputStyles}
              >
                {gender.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.text}
                  </option>
                ))}
              </Select>
            </CustomFormControl>
            <CustomFormControl label="Phone Number">
              <InputGroup>
                <InputLeftAddon {...commonInputStyles}>+852</InputLeftAddon>

                <Input ref={phoneNumberRef} {...commonInputStyles} />
              </InputGroup>
            </CustomFormControl>
          </FlexBox>
          <CustomFormControl label="Date Of Birth">
            <Input
              ref={DOBRef}
              placeholder="Select Date Of Birth"
              size="md"
              type="date"
              {...commonInputStyles}
            />
          </CustomFormControl>
          <FlexBox>
            <CustomFormControl label="Emergency Person">
              <Input ref={emergencyPersonRef} {...commonInputStyles} />
            </CustomFormControl>
            <CustomFormControl label="Emergency Contact">
              <Input ref={emergencyContactRef} {...commonInputStyles} />
            </CustomFormControl>
          </FlexBox>
        </Column>
      </FlexBox2>
    </Column>
  );
});

export default InputForm;
