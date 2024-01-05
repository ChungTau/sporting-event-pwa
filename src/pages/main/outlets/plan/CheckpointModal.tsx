import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {
    GroupBase,
    Select,
  } from "chakra-react-select";

//@ts-ignore
import mapboxgl from 'mapbox-gl';
import Column from "../../../../components/Column";
import { MarkerData } from "../../../../contexts/MapContext";
import { ServiceOption, serviceOptions } from "../../../../constants/servicesOption";

interface CheckpointModalProps {
    isOpen : boolean;
    onClose : () => void;
    onSubmit : (data : MarkerData) => void;
    checkpointData : MarkerData;
}

const CheckpointModal : React.FC < CheckpointModalProps > = ({isOpen, onClose, onSubmit, checkpointData}) => {
    const [name, setName] = useState(checkpointData?.name ?? ''); // Use checkpointData for initial values
    const [placeholder, setPlaceholder] = useState('');
    const [selectedServices, setSelectedServices] = useState<string[]>(checkpointData?.services || []);
    const handleSubmit = () => {
        onSubmit({
            name,
            services: selectedServices,
            distance: checkpointData.distance??0,
            elevationGain: checkpointData.elevationGain??0,
            elevation: checkpointData.elevation??0,
            distanceInter: checkpointData.distanceInter??0,
            id: checkpointData.id??"",
            position: checkpointData.position??null
        });
        resetForm();
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setName('');
        setPlaceholder('');
        setSelectedServices([]);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (checkpointData) {
                    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${checkpointData.position?.[0]},${checkpointData.position?.[1]}.json?access_token=${mapboxgl.accessToken}`);
                    const data = await response.json();
                    const result = {
                        address: data.features[0]?.place_name || 'Unknown location',
                        name: data.features[0]?.text || 'Unknown location'
                    };
                    setName(checkpointData.name);
                    setPlaceholder(result.name);
                    setSelectedServices(checkpointData.services || []);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
    
        if (isOpen && checkpointData?.position) {
            fetchData();
        }
    }, [isOpen, checkpointData]);
    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay/>
            <ModalContent backgroundColor={"white"} w={'400px'} backdropFilter={"blur(4px)"} mx="auto" // Centers horizontally
                my="auto" // Centers vertically
                maxH="calc(100% - 1.5rem)" // Adjusts for viewport height
            >
                <ModalHeader>Checkpoint Details</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Column gap={4}>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input placeholder={placeholder} value={name} onChange={e => setName(e.target.value)}/>
                    </FormControl>
                    <FormControl>
                    <FormLabel>Services</FormLabel>
                    <Select<ServiceOption, true, GroupBase<ServiceOption>>
                        name="services"
                        value={serviceOptions.filter((opt) => selectedServices.includes(opt.value))}
                        onChange={(e) => setSelectedServices(Array.isArray(e) ? e.map((item) => item.value) : [])}
                        options={serviceOptions}
                        isMulti
                        useBasicStyles
                    />
                </FormControl>
                    </Column>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                        Save
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CheckpointModal;