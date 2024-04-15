'use client';

import PrivateRoute from '@/components/PrivateRoute';
import EventCard from '@/components/eventCard';
import { LocaleLink } from '@/components/localeLink';
import {Event} from '@prisma/client';
import { Loader2 } from 'lucide-react';
import {useSession} from 'next-auth/react';
import {useEffect, useState} from 'react';

export default function UserEvents() {
    const session = useSession();
    const userId = session.data?.user.id;
    const [events,
        setEvents] = useState < Event[] > ([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true); 
        const fetchEvents = async() => {
            try {
                if (!userId) {
                    throw new Error("User ID not found");
                }

                const response = await fetch(`/api/my-events/${userId}`);
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
    }, [userId]);

        
    useEffect(() => {
        return () => {
            setEvents([]);
        };
    }, []);

    if(loading){
        return(
            <div className="flex w-full h-full justify-center items-center">
                    <Loader2 className="h-10 w-10 animate-spin" />
            </div>
        );
    }else{
        return (
            <PrivateRoute>
                {(
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
            </PrivateRoute>
        );
    }
    }

    
