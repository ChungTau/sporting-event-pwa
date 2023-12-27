import { Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";

type RowProps = {
  children: ReactNode;
};

const Row: React.FC<RowProps> = ({ children }) => (
  <Box display={'flex'} flexDirection={'row'} gap={2}>
    {children}
  </Box>
);

export default Row;
