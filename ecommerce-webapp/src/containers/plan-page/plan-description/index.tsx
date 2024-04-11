import { Separator } from "@/components/ui/separator";
import { useGpxDataStore } from "@/store/useGpxDataStore";

function PlanDescription() {
    const {name, info} = useGpxDataStore();
    return (<div className="justify-between flex flex-row w-full items-center dark:bg-zinc-700 bg-gray-200 px-4 py-2 rounded-lg">
           <div>
            {name}
           </div>
           <div className="flex flex-row items-end gap-3 text-right">
           <div>
            {`${info?.distance.toFixed(2)} KM`}
            <Separator className="bg-zinc-300"/>
            Distance
           </div>
           <div>
           {`${info?.climb.toFixed(0)} M`}
           <Separator className="bg-zinc-300"/>
            Climb
           </div>
           <div>
           {`${info?.fall.toFixed(0)} M`}
           <Separator className="bg-zinc-300"/>
            Fall
           </div>
           </div>
        </div>);
}

export default PlanDescription;