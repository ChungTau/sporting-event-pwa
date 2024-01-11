import React, { forwardRef } from 'react';
import { Button } from '@chakra-ui/react';

export interface CustomTabButtonProps {
    title: string;
    isActive: boolean;
    onClick: () => void;
}


const CustomTabButton = forwardRef<HTMLButtonElement, CustomTabButtonProps>(
    ({ title, isActive, onClick }, ref) => {
        return (
            <Button
                ref={ref}
                _hover={{ bgColor: 'transparent' }}
                color={isActive ? 'rgb(216, 227, 215)' : 'gray.300'}
                size="small"
                h="36px"
                w="65px"
                onClick={onClick}
                bgColor={'transparent'}
            >
                {title}
            </Button>
        );
    }
);

CustomTabButton.displayName = 'CustomTabButton';

export default CustomTabButton;
