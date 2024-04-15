import { Accordion, AccordionContent, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMarkerStore } from "@/store/useMarkerStore";
import { MarkerData } from "@/types/mapbox-marker";
import { AccordionItem } from "@radix-ui/react-accordion";
import { Minus } from "lucide-react";
import { Fragment, useState } from "react";
import PlanCheckpointDialog from "../plan-checkpoint-dialog";
import { useGpxDataStore } from "@/store/useGpxDataStore";

function PlanCheckpoints (){
    const {markers, removeMarker, updateMarker} = useMarkerStore();
    const {inPage} = useGpxDataStore();
    const [openItems, setOpenItems] = useState<string[]>([]);
    const [isModalOpen,
        setIsModalOpen] = useState < boolean > (false);
        const [editedCheckpoint,
            setEditedCheckpoint] = useState < MarkerData | null > (null);

    const handleModalClose = () => {

        setIsModalOpen(false);
        setEditedCheckpoint(null); // Reset edited checkpoint data
    };

    const handleEditClick = (checkpoint : MarkerData) => {
        setEditedCheckpoint(checkpoint);
        setIsModalOpen(true);
    };

    const handleModalSubmit = (markerData : MarkerData) => {
        updateMarker(markerData);
        setIsModalOpen(false);
        setEditedCheckpoint(null);
    };

    const toggleAllItems = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation(); // Prevents event bubbling
        if (openItems.length === markers.length) {
            setOpenItems([]); // Collapse all if all are open
        } else {
            setOpenItems(markers.map((_, index) => index.toString())); // Expand all
        }
    };

    const toggleItem = (id:string) => {
        if (openItems.includes(id)) {
            setOpenItems(openItems.filter(item => item !== id)); // Close this item
        } else {
            setOpenItems([...openItems, id]); // Open this item
        }
    };

    return(
        <div className="rounded-lg dark:bg-zinc-700 bg-gray-200 overflow-clip">
            <div className="flex justify-between items-center flex-row mx-4 my-2">
                <div className="flex-[3_3_0%] text-sm font-semibold">
                    Point
                </div>
                <div className="flex-[2_2_0%] text-sm font-semibold text-center">
                    Dist. (KM)
                </div>
                <div className="flex-[2_2_0%] text-sm font-semibold truncate text-center">
                    Dist. inter (KM)
                </div>
                <div className="flex-[2_2_0%] text-sm font-semibold text-center">
                    Ele. Gain (M)
                </div>
                <div onClick={toggleAllItems}>
                    <Minus className={`h-4 w-4 shrink-0 transition-transform duration-200 cursor-pointer ${openItems.length === markers.length ? 'rotate-180' : ''}`}/>
                </div>
            </div>
            <Separator className="bg-zinc-300 mt-2"/>
            <Accordion type="multiple" value={openItems}>
                {markers.map((marker, index) => {
                    const checkpoint = marker.data;
                    if (!checkpoint) {
                        return null;
                    }

                    return (
                        <AccordionItem key={checkpoint.id} value={checkpoint.id!}>
                            <AccordionTrigger className={`flex flex-row px-4 py-2 ${index % 2 === 0 ? 'bg-gray-300 dark:bg-zinc-600' : 'bg-transparent'}`} onClick={() => toggleItem(checkpoint.id!)}>
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
                            
                            <AccordionContent className={`px-4 pb-4 ${index % 2 === 0 ? 'bg-gray-300 dark:bg-zinc-600' : 'bg-transparent'}`}>
                            <Separator className={`${index % 2 === 0 ? "bg-gray-400":"bg-zinc-300"} mb-4`}/>
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
                                    {inPage === "plan" && <Fragment>
                                        <Button onClick={()=>handleEditClick(checkpoint)}>
                                        Edit
                                    </Button>
                                    {checkpoint.removable&&<Button onClick={()=>removeMarker(checkpoint.id!)} className="bg-red-500 hover:bg-red-400 text-white dark:text-white">
                                        Remove
                                        </Button>}
                                        </Fragment>}
                                    
                                </div>
                            </AccordionContent>
                            
                        </AccordionItem>
                    );
                })}
            </Accordion>
            <PlanCheckpointDialog open={isModalOpen} onClose={handleModalClose} onSubmit={handleModalSubmit} checkpointData={editedCheckpoint!}/>
        </div>
        
    );
};

export default PlanCheckpoints;


