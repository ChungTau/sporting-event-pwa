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
import EventServices from '../../../../services/eventServices';
import { combineDateAndTime } from "../../../../helpers/combineDateAndTime";
import EventData from "../../../../models/EventData";
import { base64StringToBlob } from 'blob-util';
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

function base64ToBlob(base64:string, mimeType:string) {
    // Remove the data URL prefix (e.g., 'data:image/png;base64,')
    const base64WithoutPrefix = base64.replace(/^data:[^;]+;base64,/, '');
  
    // Convert the base64 string to a Uint8Array
    const byteArray = atob(base64WithoutPrefix).split('').map(char => char.charCodeAt(0));
    
    // Create a Blob object with the specified MIME type
    return new Blob([new Uint8Array(byteArray)], { type: mimeType });
  }
  

function AddEventPage() {
    const [isValidationSuccessful, setIsValidationSuccessful] = useState<boolean>(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [pointDetails,
        setPointDetails] = useState < PointDetails > ({lng: 0, lat: 0, address: '', name: ''});
    const inputFormRef = useRef < InputFormRef > (null);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [modalContent,
        setModalContent] = useState('');

    const {token} = useSelector((state : RootState) => state.authenticated);

    const handlePointDetailsUpdate = useCallback((details : PointDetails) => {
        setPointDetails(details);
    }, [setPointDetails]);
    const validateFormData = (formData : {
        name: string;
        type: string;
        privacy: string ;
        maxOfParti: number;
        description: string;
        remark: string;
        startTime: Time;
        endTime: Time;
        backgroundImage: string;
        period: Date[] ;
    }) => {
        let validationErrors = [];
        
        if (!formData.name) {
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
        if (!formData.backgroundImage) {
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

    const handleSubmit = async () => {
        if (inputFormRef.current) {
          const formData = inputFormRef.current.getFormData();
          const validation = validateFormData(formData);
      
          if (validation.isValid) {
            const eventFormData = new FormData(); // Create a FormData object
      
            // Append form data to FormData object
            eventFormData.append("name", formData.name);
            eventFormData.append("type", formData.type);
            eventFormData.append("privacy", formData.privacy);
            eventFormData.append("maxOfParti", formData.maxOfParti.toString());
            eventFormData.append("description", formData.description);
            eventFormData.append("remark", formData.remark);
            eventFormData.append(
              "startDateTime",
              combineDateAndTime(formData.period[0], formData.startTime)!.toISOString() // Convert to ISO string
            );
            eventFormData.append(
              "endDateTime",
              combineDateAndTime(formData.period[1], formData.endTime)!.toISOString() // Convert to ISO string
            );
            eventFormData.append("venue", JSON.stringify(pointDetails));
            eventFormData.append("ownerId", "13");
      
            // Append backgroundImage file to FormData object
            const mimeType = 'image/jpeg';
            eventFormData.append("backgroundImage", base64ToBlob(formData.backgroundImage, mimeType), "background.jpg");

      
            const response = await EventServices.createEvent(eventFormData);
            console.log(response);
            if (response) {
              console.log("Event created successfully!");
              setIsValidationSuccessful(true);
              setValidationErrors([]);
            }
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