import React, { useRef } from 'react';
import { Box, useToast, Text } from '@chakra-ui/react';
import { IoMdPin } from 'react-icons/io';
import { COLOR_PRIMARY_RGB } from '../../../../constants/palatte';

const DraggablePinIcon = () => {
    const toast = useToast();
    const iconRef = useRef<HTMLDivElement>(null);

    const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        event.dataTransfer.setData("text/plain", "pin");

        if (iconRef.current) {
            const dragIcon = iconRef.current.cloneNode(true) as HTMLDivElement;

            // Change the color of the icon being dragged
            const svgElement = dragIcon.querySelector('svg');
            if (svgElement) {
                svgElement.style.color = 'red';
            }

            document.body.appendChild(dragIcon);
            event.dataTransfer.setDragImage(dragIcon, 12, 12); // Adjust the offset as needed

            // Clean up
            setTimeout(() => document.body.removeChild(dragIcon), 0);
        }

        toast({
            render: () => (
                <Box mb={10} color='white' borderRadius={8} p={4} bg={`rgba(${COLOR_PRIMARY_RGB}, 0.6)`}>
                  <Text fontWeight={500}>Drag the pin to the map.</Text>
                </Box>
              ),
            title: "Drag Started",
            description: "Drag the pin to the map.",
            status: "info",
            duration: 2000,
            isClosable: true,
        });
    };

    return (
        <Box
            as="button"
            w= "40px"
            borderRadius="md"
            _active= {{ bgColor: "rgba(0,0,0,0.4)", color: "#db7987" }}
            _hover= {{ bgColor: "rgba(0,0,0,0.4)" }}
            bgColor="rgba(0,0,0,0.6)"
            backdropFilter= "blur(4px)"
            color= "white"
            display={'inline-flex'}
            alignItems="center"
            justifyContent="center"
        >
            <div 
                ref={iconRef}
                draggable="true" 
                onDragStart={onDragStart}
                style={{ display:'flex', cursor: 'grab', width: '40px', height: '40px', alignItems: 'center', justifyContent:'center' }}
            >
                <IoMdPin/>
            </div>
        </Box>
    );
};

export default DraggablePinIcon;
