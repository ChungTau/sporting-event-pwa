import { Separator } from "@/components/ui/separator";

function PlanCheckpoints (){
    return(
        <div className="rounded-lg dark:bg-zinc-700 bg-gray-200 p-4 ">
            <div className="flex justify-between items-center flex-row">
                <div className="flex-[3_3_0%] text-sm font-semibold">
                    Point
                </div>
                <div className="flex-[2_2_0%] text-sm font-semibold">
                    Dist. (KM)
                </div>
                <div className="flex-[2_2_0%] text-sm font-semibold">
                    Dist. inter (KM)
                </div>
                <div className="flex-[2_2_0%] text-sm font-semibold">
                    Ele. Gain (M)
                </div>
            </div>
            <Separator className="bg-zinc-300 my-2"/>
        </div>
    );
};

export default PlanCheckpoints;