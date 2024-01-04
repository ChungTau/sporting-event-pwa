import {
    Button,
    FormControl,
    FormLabel,
    Icon,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Textarea
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {
    GroupBase,
    OptionBase,
    Select,
  } from "chakra-react-select";

//@ts-ignore
import mapboxgl from 'mapbox-gl';
import Column from "../../../../components/Column";
import { FaBowlFood } from "react-icons/fa6";
import { MdLocalDrink } from "react-icons/md";
import { PiFirstAidKitFill } from "react-icons/pi";
import { FaToiletPaper } from "react-icons/fa";
import { MarkerData } from "../../../../contexts/MapContext";

interface CheckpointModalProps {
    isOpen : boolean;
    onClose : () => void;
    onSubmit : (data : MarkerData) => void;
    checkpointData : MarkerData;
}

export interface ServiceOption extends OptionBase {
    label: React.ReactNode;
    value: string;
}

export const options: ServiceOption[] = [
    { value: "food", label: <Icon as={FaBowlFood} w={6} h={6} /> },
    { value: "drink", label: <Icon as={MdLocalDrink} w={6} h={6} /> },
    { value: "aid", label: <Icon as={PiFirstAidKitFill} w={6} h={6} /> },
    { value: "wc", label: <Icon as={FaToiletPaper} w={6} h={6} /> },
];

const CheckpointModal : React.FC < CheckpointModalProps > = ({isOpen, onClose, onSubmit, checkpointData}) => {
    const [name, setName] = useState(checkpointData?.name ?? ''); // Use checkpointData for initial values
    const [placeholder, setPlaceholder] = useState('');
    const [description, setDescription] = useState(checkpointData?.description || '');
    const [selectedServices, setSelectedServices] = useState<string[]>(checkpointData?.services || []);
    const handleSubmit = () => {
        onSubmit({
            name,
            description,
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
        setDescription('');
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
                    
    
                    // Set selected services when opening the modal
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
                        value={options.filter((opt) => selectedServices.includes(opt.value))}
                        onChange={(e) => setSelectedServices(Array.isArray(e) ? e.map((item) => item.value) : [])}
                        options={options}
                        isMulti
                        useBasicStyles
                    />
                </FormControl>
                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                            maxHeight={'200px'}
                            value={description}
                            onChange={e => setDescription(e.target.value)}/>
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