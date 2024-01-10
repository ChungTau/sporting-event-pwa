import { Button, Text, Flex, Box, Spacer } from "@chakra-ui/react";
import { COLOR_PRIMARY_RGB } from "../../constants/palatte";

interface ResetPasswordHeaderProps {
  backToHome: () => void;
}

export const ResetPasswordHeader = ({
  backToHome,
}: ResetPasswordHeaderProps) => {
  return (
    <Flex minWidth="max-content" alignItems="center" gap="2">
      <Box p="2">
        <Text className="page-title">Reset password</Text>
      </Box>
      <Spacer />

      <Button
        color="white"
        bgColor={`rgba(${COLOR_PRIMARY_RGB},0.7)`}
        _hover={{ bgColor: `rgba(${COLOR_PRIMARY_RGB},0.5)` }}
        onClick={backToHome}
      >
        Back to Home
      </Button>
    </Flex>
  );
};
