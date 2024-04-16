import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useGpxDataStore } from "@/store/useGpxDataStore";
import { useMapAnimStore } from "@/store/useMapAnimDataStore";
import { handleMapFullscreenToggle } from "@/utils/map";
import { AnimationHook } from "@/utils/map/useAnimation";
import { Disc2, FullscreenIcon, Monitor, PauseCircleIcon, PinIcon, PlayCircleIcon, Proportions, Ratio, Settings, Smartphone, StopCircleIcon } from "lucide-react";
import { Fragment, memo, useRef } from "react";
import { MapRef } from "react-map-gl";
import { toast } from "sonner";

const MapControlPanel = memo(({mapview, startAnimation, stopAnimation, recordAnimation} : {
    mapview: MapRef
} & AnimationHook) => {
    const {
        pitch,
        speed,
        zoom,
        setZoom,
        setSpeed,
        setPitch,
        isPlaying,
        resolution,
        setResolution
    } = useMapAnimStore();
    const {inPage} = useGpxDataStore();
    return (
        <div
            className="absolute rounded-s-lg overflow-x-hidden left-0 top-0 w-16 items-center justify-start gap-2 h-full py-4 flex flex-col dark:bg-zinc-800/80 bg-gray-200/80 overflow-auto z-10 backdrop-blur-sm">
            <Popover>
                <PopoverTrigger
                    className="hover:bg-accent hover:text-accent-foreground h-10 w-10 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"><Settings/></PopoverTrigger>
                <PopoverContent align="start" side="right" className="ml-4 mt-[-10px] z-[901]">
                    <div className="flex flex-row justify-between my-1">
                        <Label htmlFor="zoom">Zoom Level</Label>
                        <Label>{zoom}</Label>
                    </div>
                    <Slider
                        defaultValue={[zoom]}
                        max={21}
                        step={0.1}
                        min={11}
                        onValueChange={(v) => setZoom(v[0])}/>
                    <div className="flex flex-row justify-between my-1">
                        <Label htmlFor="speed">Speed</Label>
                        <Label>{speed}</Label>
                    </div>
                    <Slider
                        defaultValue={[speed]}
                        max={4}
                        step={0.1}
                        min={0.2}
                        onValueChange={(v) => setSpeed(v[0])}/>
                    <div className="flex flex-row justify-between my-1">
                        <Label htmlFor="pitch">Pitch</Label>
                        <Label>{pitch}</Label>
                    </div>
                    <Slider
                        defaultValue={[pitch]}
                        max={60}
                        step={0.1}
                        min={0}
                        onValueChange={(v) => setPitch(v[0])}/>
                </PopoverContent>
            </Popover>
            <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => handleMapFullscreenToggle(mapview)}>
                <FullscreenIcon/>
            </Button>
            <Button variant={"ghost"} size={"icon"} onClick={startAnimation}>
                {isPlaying
                    ? <PauseCircleIcon/>
                    : <PlayCircleIcon/>}
            </Button>
            <Button variant={"ghost"} size={"icon"} onClick={stopAnimation}>
                <StopCircleIcon/>
            </Button>
            {inPage === "plan" && <Fragment><DraggableButton/><Popover >
                <PopoverTrigger
                    className="hover:bg-accent hover:text-accent-foreground h-10 w-10 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"><Ratio /></PopoverTrigger>
                <PopoverContent align="start" side="right" className="ml-4 mt-[-10px] z-[901] w-full">
                    <ToggleGroup defaultValue="responsive" size={"sm"} type="single" className="mt-4" value={resolution} onValueChange={(v)=>{
                       
                        const value = v.length == 0 ? "none": v;
                        setResolution(value as any);
                       
                    }}>
                        <ToggleGroupItem value="desktop" aria-label="Toggle bold">
                            <Monitor/>
                        </ToggleGroupItem>
                        <ToggleGroupItem value="mobile" aria-label="Toggle italic">
                            <Smartphone/>
                        </ToggleGroupItem>
                        <ToggleGroupItem value="responsive" aria-label="Toggle underline">
                            <Proportions/>
                        </ToggleGroupItem>
                    </ToggleGroup>
                </PopoverContent>
            </Popover></Fragment>}
            
            <Button variant={"ghost"} size={"icon"} onClick={recordAnimation}>
                <Disc2 />
            </Button>
        </div>
    );
});

MapControlPanel.displayName = 'MapControlPanel';

export default MapControlPanel;


function DraggableButton(){
    const iconRef = useRef<HTMLDivElement>(null);

    const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        event.dataTransfer.setData("text/plain", "pin");

        if (iconRef.current) {
            const dragIcon = iconRef.current.cloneNode(true) as HTMLDivElement;

            // Change the color of the icon being dragged
            const svgElement = dragIcon.querySelector('svg');
            if (svgElement) {
                svgElement.style.color = 'orange';
            }

            document.body.appendChild(dragIcon);
            event.dataTransfer.setDragImage(dragIcon, 12, 12); // Adjust the offset as needed

            // Clean up
            setTimeout(() => document.body.removeChild(dragIcon), 0);
        }

        /*toast({
            render: () => (
                <Box mb={10} color='white' borderRadius={8} p={4} bg={`rgba(${COLOR_PRIMARY_RGB}, 0.6)`}>
                  <Text fontWeight={500}>Drag the pin to the map.</Text>
                </Box>
              ),
            title: "Drag Started",
            description: "Drag the pin to the map.",
            status: "info",
            duration: 2000,
            isClosable: true,
        });*/
        toast("Drag Started", {
            description: "Drag the pin to the map.",
          })
    };

    return(
        <Button variant={"ghost"} size={"icon"}>
            <div draggable ref={iconRef} onDragStart={onDragStart}>
                <PinIcon/>
            </div>
            
        </Button>
    );
}