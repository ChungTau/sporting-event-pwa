import { Flex, FlexProps } from "@chakra-ui/react";
import { ReactNode } from "react";

type ColumnProps = FlexProps & {
    children: ReactNode;
  };
  
  const Column: React.FC<ColumnProps> = ({ children, ...rest }) => (
    <Flex display="flex" flexDirection="column" gap={2} {...rest}>
      {children}
    </Flex>
  );

export default Column;