import { FormControl, FormLabel } from "@chakra-ui/react";

export const CustomFormControl : React.FC < any > = ({
    children,
    label,
    ...props
}) => (
    <FormControl {...props}>
        <FormLabel color="white">{label}</FormLabel>
        {children}
    </FormControl>
);