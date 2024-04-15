'use client';

import PrivateRoute from '@/components/PrivateRoute';
import { LocaleLink } from '@/components/localeLink';
import PlanCard from '@/components/planCard';
import { useGpxDataStore } from '@/store/useGpxDataStore';
import {Plan} from '@prisma/client';
import { Loader2 } from 'lucide-react';
import {useSession} from 'next-auth/react';
import {useEffect, useState} from 'react';

export default function UserPlans() {
    const session = useSession();
    const userId = session.data?.user.id;
    const [plans,
        setPlans] = useState < Plan[] > ([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true); 
        const fetchPlans = async() => {
            try {
                if (!userId) {
                    throw new Error("User ID not found");
                }

                const response = await fetch(`/api/my-plans/${userId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch plans");
                }

                const data = await response.json();
                setPlans(data);
            } catch (error) {
                
            }
            setLoading(false);
        };
        
        fetchPlans();
    }, [userId]);

    useEffect(() => {
        return () => {
            setPlans([]);
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
                    plans.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full items-center justify-center">
                            {plans.map((plan: Plan) => (
                                <LocaleLink key={plan.id} href={`/plans/${plan.id}`} className={""}>
                                    <PlanCard
                                        name={plan.name}
                                        thumbnail={plan.thumbnail!}
                                        info={plan.info as any} />
                                </LocaleLink>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center">
                            <p>No plans found.</p>
                        </div>
                    )
                )}
            </PrivateRoute>
        );
    }



    
}
