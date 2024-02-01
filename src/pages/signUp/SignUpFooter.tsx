import { Button } from "@chakra-ui/react";
import { COLOR_PRIMARY_RGB } from "../../constants/palatte";

interface SignUpFooterProps {
  onSubmit: () => void;
}

export const SignUpFooter = ({ onSubmit }: SignUpFooterProps) => {
  return (
    <Button
      mt={3}
      height={"60px"}
      color="white"
      bgColor={`rgba(${COLOR_PRIMARY_RGB},1)`}
      _hover={{ bgColor: `rgba(${COLOR_PRIMARY_RGB},0.8)` }}
      onClick={onSubmit}
    >
      Submit
    </Button>
  );
};
