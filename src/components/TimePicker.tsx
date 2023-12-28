import React, {useState, forwardRef, useImperativeHandle} from 'react';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Divider,
    useDisclosure
} from '@chakra-ui/react';
import {IoChevronDown} from "react-icons/io5";
import Row from './Row';
import Column from './Column';
import {COLOR_PRIMARY_RGB, COLOR_SECONDARY} from '../constants/palatte';

export interface Time {
    hour : string;
    minute : string;
}

export interface TimePickerRef {
    getTime : () => Time;
}

interface TimePickerProps {
    id?: string;
}

const TimePicker = forwardRef < TimePickerRef,
    TimePickerProps > (({
        id,
        ...otherProps
    }, ref) => {
        const {isOpen, onOpen, onClose} = useDisclosure();
        const [time,
            setTime] = useState < Time > ({hour: '00', minute: '00'});
        useImperativeHandle(ref, () => ({
            getTime: () => time
        }));
        const handleTimeChange = (type : string, value : string) => {
            setTime((prevTime) => ({
                ...prevTime,
                [type]: value
            }));
        };

        const renderTimeOptions = (type : string) => {
            const options = [];
            const range = type === 'hour'
                ? 24
                : 60;

            for (let i = 0; i < range; i++) {
                const value = i
                    .toString()
                    .padStart(2, '0');
                options.push(
                    <MenuItem
                        display={'flex'}
                        justifyContent={'center'}
                        w={8}
                        borderRadius={4}
                        fontSize={14}
                        h={5}
                        key={value}
                        onClick={() => handleTimeChange(type, value)}>
                        {value}
                    </MenuItem>
                );
            }

            return options;
        };

        return (
            <Menu isOpen={isOpen} onOpen={onOpen} onClose={onClose} closeOnSelect={false}>
                <MenuButton
                    id={id}
                    w={'100%'}
                    fontWeight={400}
                    _focusVisible={{
                    border: `2px solid ${COLOR_SECONDARY}`
                }}
                    bgColor={'whiteAlpha.600'}
                    border={`2px solid rgba(${COLOR_PRIMARY_RGB}, 1)`}
                    color={`rgba(${COLOR_PRIMARY_RGB}, 1)`}
                    _hover={{
                    backgroundColor: 'whiteAlpha.700'
                }}
                    as={Button}
                    rightIcon={< IoChevronDown />}>
                    {`${time.hour}:${time.minute}`}
                </MenuButton>
                <MenuList
                    px={2}
                    gap={2}
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    minW={'fit-content'}>
                    <Row justifyContent={'space-evenly'} w={147} h={200}>
                        <Column overflowY={'scroll'}>
                            {renderTimeOptions('hour')}
                        </Column>
                        <Divider orientation='vertical'/>
                        <Column overflowY={'scroll'}>
                            {renderTimeOptions('minute')}
                        </Column>
                    </Row>
                    <Divider orientation='horizontal'/>
                    <Button fontSize={'small'} h={7} w={'100%'} onClick={onClose}>Confirm</Button>
                </MenuList>
            </Menu>
        );
    });

export default TimePicker;
