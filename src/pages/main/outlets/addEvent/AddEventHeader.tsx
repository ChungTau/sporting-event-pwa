import { Button, Text } from "@chakra-ui/react";
import Row from "../../../../components/Row";
import { COLOR_PRIMARY_RGB } from "../../../../constants/palatte";

interface AddEventHeaderProps {
    onSubmit: () => void; 
}

export const AddEventHeader = ({ onSubmit }: AddEventHeaderProps) => {
    return (
        <Row alignItems='center' justifyContent='space-between'>
            <Text className="page-title">Create Event</Text>
            <Button
                color='white'
                bgColor={`rgba(${COLOR_PRIMARY_RGB},0.7)`}
                _hover={{ bgColor: `rgba(${COLOR_PRIMARY_RGB},0.5)` }}
                onClick={onSubmit}
            >
                Save
            </Button>
        </Row>
    );
};
