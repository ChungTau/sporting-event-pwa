import { Flex, Button, Spacer } from "@chakra-ui/react";
import { COLOR_PRIMARY_RGB } from "../../constants/palatte";

interface SignInFooterProps {
  onSignIn: () => void;
  onForgotPassword: () => void;
}

export const SignInFooter = ({
  onSignIn,
  onForgotPassword,
}: SignInFooterProps) => {
  return (
    <Flex>
      <Button
        mt={3}
        height={"60px"}
        color="white"
        bgColor={`rgba(${COLOR_PRIMARY_RGB},1)`}
        _hover={{ bgColor: `rgba(${COLOR_PRIMARY_RGB},0.8)` }}
        onClick={onSignIn}
      >
        Sign in
      </Button>
      <Spacer />
      <Button
        mt={3}
        height={"60px"}
        color="white"
        bgColor={`rgba(${COLOR_PRIMARY_RGB},0.8)`}
        _hover={{ bgColor: `rgba(${COLOR_PRIMARY_RGB},0.6)` }}
        onClick={onForgotPassword}
      >
        Forgot Password
      </Button>
    </Flex>
  );
};
