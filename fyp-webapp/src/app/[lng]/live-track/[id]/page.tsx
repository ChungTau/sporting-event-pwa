'use client';

import { PlanMapView } from "@/containers/plan-page";
import { useEventDataStore } from "@/store/useEventDataStore";
import { useGpxDataStore } from "@/store/useGpxDataStore";
import { extractMetadata, processGeoJSON } from "@/utils/map";
import { gpx } from "@tmcw/togeojson";
import { Badge, Dot, Loader2, Minus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMarkerStore } from "@/store/useMarkerStore";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLiveTrackStore } from "@/store/useLiveTrackStore";
import { useUserDataStore } from "@/store/userUserDataStore";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

function getInitials(name:string) {
    return name
        .split(' ') // Split the name by spaces
        .map((n) => n[0]) // Take the first character of each part
        .join(''); // Join the initials into a single string
}

function calculateHeight(drawerHeight:string) {
    if (drawerHeight === '0%') {
        return '0%';
    } else if (drawerHeight === '100%') {
        return `calc(${drawerHeight} - 40px)`;
    } else {
        return `calc(${drawerHeight} - 60px)`;
    }
}

function LiveTrack({params} : {
    params: {
        id: string
    }
}){
    const {data, setData, setParticipants, participants} = useEventDataStore();
    const {liveTrackData, setLiveTrackData} = useLiveTrackStore();
    const snapPoints:(string | number)[] = [0.03, 0.3, 1]; // Define snap points
    const [activeSnapPoint, setActiveSnapPoint] = useState<(string | number| null)>(snapPoints[1]);
    const {setXML, init, setInPage, reset} = useGpxDataStore();
    const {userData} = useUserDataStore();
    const [loading, setLoading] = useState(false);
    const session = useSession();
    const userId = session.data?.user.id;
    const [openCheckpointItems, setOpenCheckpointItems] = useState<string[]>([]);
    const {markers} = useMarkerStore();
    const [gpsEnabled, setGpsEnabled] = useState(false);
    const watchId = useRef<number|null>(null);

    // Function to start watching location
    const startLocationTracking = () => {
        if (navigator.geolocation) {
            watchId.current = navigator.geolocation.watchPosition(
                (position) => {
                    // Update location in database
                    updateLocation(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error('Error obtaining location', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        }
    };

    const updateLocation = async (latitude:number, longitude:number) => {
        try {
            const response = await fetch(`/api/live-tracking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId,  // Assuming you have user's ID in session
                    latitude,
                    longitude,
                    eventId: parseInt( params.id! ,10)  // Assuming event ID is in params
                })
            });
            const data = await response.json();
            console.log('Location update response:', data);
        } catch (error) {
            console.error('Failed to update location', error);
        }
    };

    const removeLiveTrackData = useCallback(async () => {
        try {
            const response = await fetch(`/api/live-tracking`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId,
                    eventId: parseInt(params.id, 10)
                })
            });
            if (!response.ok) {
                throw new Error('Failed to delete live tracking data');
            }
            const liveTrackResult = await response.json();
            console.log('Live track data:', liveTrackResult);
        } catch (error) {
            console.error('Error deleting live track data:', error);
        }
    }, [userId, params.id]); // Assuming `userId` and `params.id` are stable and don't change often
    
    
    // Function to stop watching location
    const stopLocationTracking = useCallback(() => {
        if (navigator.geolocation && watchId.current) {
            removeLiveTrackData();
            navigator.geolocation.clearWatch(watchId.current);
        }
    },[removeLiveTrackData]);

    const toggleGpsTracking = () => {
        setGpsEnabled(!gpsEnabled);
        if (!gpsEnabled) {
            startLocationTracking();
        } else {
            stopLocationTracking();
        }
    };

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            if (gpsEnabled) {
                stopLocationTracking();
            }
        };
    }, [gpsEnabled, stopLocationTracking]);

    const toggleAllCheckpointItems = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation(); // Prevents event bubbling
        if (openCheckpointItems.length === markers.length) {
            setOpenCheckpointItems([]); // Collapse all if all are open
        } else {
            setOpenCheckpointItems(markers.map((_, index) => index.toString())); // Expand all
        }
    };

    const toggleCheckpointItem = (id:string) => {
        if (openCheckpointItems.includes(id)) {
            setOpenCheckpointItems(openCheckpointItems.filter(item => item !== id)); // Close this item
        } else {
            setOpenCheckpointItems([...openCheckpointItems, id]); // Open this item
        }
    };

    const fetchEvent = useCallback(async () => {
        try {
            if (!params.id) {
                throw new Error("User ID not found");
            }

            const response = await fetch(`/api/events/${params.id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch event");
            }

            const result = await response.json();
            const xmlString = result.plan.gpxFile;
            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlString, 'text/xml');
            const { name, author } = extractMetadata(xml);
            const geojson = gpx(xml);
            const info = processGeoJSON(geojson);
            const routes = geojson.features[0];
            init({ name, author, info, routes });
            setInPage("live");
            setXML(xml);
            const { participants, ...otherData } = result;
            setData(otherData);
            const sortedParticipants = participants.sort((a: any, b: any) => {
                if (a.id === userId) return -1;
                if (b.id === userId) return 1;
                return 0;
            });
            setParticipants(sortedParticipants);
        } catch (error) {
            console.error("Error fetching event:", error);
        }
    }, [params.id, init, setInPage, setXML, setData, setParticipants, userId]);

    const fetchParticipants = useCallback(async () => {
        try {
            if (!params.id) {
                throw new Error("User ID not found");
            }
            const response = await fetch(`/api/events/${params.id}/participants`);
            if (!response.ok) {
                throw new Error("Failed to fetch participants");
            }
            const result = await response.json();
            const sortedParticipants = result.participants.sort((a:any, b:any) => {
                if (a.id === userId) return -1;
                if (b.id === userId) return 1;
                return 0;
            });
            setParticipants(sortedParticipants);
        } catch (error) {
            console.error("Error fetching event:", error);
        }
    }, [params.id, userId, setParticipants]); // Ensure all used values are listed in the dependencies array
    

    useEffect(() => {
        setLoading(true); 
        fetchEvent().then(()=>{
            setLoading(false);
        });

    }, [params.id, fetchEvent]);

   const fetchLiveTrackData = useCallback(async () => {
        try {
            await fetchParticipants();
            const response = await fetch(`/api/live-tracking/${params.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch live tracking data');
            }
            const liveTrackResult = await response.json();
            setLiveTrackData(liveTrackResult); // Update live track data in your state
            console.log('Live track data:', liveTrackResult);
        } catch (error) {
            console.error('Error fetching live track data:', error);
        }
    }, [params.id, fetchParticipants, setLiveTrackData]);

    useEffect(() => {
        
        fetchLiveTrackData(); // Fetch immediately on mount
        const intervalId = setInterval(fetchLiveTrackData, 30000); // Set up interval

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, [params.id, fetchLiveTrackData]);

    useEffect(() => {
        return () => {
            reset();
            setData(null);
            setParticipants([]);
            setLiveTrackData([]);
        };
    }, [reset, setData, setParticipants, setLiveTrackData]);

    if(loading){
        return(<div className="w-screen h-screen flex justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin" />
    </div>);
    }else{
        const drawerHeight = typeof activeSnapPoint === 'number' ? `${activeSnapPoint * 100}%` : '0%';
        console.log(drawerHeight);
        console.log(activeSnapPoint);
        return(
            <div className="w-screen h-screen">
                <div className="w-full h-full relative">
                    <PlanMapView/>
                </div>
                 
                <Drawer
                    snapPoints={snapPoints}
                    activeSnapPoint={activeSnapPoint}
                    setActiveSnapPoint={setActiveSnapPoint}
                    open={true}
                    dismissible={false}
                    modal={false}
                    >
                    <DrawerContent className="w-full h-full bg-white">
                    <Tabs defaultValue="checkpoints" className="w-full h-full mt-2 bg-transparent overflow-clip">
                        <TabsList className="flex flex-row justify-evenly overflow-clip sm:h-auto h-[30px] sm:mx-4 mx-2">
                            <TabsTrigger className="flex-1 sm:text-base text-sm font-semibold sm:rounded-l-md rounded-l-sm py-0.5 sm:py-1.5" value="checkpoints">Checkpoints</TabsTrigger>
                            <TabsTrigger className="flex-1 sm:text-base text-sm font-semibold sm:rounded-r-md rounded-r-sm py-0.5 sm:py-1.5" value="participants">Participants</TabsTrigger>
                        </TabsList>
                        <div className="sm:px-4 px-2 mt-1 sm:text-sm text-xs overflow-y-auto" style={{
                            height: calculateHeight(drawerHeight)
                        }}>
                            <TabsContent value="checkpoints">
                                <div className="flex justify-between items-center flex-row mx-4 my-2 font-semibold">
                                    <div className="flex-[3_3_0%] ">
                                        Point
                                    </div>
                                    <div className="flex-[2_2_0%] text-center">
                                        Dist. (KM)
                                    </div>
                                    <div className="flex-[2_2_0%] truncate text-center">
                                        Dist. inter (KM)
                                    </div>
                                    <div className="flex-[2_2_0%] text-center">
                                        Ele. Gain (M)
                                    </div>
                                    <div onClick={toggleAllCheckpointItems}>
                                        <Minus className={`h-4 w-4 shrink-0 transition-transform duration-200 cursor-pointer ${openCheckpointItems.length === markers.length ? 'rotate-180' : ''}`}/>
                                    </div>
                                </div>
                                <Separator className="bg-zinc-200 mt-2"/>
                                <Accordion type="multiple" value={openCheckpointItems}>
                                    {markers.map((marker, index) => {
                                        const checkpoint = marker.data;
                                        if (!checkpoint) {
                                            return null;
                                        }
                    
                                        return (
                                            <AccordionItem key={checkpoint.id} value={checkpoint.id!}>
                                                <AccordionTrigger className={`flex flex-row px-4 py-2 ${index % 2 === 0 ? 'bg-gray-100 dark:bg-zinc-600' : 'bg-transparent'}`} onClick={() => toggleCheckpointItem(checkpoint.id!)}>
                                                    <div className="flex-[3_3_0%] text-sm truncate text-left">
                                                        {checkpoint.name || `Checkpoint ${index}`}
                                                    </div>
                                                    <div className="flex-[2_2_0%] text-sm">
                                                        {checkpoint.distance ? checkpoint.distance.toFixed(2) : '0.00'}
                                                    </div>
                                                    <div className="flex-[2_2_0%] text-sm">
                                                        {checkpoint.distanceInter ? checkpoint.distanceInter.toFixed(2) : '0.00'}
                                                    </div>
                                                    <div className="flex-[2_2_0%] text-sm">
                                                        {checkpoint.elevationGain ? checkpoint.elevationGain.toFixed(0) : '0'}
                                                    </div>
                                                </AccordionTrigger>
                                                
                                                <AccordionContent className={`px-4 pb-4 ${index % 2 === 0 ? 'bg-gray-100 dark:bg-zinc-600' : 'bg-transparent'}`}>
                                                <Separator className={`${index % 2 === 0 ? "bg-gray-400":"bg-zinc-100"} mb-4`}/>
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex flex-row justify-between">
                                                            <div className="text-sm font-semibold">Name</div>
                                                            <div className="text-sm">{checkpoint.name || `Checkpoint ${index}`}</div>
                                                        </div>
                                                        <div className="flex flex-row justify-between">
                                                            <div className="text-sm font-semibold">Distance</div>
                                                            <div className="text-sm">{checkpoint.distance ? checkpoint.distance.toFixed(2) : 0} KM</div>
                                                        </div>
                                                        <div className="flex flex-row justify-between">
                                                            <div className="text-sm font-semibold">Distance Inter</div>
                                                            <div className="text-sm">{checkpoint.distanceInter ? checkpoint.distanceInter.toFixed(2) : 0} KM</div>
                                                        </div>
                                                        <div className="flex flex-row justify-between">
                                                            <div className="text-sm font-semibold">Elevation</div>
                                                            <div className="text-sm">{checkpoint.elevation ? checkpoint.elevation.toFixed(0) : 0} M</div>
                                                        </div>
                                                        <div className="flex flex-row justify-between">
                                                            <div className="text-sm font-semibold">Elevation Gain</div>
                                                            <div className="text-sm">{checkpoint.elevationGain ? checkpoint.elevationGain.toFixed(0) : 0} M</div>
                                                        </div>
                                                        <div className="flex flex-row justify-between">
                                                            <div className="text-sm font-semibold">Services</div>
                                                            <div className="flex flex-row gap-2">
                                                            {
                                                                checkpoint.services?checkpoint.services?.length==0?<div>No Service Provide</div>:checkpoint.services.map((service, index2)=>{
                                                                    return(
                                                                        <Badge key={`badge-${checkpoint.id}-${index2}`} className="bg-zinc-700 dark:bg-zinc-300">{service.toLocaleUpperCase()}</Badge>
                                                                    );
                                                                }):<div/>
                                                            }
                                                            </div>
                                                        </div>                                    
                                                    </div>
                                                </AccordionContent>
                                                
                                            </AccordionItem>
                                        );
                                    })}
                                </Accordion>
                            </TabsContent>
                            <TabsContent value="participants">
                                {participants && participants.length > 0 ? (
                                    <Accordion type="single" collapsible>
                                        {participants&& (participants as User[]).map((participant, index) => {
                                            const isOnline = liveTrackData?.some((track) => track.userId === participant.id);
                                            return(
                                                <AccordionItem key={participant.id} value={participant.id}>
                                                    <AccordionTrigger className={`flex flex-row items-center px-4 py-2 ${index % 2 === 0 ? 'bg-gray-100 dark:bg-zinc-600' : 'bg-transparent'}`}>
                                                        <div className="flex flex-row px-4 py-2 w-full justify-between items-center">
                                                            <div className="flex flex-row gap-4 items-center">
                                                                <Avatar>
                                                                    <AvatarImage className="object-cover" src={participant?.image??"https://github.com/shadcn.png"} />
                                                                    <AvatarFallback>{getInitials(participant.name!)}</AvatarFallback>
                                                                </Avatar>
                                                                <div className="text-md truncate text-left">
                                                                    {participant.name}
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-row items-end">
                                                                <Dot className={isOnline?`text-green-400`:`text-red-400`}/>
                                                                <div>
                                                                    {isOnline? "Online" : "Offline"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className={`px-4 pb-4 ${index % 2 === 0 ? 'bg-gray-100 dark:bg-zinc-600' : 'bg-transparent'}`}>
                                                        <Separator className={`${index % 2 === 0 ? "bg-gray-400":"bg-zinc-100"} mb-4`}/>
                                                        {(session && session.data?.user.id === participant.id) && <div className="flex items-center space-x-2">
                                                            <Switch id={`gps-switch-${participant.id}`} checked={gpsEnabled} onCheckedChange={toggleGpsTracking} />
                                                            <Label htmlFor={`gps-switch-${participant.id}`}>Share Live Location</Label>
                                                        </div>}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            )
                                        })}
                                    </Accordion>
                                ) : (
                                    <div className="flex justify-center items-center p-4">
                                        There are no participants in this event.
                                    </div>
                                )}
                            </TabsContent>
                        </div>
                    </Tabs>
                    </DrawerContent>
                </Drawer>
            </div>
        );
    }

    
};

export default LiveTrack;