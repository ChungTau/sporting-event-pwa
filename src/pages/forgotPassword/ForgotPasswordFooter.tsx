import { Button } from "@chakra-ui/react";
import { COLOR_PRIMARY_RGB } from "../../constants/palatte";

interface ForgotPasswordFooterProps {
  onForgotPassword: () => void;
}

export const ForgotPasswordFooter = ({
  onForgotPassword,
}: ForgotPasswordFooterProps) => {
  return (
    <Button
      mt={3}
      height={"60px"}
      color="white"
      bgColor={`rgba(${COLOR_PRIMARY_RGB},1)`}
      _hover={{ bgColor: `rgba(${COLOR_PRIMARY_RGB},0.8)` }}
      onClick={onForgotPassword}
    >
      Submit
    </Button>
  );
};
