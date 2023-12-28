import { Box, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

type CustomDateTimeInputProps = {
    label: string;
    id: string;
    renderInput: (id : string) => ReactNode;
};

export const CustomDateTimeInput : React.FC < CustomDateTimeInputProps > = ({label, id, renderInput}) => (
    <Box w="100%">
        <Text color="white" fontWeight={500} mb={2}>{label}</Text>
        {renderInput(id)}
    </Box>
);