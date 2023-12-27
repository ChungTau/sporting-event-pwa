import {Box} from "@chakra-ui/react";
import {ReactNode} from "react";

type CenterProps = {
    children: ReactNode;
};

const Center : React.FC < CenterProps > = ({children}) => (
    <Box w={'100%'} h={'100%'} display={'flex'} alignItems={'center'} justifyContent={'center'} color={"#141414"} fontSize={'xl'} fontWeight={600}>
        {children}
    </Box>
);

export default Center;