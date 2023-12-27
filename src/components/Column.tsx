import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

const Column=(children:ReactNode)=>(
    <Box display={'flex'} flexDirection={'column'}>
        {children}
    </Box>
);

export default Column;