import { Button, Text, Flex, Box, Spacer, ButtonGroup } from "@chakra-ui/react";
import { COLOR_PRIMARY_RGB } from "../../constants/palatte";

interface SignInHeaderProps {
  createAccount: () => void;
  backToHome: () => void;
}

export const SignInHeader = ({
  createAccount,
  backToHome,
}: SignInHeaderProps) => {
  return (
    <Flex minWidth="max-content" alignItems="center" gap="2">
      <Box p="2">
        <Text className="page-title">Sign in</Text>
      </Box>
      <Spacer />

      <ButtonGroup gap="2">
        <Button
          color="white"
          bgColor={`rgba(${COLOR_PRIMARY_RGB},0.7)`}
          _hover={{ bgColor: `rgba(${COLOR_PRIMARY_RGB},0.5)` }}
          onClick={createAccount}
        >
          Sign up
        </Button>

        <Button
          color="white"
          bgColor={`rgba(${COLOR_PRIMARY_RGB},0.7)`}
          _hover={{ bgColor: `rgba(${COLOR_PRIMARY_RGB},0.5)` }}
          onClick={backToHome}
        >
          Back to home
        </Button>
      </ButtonGroup>
    </Flex>
  );
};
