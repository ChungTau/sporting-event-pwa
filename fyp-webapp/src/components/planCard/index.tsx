'use client';

import React, { useState } from "react";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { SkeletonPlanCardImage } from "./skeleton";
import { Info } from "@/types/infoType";
import { Separator } from "../ui/separator";

export interface PlanCardProps {
  name: string;
  thumbnail: string;
  info: Info;
}

const PlanCard = ({name, thumbnail, info}:PlanCardProps) => {
  return (
    <Card className="w-full bg-white dark:bg-zinc-700 border-gray-200 dark:border-zinc-600 shadow-md relative">
      <PlanCardHeader src={thumbnail} distance={info.distance} climb={info.climb} fall={info.fall}  />
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

interface InfoColumnProps {
  label : string;
  value : number | string;
}

const InfoColumn = ({ label, value }:InfoColumnProps) => (
  <div className="flex flex-col items-end rounded-md bg-gray-200 dark:bg-gray-500 px-2">
    <div>{value}</div>
    <Separator className="bg-zinc-400"/>
    <div>{label}</div>
  </div>
);

export default PlanCard;

export interface PlanCardHeaderProps{
  src: string;
  distance: number;
  climb:  number;
  fall: number;
}

function PlanCardHeader({src, distance, climb, fall}:PlanCardHeaderProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <CardHeader className="p-4 relative space-y-0">
      {/* Use alt text for images for accessibility */}
      <img
        src={src}
        alt="Random event"
        className="w-full h-full rounded-md"
        onLoad={handleImageLoad}
        style={{ display: imageLoaded ? "block" : "none" }}
      />
      {!imageLoaded && <SkeletonPlanCardImage />}
      <div
        id="overlay"
        className="absolute flex flex-row justify-end items-center gap-2 inset-4 pr-4 rounded-md bg-gradient-to-r from-transparent from-20% to-zinc-900/70 to-80%"
        style={{ display: imageLoaded ? "flex" : "none" }}
      >
        {/* Stack Divider and InfoColumns over the image */}
        <Separator orientation="vertical" className="bg-zinc-400"/>
        <div className="flex flex-col gap-1">
          <InfoColumn label="Dist." value={`${(distance ?? 0).toFixed(2)} KM`} />
          <InfoColumn label="Climb" value={`${(climb ?? 0).toFixed(0)} M`} />
<InfoColumn label="Fall" value={`${(fall ?? 0).toFixed(0)} M`} />

        </div>
      </div>
    </CardHeader>
  );
}
