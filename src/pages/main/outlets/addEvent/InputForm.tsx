import styled from "@emotion/styled";
import {COLOR_PRIMARY_RGB} from "../../../../constants/palatte";
import {
    Flex,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select
} from "@chakra-ui/react";
import Column from "../../../../components/Column";
import {CustomFormControl} from "./CustomFormControl";
import {commonInputStyles} from "../../../../constants/styles";
import {CustomDateTimeInput} from "./CustomDateTimeInput";
import {RangeDatepicker} from "chakra-dayzed-datepicker";
import Row from "../../../../components/Row";
import TimePicker, {Time, TimePickerRef} from "../../../../components/TimePicker";
import ImageDropZone, {ImageDropZoneRef} from "./ImageDropZone";
import {forwardRef, useImperativeHandle, useRef, useState} from "react";
import TextArea from "../../../../components/TextArea";

const FlexBox = styled(Flex)({
    flexDirection: 'row',
    gap: 20,
    '@media (max-width: 600px)': {
        flexDirection: 'column'
    }
});

const FlexBox2 = styled(Flex)({
    flexDirection: 'row',
    gap: 30,
    '@media (max-width: 960px)': {
        flexDirection: 'column'
    }
});

const eventTypes = [
    {
        value: 'race',
        text: 'Race'
    }, {
        value: 'training',
        text: 'Training'
    }, {
        value: 'leisure',
        text: 'Leisure'
    }
];

const eventPrivacies = [
    {
        value: 'public',
        text: 'Public'
    }, {
        value: 'private',
        text: 'Private'
    }
];

export interface InputFormRef {
    getFormData: () => {
        name: string;
        type: string;
        privacy: string;
        maxOfParti: number;
        description: string;
        remark: string;
        startTime: Time;
        endTime: Time;
        period: Date[];
        backgroundImage: string | null; // Modify the type to accept Blob | null
    };
};


const InputForm = forwardRef < InputFormRef, {} > ((props, ref) => {
        const titleRef = useRef < HTMLInputElement | null > (null);
        const typeRef = useRef < HTMLSelectElement | null > (null);
        const privacyRef = useRef < HTMLSelectElement | null > (null);
        const maxOfPartiRef = useRef < HTMLInputElement | null > (null);
        const descriptionRef = useRef < HTMLTextAreaElement | null > (null);
        const remarkRef = useRef < HTMLTextAreaElement | null > (null);
        const startTimeRef = useRef < TimePickerRef | null > (null);
        const endTimeRef = useRef < TimePickerRef | null > (null);
        const imageDropZoneRef = useRef < ImageDropZoneRef | null > (null);
        const [selectedDates,
            setSelectedDates] = useState < Date[] > ([new Date(), new Date()]);

            useImperativeHandle(ref, () => ({
                getFormData: () => {
                    const backgroundImageString = imageDropZoneRef.current?.getUploadedImage() || '';
            
                    return {
                        name: titleRef.current?.value || '',
                        type: typeRef.current?.value || '',
                        privacy: privacyRef.current?.value || '',
                        maxOfParti: maxOfPartiRef.current?.valueAsNumber || 0,
                        description: descriptionRef.current?.value || '',
                        remark: remarkRef.current?.value || '',
                        startTime: startTimeRef.current?.getTime() || { hour: '00', minute: '00' },
                        endTime: endTimeRef.current?.getTime() || { hour: '00', minute: '00' },
                        period: selectedDates,
                        backgroundImage: backgroundImageString
                    };
                }
            }));
            
            

        return (
            <Column
                overflowX={'auto'}
                bgColor={`rgba(${COLOR_PRIMARY_RGB}, 0.7)`}
                px={{
                base: 5,
                sm: 8
            }}
                py={{
                base: 6,
                sm: 8
            }}
                gap={5}
                borderRadius={12}>
                <FlexBox2 >
                    <Column gap={5} flex={1}>
                        <CustomFormControl label="Title" isRequired>
                            <Input
                                ref={titleRef}
                                placeholder="E.g. HKUST Hiking Day"
                                {...commonInputStyles}/>
                        </CustomFormControl>
                        <FlexBox>
                            <CustomFormControl isRequired label="Type" minWidth={'112px'} flex={1}>
                                <Select
                                    ref={typeRef}
                                    defaultValue={typeRef.current
                                    ?.value}
                                    {...commonInputStyles}>
                                    {eventTypes.map((type) => (
                                        <option key={type.value} value={type.value}>{type.text}</option>
                                    ))}
                                </Select>
                            </CustomFormControl>
                            <CustomFormControl isRequired label="Privacy" minWidth={'126px'} flex={1}>
                                <Select
                                    ref={privacyRef}
                                    defaultValue={privacyRef.current
                                    ?.value}
                                    {...commonInputStyles}>
                                    {eventPrivacies.map((privacy) => (
                                        <option key={privacy.value} value={privacy.value}>{privacy.text}</option>
                                    ))}
                                </Select>
                            </CustomFormControl>
                        </FlexBox>
                        <CustomFormControl label="Max. of Parti." minWidth={'109px'}>
                            <NumberInput max={2000} defaultValue={1} min={1}>
                                <NumberInputField ref={maxOfPartiRef} {...commonInputStyles}/>
                                <NumberInputStepper>
                                    <NumberIncrementStepper/>
                                    <NumberDecrementStepper/>
                                </NumberInputStepper>
                            </NumberInput>
                        </CustomFormControl>
                        <FlexBox>
                            <CustomDateTimeInput
                                label="Period"
                                id="event-period"
                                renderInput={(id) => (<RangeDatepicker
                                id={id}
                                propsConfigs={{
                                inputProps: {
                                    minWidth: '220px',
                                    ...commonInputStyles
                                }
                            }}
                                selectedDates={selectedDates}
                                onDateChange={setSelectedDates}/>)}/>
                            <Row gap={5}>
                                <CustomDateTimeInput
                                    label="Start Time"
                                    id="event-start_time"
                                    renderInput={(id) => <TimePicker id={id} ref={startTimeRef}/>}/>
                                <CustomDateTimeInput
                                    label="End Time"
                                    id="event-end_time"
                                    renderInput={(id) => <TimePicker id={id} ref={endTimeRef}/>}/>
                            </Row>
                        </FlexBox>
                    </Column>
                    <ImageDropZone ref={imageDropZoneRef}/>
                </FlexBox2>
                <Column>
                    <CustomFormControl label="Description">
                        <TextArea
                            ref={descriptionRef}
                            maxLength={1000}
                            placeholder="Describe your event"
                            {...commonInputStyles}/>
                    </CustomFormControl>
                    <CustomFormControl label="Remark">
                        <TextArea
                            ref={remarkRef}
                            maxLength={200}
                            placeholder="Any remarks?"
                            {...commonInputStyles}/>
                    </CustomFormControl>
                </Column>
            </Column>
        );
    });

export default InputForm;