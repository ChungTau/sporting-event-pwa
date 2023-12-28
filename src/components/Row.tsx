import {Flex, FlexProps } from "@chakra-ui/react";
import React, { ReactNode } from "react";

type RowProps = FlexProps & {
  children: ReactNode;
};

const Row: React.FC<RowProps> = ({ children, ...rest }) => (
  <Flex flexDirection="row" gap={2} {...rest}>
    {children}
  </Flex>
);

export default Row;
