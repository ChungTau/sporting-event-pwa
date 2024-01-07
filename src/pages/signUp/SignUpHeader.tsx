import { Button, Text, Flex, Box, Spacer, ButtonGroup } from "@chakra-ui/react";
import { COLOR_PRIMARY_RGB } from "../../constants/palatte";

interface SignUpHeaderProps {
  havingAccount: () => void;
  backToHome: () => void;
}

export const SignUpHeader = ({
  havingAccount,
  backToHome,
}: SignUpHeaderProps) => {
  return (
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
          Signin
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
  );
};
