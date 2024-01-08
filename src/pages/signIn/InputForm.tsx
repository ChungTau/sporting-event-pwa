import { COLOR_PRIMARY_RGB } from "../../constants/palatte";
import { Input, InputRightElement, InputGroup, Button } from "@chakra-ui/react";
import Column from "../../components/Column";
import { CustomFormControl } from "../main/outlets/addEvent//CustomFormControl";
import { commonInputStyles } from "../../constants/styles";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export interface InputFormRef {
  getFormData: () => {
    username: string;
    password: string;
  };
}

const InputForm = forwardRef<InputFormRef, {}>((props, ref) => {
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);

  useImperativeHandle(ref, () => ({
    getFormData: () => ({
      password: passwordRef.current?.value || "",
      username: usernameRef.current?.value || "",
    }),
  }));

  const [show, setShow] = useState(false);
  const handleClickPassword = () => setShow(!show);

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
      <Column gap={5} flex={1}>
        {" "}
        <CustomFormControl isRequired label="Username">
          <Input ref={usernameRef} {...commonInputStyles} />
        </CustomFormControl>
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
                bgColor={`rgba(${COLOR_PRIMARY_RGB},0.6)`}
                _hover={{ bgColor: `rgba(${COLOR_PRIMARY_RGB},0.4)` }}
                onClick={handleClickPassword}
              >
                {show ? <ViewOffIcon /> : <ViewIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </CustomFormControl>
      </Column>
    </Column>
  );
});

export default InputForm;
