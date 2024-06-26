'use client';

import { PlanMapView } from "@/containers/plan-page";
import { useEventDataStore } from "@/store/useEventDataStore";
import { useGpxDataStore } from "@/store/useGpxDataStore";
import { extractMetadata, processGeoJSON } from "@/utils/map";
import { gpx } from "@tmcw/togeojson";
import { Dot, Loader2, Minus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMarkerStore } from "@/store/useMarkerStore";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {  User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { useLiveTrackStore } from "@/store/useLiveTrackStore";
import { useUserDataStore } from "@/store/userUserDataStore";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { LocaleLink } from "@/components/localeLink";
import {
    distance,
    point,

    //@ts-ignore
} from '@turf/turf';
import { toast } from "@/components/ui/use-toast";
import CountdownTimer from "@/components/countdownTimer";
import { Badge } from "@/components/ui/badge";

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
        return `calc(${drawerHeight} - 62px)`;
    }
}

function LiveTrack({params} : {
    params: {
        id: string
    }
}){
    const {data, setData, setParticipants, participants} = useEventDataStore();
    const {liveTrackData, setLiveTrackData} = useLiveTrackStore();
    const [ranking, setRanking] = useState<{user:User, distance:number}[]|[]>([]);
    const snapPoints:(string | number)[] = [0.03, 0.4, 1]; // Define snap points
    const [activeSnapPoint, setActiveSnapPoint] = useState<(string | number| null)>(snapPoints[1]);
    const {setXML, init, setInPage, reset, routes} = useGpxDataStore();
    const {userData} = useUserDataStore();
    const [loading, setLoading] = useState(false);
    const session = useSession();
    const userId = session.data?.user.id;
    const [openCheckpointItems, setOpenCheckpointItems] = useState<string[]>([]);
    const {markers} = useMarkerStore();
    const [gpsEnabled, setGpsEnabled] = useState(false);
    const watchId = useRef<number|null>(null);

    const isUserOnTrack = (startPoint: [number, number], userPosition: any): boolean => {
        const from = point(startPoint);
        const to = point([userPosition.coords.longitude, userPosition.coords.latitude]);
        const distanceBetweenPoints = distance(from, to);
        return distanceBetweenPoints <= 0.1; // 500 meters threshold
    };
    
    const isEventActive = (): boolean => {
        const now = Date.now();
        const start = new Date(data?.startDate as unknown as string).getTime();
        const end = new Date(data?.endDate as unknown as string).getTime();
        return now >= start && now <= end;
    };

    // Function to start watching location
    const startLocationTracking = (): void => {
    if (navigator.geolocation && routes && routes.geometry) {
        watchId.current = navigator.geolocation.watchPosition(
            (position) => {
                let startPoint: [number, number] = [0, 0];

                if (routes.geometry.type === "LineString") {
                    startPoint = routes.geometry.coordinates[0] as [number, number];
                } else if (routes.geometry.type === "MultiLineString") {
                    startPoint = routes.geometry.coordinates[0][0] as [number, number];
                }

                if(isEventActive()){
                    if (isUserOnTrack(startPoint, position) ) {
                        updateLocation(position.coords.latitude, position.coords.longitude);
                    } else {
                        toast({
                            title: "You are off track",
                            description: "Please go to the start point"
                        });
                        setGpsEnabled(false);
                    }
                }else{
                    toast({
                        title: "Event is inactive",
                        description: "You can't track your location"
                    });
                    setGpsEnabled(false);
                }

                
            },
            (error: GeolocationPositionError) => {
                //console.error('Error obtaining location', error);
                if (error.code === error.PERMISSION_DENIED) {
                    //console.log("Permission Denied");
                    setGpsEnabled(false);
                }
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
                method: 'PATCH',
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
            //console.log('Location update response:', data);
        } catch (error) {
            //console.error('Failed to update location', error);
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
            //console.log('Live track data:', liveTrackResult);
        } catch (error) {
            //console.error('Error deleting live track data:', error);
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
            //console.error("Error fetching event:", error);
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
            //console.error("Error fetching event:", error);
        }
    }, [params.id, userId, setParticipants]); // Ensure all used values are listed in the dependencies array

    const fetchRanking = useCallback(async () => {
        try {
            if (!params.id) {
                throw new Error("User ID not found");
            }
            const response = await fetch(`/api/events/${params.id}/ranking`);
            if (!response.ok) {
                throw new Error("Failed to fetch ranking");
            }
            const result = await response.json();
            setRanking(result);
        } catch (error) {
            console.error("Error fetching ranking:", error);
        }
    }, [params.id]); // Ensure all used values are listed in the dependencies array
    

    useEffect(() => {
        setLoading(true); 
        fetchEvent().then(()=>{
            setLoading(false);
        });

    }, [params.id, fetchEvent]);

   const fetchLiveTrackData = useCallback(async () => {
        try {
            await fetchParticipants();
            await fetchRanking();
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
    }, [params.id, fetchParticipants, setLiveTrackData, fetchRanking]);

    useEffect(() => {
        
        fetchLiveTrackData(); // Fetch immediately on mount
        const intervalId = setInterval(fetchLiveTrackData, 10000); // Set up interval

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, [params.id, fetchLiveTrackData]);

    useEffect(() => {
        return () => {
            reset();
            setData(null);
            setParticipants([]);
            setLiveTrackData([]);
            setRanking([]);
        };
    }, [reset, setData, setParticipants, setLiveTrackData, setRanking]);

    if(loading){
        return(<div className="w-screen h-screen flex justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin" />
    </div>);
    }else{
        const drawerHeight = typeof activeSnapPoint === 'number' ? `${activeSnapPoint * 100}%` : '0%';
        return(
            <div className="w-screen h-screen">
                <div className="w-full h-full relative">
                    <PlanMapView/>
                </div>
                <div className="absolute left-1/2 top-4">
                    <div className="relative -left-1/2 py-1 px-4 rounded-md bg-white dark:bg-zinc-700">
                        <CountdownTimer startDateTimestamp={data?.startDate as unknown as string} endDateTimestamp={data?.endDate as unknown as string}/>
                    </div>
                </div>
                {(session && participants.some(participant => participant.id === session?.data?.user.id)) && (
                    <Button onClick={toggleGpsTracking} className="absolute right-4 top-4">
                        {gpsEnabled ? 'Not ready' : 'Ready'}
                    </Button>
                )}


                 
                <Drawer
                    snapPoints={snapPoints}
                    activeSnapPoint={activeSnapPoint}
                    setActiveSnapPoint={setActiveSnapPoint}
                    open={true}
                    dismissible={false}
                    modal={false}
                    >
                    <DrawerContent className="w-full h-full bg-white dark:bg-zinc-700">
                    <Tabs defaultValue="checkpoints" className="w-full h-full mt-2 bg-transparent overflow-clip">
                        <TabsList className="flex flex-row justify-evenly overflow-clip sm:h-auto dark:bg-zinc-600 h-[30px] sm:mx-4 mx-2">
                            <TabsTrigger className="flex-1 sm:text-base text-sm font-semibold sm:rounded-l-md rounded-l-sm py-0.5 sm:py-1.5" value="checkpoints">Checkpoints</TabsTrigger>
                            <TabsTrigger className="flex-1 sm:text-base text-sm font-semibold sm:rounded-r-md rounded-r-sm py-0.5 sm:py-1.5" value="participants">Participants</TabsTrigger>
                            <TabsTrigger className="flex-1 sm:text-base text-sm font-semibold sm:rounded-l-md rounded-l-sm py-0.5 sm:py-1.5" value="ranking">Ranking</TabsTrigger>
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
                                <div className="w-full h-2"/>
                            </TabsContent>
                            <TabsContent value="participants">
                                {participants && participants.length > 0 ? (
                                    <Accordion type="single" collapsible>
                                        {participants&& (participants as User[]).map((participant, index) => {
                                            const isOnline = liveTrackData?.some((track) => track.userId === participant.id);
                                            return(
                                                <AccordionItem key={participant.id} value={participant.id}>
                                                    <AccordionTrigger className={`flex flex-row items-center px-4 py-2 ${index % 2 === 0 ? 'bg-gray-100 dark:bg-zinc-600' : 'bg-transparent'}`}>
                                                        <div className="flex flex-row px-4 py-0.5 w-full justify-between items-center">
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
                                         
                                                        <LocaleLink className={"w-full"} href={`/users/${participant.id}`}>
                                                            <Button className="w-full">
                                                                View Profile
                                                            </Button>
                                                        </LocaleLink>
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
                            <TabsContent value="ranking">
                            {ranking && ranking.length > 0 ? (
                                
                                ranking.map((data, index) => {

                                    return(
                                        
                                            <div key={index} className={`flex flex-row items-center px-4 py-2 ${index % 2 === 0 ? 'bg-gray-100 dark:bg-zinc-600' : 'bg-transparent'}`}>
                                                <div className="justify-between flex flex-row items-center w-full">
                                                <div className="flex flex-row px-4 py-0.5 w-ful justify-start items-center gap-4">
                                                    <div>
                                                        {index+1}
                                                    </div>
                                                    <div className="flex flex-row gap-4 items-center">
                                                        <Avatar>
                                                            <AvatarImage className="object-cover" src={data.user?.image??"https://github.com/shadcn.png"} />
                                                            <AvatarFallback>{getInitials(data.user.name!)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="text-md truncate text-left">
                                                            {data.user.name}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    {data.distance.toFixed(2)} KM
                                                </div>
                                                </div>
                                            </div>
                                    )
                                })

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