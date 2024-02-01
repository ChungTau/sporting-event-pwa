import { Button, Text, Flex, Box, Spacer } from "@chakra-ui/react";
import { COLOR_PRIMARY_RGB } from "../../constants/palatte";

interface ForgotPasswordHeaderProps {
  backToLogin: () => void;
}

export const ForgotPasswordHeader = ({
  backToLogin,
}: ForgotPasswordHeaderProps) => {
  return (
    <Flex minWidth="max-content" alignItems="center" gap="2">
      <Box p="2">
        <Text className="page-title">Forgot password</Text>
      </Box>
      <Spacer />

      <Button
        color="white"
        bgColor={`rgba(${COLOR_PRIMARY_RGB},0.7)`}
        _hover={{ bgColor: `rgba(${COLOR_PRIMARY_RGB},0.5)` }}
        onClick={backToLogin}
      >
        Back to login
      </Button>
    </Flex>
  );
};
