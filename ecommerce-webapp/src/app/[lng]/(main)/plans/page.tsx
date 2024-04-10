'use client';

import PrivateRoute from "@/components/PrivateRoute";
import MapView from "@/components/mapView";
import {useState, useEffect, useCallback,  memo, useMemo} from "react";
import {useDropzone} from "react-dropzone";
import {gpx} from "@tmcw/togeojson";
import UploadArea from "@/containers/plan-page/upload-area";
import {
    addRouteToMap,
    extractMetadata,
    handleMapFullscreenToggle,
    processGeoJSON,
    removeAllRoutes,
    resizeMap
} from "@/utils/map";
import {useGpxDataStore} from "@/store/useGpxDataStore";
import {MapRef, useMap} from "react-map-gl";
import {Button} from "@/components/ui/button";
import {
    Disc2,
    FullscreenIcon,
    Monitor,
    PauseCircleIcon,
    PlayCircleIcon,
    Proportions,
    Ratio,
    Settings,
    Smartphone,
    StopCircleIcon,
} from "lucide-react";
import {AnimationHook, useAnimation} from "@/utils/map/useAnimation";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Slider} from "@/components/ui/slider";
import {useMapAnimStore} from "@/store/useMapAnimDataStore";
import {Label} from "@/components/ui/label";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";

const readFile = (file : File, onLoad : (event : ProgressEvent < FileReader >) => void) => {
    const reader = new FileReader();
    reader.onload = onLoad;
    reader.readAsText(file);
};


export default function PlanPage() {
    const [fileSelected,
        setFileSelected] = useState(false);
    const {init, name, reset} = useGpxDataStore();
    const onDrop = useCallback((acceptedFiles : File[]) => {
        const acceptedFile = acceptedFiles[0];
        if (acceptedFile) {
            readFile(acceptedFile, (event) => {
                const xml = new DOMParser().parseFromString(event.target
                    ?.result as string, "text/xml");
                const {name, author} = extractMetadata(xml);
                const geojson = gpx(xml);
                const info = processGeoJSON(geojson);
                const routes = geojson.features[0];
                init({name, author, info, routes});
                setFileSelected(true);
            });
        } else {
            setFileSelected(false);
            console.warn("Rejected non-gpx files");
        }
    }, [init]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {
            'application/gpx+xml': ['.gpx']
        },
        maxSize: 5000000
    });

    useEffect(() => {
        return () => {
            setFileSelected(false);
            reset();
        };
    }, [reset]);
    return (
        <PrivateRoute>
            <div className="w-full h-auto min-h-[500px] relative rounded-lg overflow-clip">
                {fileSelected && <PlanMapView/>}
                <UploadArea {...{ getInputProps, getRootProps, isDragActive, fileSelected }}/>
            </div>
            {fileSelected && <PlanDescription/>}
        </PrivateRoute>
    );
}

function PlanMapView() {
    const {mapview} = useMap();
    const {routes} = useGpxDataStore();
    const currentRoute = routes;
    function useAspectStyle(resolution:'desktop'|'mobile'|'responsive'|"none") {
        return useMemo(() => {
            switch (resolution) {
                case 'desktop':
                    // For desktop, fix height at 500px and calculate width using 16:9 ratio
                    return "h-[500px] w-[888px]"; // Width is height * (16 / 9)
                case 'mobile':
                    // For mobile, use the 430:932 ratio
                    return "h-[932px] w-[430px]";
                case 'responsive':
                case "none":
                default:
                    // For responsive, use full width and height
                    return "h-[500px] w-full";
            }
        }, [resolution]);
    }
    const {startAnimation, stopAnimation, recordAnimation} = useAnimation(routes, mapview);
    const {resolution} = useMapAnimStore();

    const aspectStyle = useAspectStyle(resolution);
    useEffect(() => {
        if (mapview && currentRoute) {

            const handleStyleLoad = () => {
                removeAllRoutes(mapview);
                addRouteToMap(mapview, currentRoute);
                resizeMap(mapview, currentRoute);
            };

            if (mapview.isStyleLoaded()) {
                handleStyleLoad();
            } else {
                mapview.once('styledata', handleStyleLoad);
            }

            return () => {
                mapview.off('styledata', handleStyleLoad);
            };
        }
    }, [mapview, currentRoute]);

    const handleResize = useCallback(() => {
        resizeMap(mapview, currentRoute);
    }, [currentRoute, mapview]);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {

            window.removeEventListener('resize', handleResize);
        };
    }, [currentRoute, mapview, handleResize]);
    useEffect(()=>{
        if(resolution && mapview){
            mapview.resize();
        }
    },[resolution, mapview]);
    return (
        <div className={`m-auto items-center justify-center rounded-lg overflow-clip relative ${aspectStyle}`}>
            <MapView>
                {mapview && <MapControlPanel
                    mapview={mapview}
                    startAnimation={startAnimation}
                    stopAnimation={stopAnimation}
                    recordAnimation={recordAnimation}/>}
            </MapView>
        </div>
    );
}

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
                        min={8}
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
            <Popover >
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
            </Popover>
            <Button variant={"ghost"} size={"icon"} onClick={recordAnimation}>
                <Disc2 />
            </Button>
        </div>
    );
});

MapControlPanel.displayName = 'MapControlPanel';

function PlanDescription() {
    const {name, info} = useGpxDataStore();
    return (<div>
           {name}
           {info?.distance}
        </div>);
}
  