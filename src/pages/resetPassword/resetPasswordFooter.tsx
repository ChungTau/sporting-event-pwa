import { Button } from "@chakra-ui/react";
import { COLOR_PRIMARY_RGB } from "../../constants/palatte";

interface ResetPasswordFooterProps {
  onResetPassword: () => void;
}

export const ResetPasswordFooter = ({
  onResetPassword,
}: ResetPasswordFooterProps) => {
  return (
    <Button
      mt={3}
      height={"60px"}
      color="white"
      bgColor={`rgba(${COLOR_PRIMARY_RGB},0.8)`}
      _hover={{ bgColor: `rgba(${COLOR_PRIMARY_RGB},0.6)` }}
      onClick={onResetPassword}
    >
      Reset Password
    </Button>
  );
};
