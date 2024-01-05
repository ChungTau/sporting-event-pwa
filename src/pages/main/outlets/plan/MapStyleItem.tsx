import { Box, MenuItem } from "@chakra-ui/react";

type MapStyleItemProps = {
    image: string;
    onClick: () => void;
    isSelected: boolean;
};

// MapStyleItem component with typed props
const MapStyleItem : React.FC < MapStyleItemProps > = ({image, onClick, isSelected}) => (
    <MenuItem justifyContent={'center'} flex={1} w={'fit-content'} bgColor="transparent" onClick={onClick}>
        <Box
            w={'80px'}
            h="40px"
            bgSize="cover"
            bgPos="top"
            borderRadius={4}
            bgImage={image}>
            <Box
                borderRadius={4}
                w={'100%'}
                h="100%"
                pos="relative"
                bgColor={isSelected
                ? 'transparent'
                : 'rgba(0,0,0,0.65)'}/>
        </Box>
    </MenuItem>
);

export default MapStyleItem;