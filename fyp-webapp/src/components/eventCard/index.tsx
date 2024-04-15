import { useState } from "react";
import { Card, CardFooter, CardHeader } from "../ui/card";
import { SkeletonPlanCardImage } from "../planCard/skeleton";

export interface EventCardProps {
    name: string;
    image: string;
}

const EventCard = ({name, image}:EventCardProps) => {
    return(
        <Card className="w-full bg-white dark:bg-zinc-700 border-gray-200 dark:border-zinc-600 shadow-md relative">
            <EventCardHeader src={image}  />
            <CardFooter className="flex flex-row items-start justify-between">
                <div className="items-start flex flex-col">
                <div className="text-xl">
                    {name}
                </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export interface EventCardHeaderProps{
    src: string;
}

function EventCardHeader({src}:EventCardHeaderProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
  
    const handleImageLoad = () => {
      setImageLoaded(true);
    };
    return(
        <CardHeader className="p-4 relative space-y-0">
            <img
                src={src}
                alt="Random event"
                className="w-full h-[260px] object-cover  rounded-md"
                onLoad={handleImageLoad}
                style={{ display: imageLoaded ? "block" : "none" }}
            />
            {!imageLoaded && <SkeletonPlanCardImage />}
        </CardHeader>
    );
}

export default EventCard;