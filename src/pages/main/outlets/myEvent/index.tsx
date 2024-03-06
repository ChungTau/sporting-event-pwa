import { useNavigate } from "react-router-dom";
import Center from "../../../../components/Center";
import EventData from "../../../../models/EventData";
import { Box, Tooltip, Image, Text, SimpleGrid } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { useEffect, useState } from "react";
import EventServices from "../../../../services/eventServices";


interface EventCardProps {
    event: EventData;
}


function formatDate(dateString:string) {
    const date = new Date(dateString);
  
    const options:Intl.DateTimeFormatOptions | undefined = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    };
  
    return new Intl.DateTimeFormat('en-US', options).format(date).toUpperCase() + ' AT ' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
  }

const EventCard = ({ event}:EventCardProps) => {
    const navigator = useNavigate();
    const base64String = btoa(
        String.fromCharCode(... new Uint8Array(event.backgroundImage!))
    );
    return (
        <Box cursor={'pointer'} maxW={"100%"} borderWidth="1px" borderRadius="lg" overflow="hidden" p="4" px={3} bgColor={"#FFFFFF"} onClick={()=>{navigator(`/event/${event.id}`)}}>
            <Image
    src={`data:image/png;base64,${base64String}`}
    alt={`Image of ${event.name}`}
    objectFit="contain" />






            <Tooltip justifyContent={'center'} alignItems={'center'} textAlign={'center'} label={event.name} aria-label="A tooltip">
                <Text justifyContent={'center'} alignItems={'center'} textAlign={'center'} mt={3} fontSize={["sm", "md", "lg", "xl"]} fontWeight="bold" isTruncated>{event.name}</Text>
                
            </Tooltip>
            <Text fontSize={["sm", "md", "lg", "xl"]}>{(event.venue.name)}</Text>
            <Text fontSize={["sm", "md", "lg", "xl"]}>{formatDate(event.startDateTime as any)}</Text>
        </Box>
    );
}

function MyEventPage(){
    const {user} = useSelector((state : RootState) => state.user);
    const [events, setEvents] = useState([] as EventData[]);

    useEffect(() => {
        const ownerId = user?.id;
        EventServices.getEventsByOwnerId(ownerId!)
            .then((data:EventData[]) => {
                setEvents(data);
            })
            .catch(error => console.error(error));
    }, []);

    return(
        <div>
            <Center>My Event Page</Center>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 3 }} spacing={{ base: "3", md: "4", lg: "6" }} p="4">
                {events.map(event => (
                    <EventCard key={event.id} event={event} />
                ))}
            </SimpleGrid>
        </div>
    );
};

export default MyEventPage;