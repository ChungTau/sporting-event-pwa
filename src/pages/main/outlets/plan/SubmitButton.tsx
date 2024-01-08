import { Button, Text } from "@chakra-ui/react";
import { COLOR_PRIMARY_RGB } from "../../../../constants/palatte";

const SubmitButton = () => {
    return(
        <Button bgColor={`rgba(${COLOR_PRIMARY_RGB}, 0.7)`} _hover={{bgColor:`rgba(${COLOR_PRIMARY_RGB}, 0.8)`}} _active={{bgColor:`rgba(${COLOR_PRIMARY_RGB}, 0.9)`}}>
            <Text color={'white'}>Save</Text>
        </Button>
    );
};

export default SubmitButton;