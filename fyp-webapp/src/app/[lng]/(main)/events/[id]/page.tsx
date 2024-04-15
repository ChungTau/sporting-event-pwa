"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PlanDetails, PlanMapView } from "@/containers/plan-page";
import {useEventDataStore} from "@/store/useEventDataStore";
import { useGpxDataStore } from "@/store/useGpxDataStore";
import { extractMetadata, processGeoJSON } from "@/utils/map";
import { User } from "@prisma/client";
import { gpx } from "@tmcw/togeojson";
import { Loader2, Lock, LockOpen, Radio } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import {useEffect, useState} from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

function formatDate(dateString : string) {
    const date = new Date(dateString);

    const options : Intl.DateTimeFormatOptions | undefined = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };

    return new Intl
        .DateTimeFormat('en-US', options)
        .format(date)
}


function EventIdPage({params} : {
    params: {
        id: number
    }
}) {
    const {data, setData} = useEventDataStore();
    const session = useSession();
    const { toast } = useToast();
    const {setXML, init, setInPage, reset} = useGpxDataStore();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    useEffect(() => {
        setLoading(true); 
        const fetchEvent = async() => {
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
                const {name, author} = extractMetadata(xml);
                const geojson = gpx(xml);
                const info = processGeoJSON(geojson);
                const routes = geojson.features[0];
                init({name, author, info, routes});
                setInPage("event");
                setXML(xml); 
                setData(result);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching event:", error);
            }
        };

        fetchEvent();

    }, [params.id]);

    useEffect(() => {
        if (data) {
            console.log(data);
        }
    }, [data]);

    useEffect(() => {
        return () => {
            reset();
            setData(null);
        };
    }, [reset, setData]);

    if(loading){
        return(<div className="flex justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin" />
    </div>);
    }

    const joinOrLeaveEvent = async () => {
        const response = await fetch(`/api/events/${data?.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: session?.data?.user.id })
        });
    
        const result = await response.json();
        toast({
            title: result.message,
        });
    
        if (result.success) {
            // Update local event data
            setData(result.event);
        }
    };
    

    const userId = session?.data?.user.id;
    const isOwner = userId === data?.ownerId;
    const isParticipant = ((data as any)?.participants as User[])?.some((participant: User) => participant.id === userId);
    

    return (
        <div className="flex flex-col gap-4">
            {data && (
                <div className="flex items-center justify-center rounded-md">
                    <img
                        src={data.image !}
                        alt="Uploaded"
                        className="h-[300px] w-full rounded-md object-cover"/>
                </div>
            )}
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-4 items-center">
                    <div className="flex flex-row items-center gap-2">
                    {data?.privacy === "public" ? <LockOpen className="h-4 w-4 text-zinc-400"/> : <Lock className="h-4 w-4 text-zinc-400"/>}
                    <div className="text-lg">
                        {data?.name}
                    </div>
                    </div>
                    <Badge className="text-sm rounded-md">
                        {data?.type.toLocaleUpperCase()}
                    </Badge>
                    
                </div>
                <div className="flex flex-row gap-2"><Button className="bg-red-400 text-white" size={'icon'} variant={'ghost'} onClick={()=>{
                    router.push(`/live-track/${data?.id}`);
                }}><Radio /></Button>
                <Button className={`text-md px-6 ${isParticipant?'bg-indigo-700':'bg-emerald-600'}`} onClick={() => {
                    // Ensure session exists and the user is authenticated
                    if (!session || session.status !== "authenticated") {
                        signIn('keycloak');
                        return;
                    }

                    if (isOwner) {
                        toast({
                            title: "Owner cannot join the event",
                        });
                    } else {
                        joinOrLeaveEvent();
                    }
                }}>
                    <div>
                        {isParticipant?'Joined':'Join'}
                    </div>
                </Button>
                </div>
            </div>
            <div className="rounded-md flex flex-col p-4 bg-gray-200 dark:bg-zinc-600 w-full">
                <Label className="text-lg text-zinc-600 dark:text-gray-200">Details</Label>
                <Separator orientation="horizontal" className="bg-zinc-300"/>
                <div>
                    <div>
                        {`Host: ${(data as any)?.owner ? (data as any).owner.name : ''}`}
                    </div>
                    <div>
                        {`Maximum Participants: ${data?.maxParti}`}
                    </div>
                    <div>
                        {`Venue: ${data?.venue}`}
                    </div>
                    <div>
                        {`Period: ${data?.startDate?formatDate(data?.startDate as unknown as string):''} - ${data?.endDate?formatDate(data?.endDate as unknown as string):''}`}
                    </div>
                    <div>
                        {`Description: ${data?.desc}`}
                    </div>
                </div>
            </div>
            <div className="w-full h-auto min-h-[500px] relative rounded-lg overflow-clip">
                <PlanMapView/>
            </div>
            <PlanDetails isCreating={false}/>
        </div>
    );
};

export default EventIdPage;