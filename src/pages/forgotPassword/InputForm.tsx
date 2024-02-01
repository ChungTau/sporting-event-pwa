import { COLOR_PRIMARY_RGB } from "../../constants/palatte";
import { Input } from "@chakra-ui/react";
import Column from "../../components/Column";
import { CustomFormControl } from "../main/outlets/addEvent//CustomFormControl";
import { commonInputStyles } from "../../constants/styles";
import { forwardRef, useImperativeHandle, useRef } from "react";

export interface InputFormRef {
  getFormData: () => {
    emailOrPhoneNo: string;
  };
}

const InputForm = forwardRef<InputFormRef, {}>((props, ref) => {
  const emailOrPhoneNoRef = useRef<HTMLInputElement | null>(null);

  useImperativeHandle(ref, () => ({
    getFormData: () => ({
      emailOrPhoneNo: emailOrPhoneNoRef.current?.value || "",
    }),
  }));

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
        <CustomFormControl
          isRequired
          label="Please enter your email address or phone number so we can send you an email to reset your password."
        >
          <Input ref={emailOrPhoneNoRef} {...commonInputStyles} />
        </CustomFormControl>
      </Column>
    </Column>
  );
});

export default InputForm;
