'use client';

import EventCard from "@/components/eventCard";
import { LocaleLink } from "@/components/localeLink";
import { useTranslation } from "@/lib/i18n";
import { PageProps } from "@/types/pageProps";
import { Event } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";


export default function Home({params:{lng}}:PageProps) {
    
    const [events,
        setEvents] = useState < Event[] > ([]);
        const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true); 
        const fetchEvents = async() => {
            try {
                const response = await fetch(`/api/events`);
                if (!response.ok) {
                    throw new Error("Failed to fetch events");
                }

                const data = await response.json();
                setEvents(data);
            } catch (error) {
                
            }
            setLoading(false);
        };

        fetchEvents();
    }, []);
    return (
        <>
        <div>
        {loading ? (
                <div className="flex justify-center items-center">
                    <Loader2 className="h-10 w-10 animate-spin" />
                </div>
            ) : (
                events.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full items-center justify-center">
                        {events.map((event: Event) => (
                            <LocaleLink key={event.id} href={`/events/${event.id}`} className={""}>
                            <EventCard name={event.name} image={event.image!}/>
                        </LocaleLink>
                        ))}
                    </div>
                ) : (
                    <div className="text-center">
                        <p>No events found.</p>
                    </div>
                )
            )}
        </div>
      </>
    );
  }