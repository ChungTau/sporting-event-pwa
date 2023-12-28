import Column from "../../../../components/Column";
import InputForm, {InputFormRef} from "./InputForm";
import {LocationSelector} from "./LocationSelector";
import {AddEventHeader} from "./AddEventHeader";
import {useCallback, useRef, useState} from "react";
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure
} from "@chakra-ui/react";
import {Time} from "../../../../components/TimePicker";
import {PointDetails} from "./DetailsBox";
import { combineDateAndTime } from "../../../../helpers/combineDateAndTime";

function AddEventPage() {
    const [isValidationSuccessful, setIsValidationSuccessful] = useState<boolean>(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [pointDetails,
        setPointDetails] = useState < PointDetails > ({lng: 0, lat: 0, address: '', name: ''});
    const inputFormRef = useRef < InputFormRef > (null);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [modalContent,
        setModalContent] = useState('');

    const handlePointDetailsUpdate = useCallback((details : PointDetails) => {
        setPointDetails(details);
    }, [setPointDetails]);
    const validateFormData = (formData : {
        title: string;
        type: string;
        privacy: string ;
        maxOfParti: number;
        description: string;
        remark: string;
        startTime: Time;
        endTime: Time;
        image: string;
        period: Date[] ;
    }) => {
        let validationErrors = [];
        
        if (!formData.title) {
            validationErrors.push("The field 'title' is required.");
        }
        if (!formData.type) {
            validationErrors.push("The field 'type' is required.");
        }
        if (!formData.privacy) {
            validationErrors.push("The field 'privacy' is required.");
        }
        if (!formData.startTime) {
            validationErrors.push("The field 'startTime' is required.");
        }
        if (!formData.endTime) {
            validationErrors.push("The field 'endTime' is required.");
        }
        if (!formData.image) {
            validationErrors.push("The field 'image' is required.");
        }
    
        if (!pointDetails || !pointDetails.lng || !pointDetails.lat) {
            validationErrors.push('Location details are required.');
        }

        const startDateTime = combineDateAndTime(formData.period[0], formData.startTime);
        const endDateTime = combineDateAndTime(formData.period[1], formData.endTime);

        if (endDateTime && startDateTime && endDateTime < startDateTime) {
            validationErrors.push('End time cannot be earlier than start time.');
        }

        return { 
            isValid: validationErrors.length === 0,
            messages: validationErrors
        };
    };

    const renderErrorList = () => (
        <ul>
            {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
            ))}
        </ul>
    );

    const handleSubmit = () => {
        if (inputFormRef.current) {

            const formData = inputFormRef.current.getFormData();
            const validation = validateFormData(formData);

            if (validation.isValid) {
                setModalContent('Event created successfully!');
                setIsValidationSuccessful(true);
                setValidationErrors([]);
            } else {
                setValidationErrors(validation.messages);
                setIsValidationSuccessful(false);
            }
            onOpen();
        }
    };

    return (
        <Column gap={5}>
            <AddEventHeader onSubmit={handleSubmit}/>
            <LocationSelector onPointDetailsUpdate={handlePointDetailsUpdate}/>
            <InputForm ref={inputFormRef}/>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent mx={4}>
                <ModalHeader>{isValidationSuccessful ? "Event Validation Success" : "Event Validation Failure"}</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody px={10} py={4}>
                        {isValidationSuccessful ? modalContent : renderErrorList()}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Column>
    );
};

export default AddEventPage;