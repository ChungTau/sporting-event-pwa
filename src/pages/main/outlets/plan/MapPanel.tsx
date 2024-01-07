import {
    Flex,
    IconButton,
    Menu,
    MenuButton,
    MenuDivider,
    MenuGroup,
    MenuItem,
    MenuList,
} from "@chakra-ui/react";
import {IoStop, IoMenu} from "react-icons/io5";
import Row from "../../../../components/Row";
import DraggablePinButton from "./DraggablePinButton";
import {BsFillPlayFill, BsFillPauseFill} from "react-icons/bs";
import { PiRecordFill } from "react-icons/pi";
import {MdFullscreen, MdSpeed, MdZoomInMap} from "react-icons/md";
import {TbAngle} from "react-icons/tb";
import {ReactComponent as DawnIcon} from "../../../../assets/icons/dawn.svg";
import {ReactComponent as DayIcon} from "../../../../assets/icons/day.svg";
import {ReactComponent as DuskIcon} from "../../../../assets/icons/dusk.svg";
import {ReactComponent as NightIcon} from "../../../../assets/icons/night.svg";
import {useEffect, useState} from "react";
import {useMap} from "../../../../contexts/MapContext";
import {useAnimation} from "../../../../providers/AnimationProvider";
import PresetIconButton from "./PresetIconButton";
import SliderMenuItem from "./SliderMenuItem";
import MapStyleItem from "./MapStyleItem";
import {satelliteStyleImage, standardStyleImage} from "../../../../constants/map";

type IconMapping = {
    [key : string]: React.FunctionComponent < React.SVGProps < SVGSVGElement > & {
        title?: string
    } >;
};

const iconMapping : IconMapping = {
    dawn: DawnIcon,
    day: DayIcon,
    dusk: DuskIcon,
    night: NightIcon
};

const iconButtonStyles = {
    w: "24px",
    _active: {
        bgColor: "rgba(0,0,0,0.4)",
        color: "#db7987"
    },
    _hover: {
        bgColor: "rgba(0,0,0,0.4)"
    },
    bgColor: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    color: "white"
};

const MapPanel = () => {
    const [mapStyle,
        setMapStyle] = useState('mapbox://styles/mapbox/standard-beta');
    const [selectedPreset,
        setSelectedPreset] = useState('day');
    const map = useMap();
    const animationRef = useAnimation();
    useEffect(() => {
      if (
        map.mapRef &&
        map.mapRef.current &&
        map.mapRef.current.getMapInstance() &&
        map.mapRef.current.getMapInstance().style !== undefined &&
        map.mapRef.current.getMapInstance().style._loaded
      ) {
        map.mapRef.current.getMapInstance().setStyle(mapStyle);
      }
    }, [mapStyle, map.mapRef]);
    
    

    const renderPresetButtons = () => (['dawn', 'day', 'dusk', 'night'].map(preset => (<PresetIconButton
        key={preset}
        isSelected={selectedPreset === preset}
        label={preset}
        IconComponent={iconMapping[preset]}
        onPresetSelect={setSelectedPreset}/>)));

    const handlePlayPause = () => {
        animationRef.start();
    };

    const handleRecord = () => {
      animationRef.record();
  };

    const handleReset = () => {
        animationRef.reset();
    };

    const handleMapFullscreenToggle = () => {
        
    
        if (!document.fullscreenElement) {
            const mapContainer = map.mapRef.current.getMapInstance().getContainer();
            if (mapContainer.requestFullscreen) {
                mapContainer.requestFullscreen();
            } else if (mapContainer.webkitRequestFullscreen) { // Safari
                mapContainer.webkitRequestFullscreen();
            } else if (mapContainer.msRequestFullscreen) { // IE11
                mapContainer.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } 
        }
    };

    return (
        <Row pos="absolute" top={2} left={2}>
            {(animationRef.isCompleted && !animationRef.isPlaying)?<Menu closeOnSelect={false}>
                <MenuButton
                    as={IconButton}
                    {...iconButtonStyles}
                    aria-label="togglePanel"
                    icon={< IoMenu />}/>
                <MenuList
                    zIndex={11}
                    minW="160px"
                    borderColor="transparent"
                    bgColor="rgba(0,0,0,0.4)"
                    backdropFilter="blur(4px)">
                    <MenuGroup color={"#DDDDDD"} title='Config'>
                        <SliderMenuItem
                            icon={< MdSpeed />}
                            step={0.1}
                            label="Speed"
                            min={0.1}
                            value={animationRef.speed}
                            max={4}
                            onChange={animationRef.setSpeed}/>
                        <SliderMenuItem
                            icon={< MdZoomInMap />}
                            step={0.1}
                            label="Zoom"
                            min={11}
                            value={animationRef.zoomLevel}
                            max={21}
                            onChange={animationRef.setZoomLevel}/>
                        <SliderMenuItem
                            icon={< TbAngle />}
                            step={0.1}
                            label="Pitch"
                            min={0}
                            value={animationRef.pitch}
                            max={60}
                            onChange={animationRef.setPitch}/>
                    </MenuGroup>
                    <MenuDivider
                        mx={2}
                        aria-orientation="horizontal"
                        height={1}
                        borderColor="whiteAlpha.500"/>
                    <MenuGroup color={"#DDDDDD"} title='Map Style'>
                        <Row justifyContent={'center'} alignItems={'center'} gap={0}>
                            <MapStyleItem
                                image={standardStyleImage}
                                isSelected={mapStyle === 'mapbox://styles/mapbox/standard-beta'}
                                onClick={() => setMapStyle('mapbox://styles/mapbox/standard-beta')}/>
                            <MapStyleItem
                                image={satelliteStyleImage}
                                isSelected={mapStyle !== 'mapbox://styles/mapbox/standard-beta'}
                                onClick={() => setMapStyle('mapbox://styles/mapbox/satellite-v9')}/>
                        </Row>
                    </MenuGroup>
                    <MenuDivider
                        mx={2}
                        aria-orientation="horizontal"
                        height={1}
                        borderColor="whiteAlpha.500"/> {mapStyle === "mapbox://styles/mapbox/standard-beta"
                        ? (
                            <MenuGroup color={"#DDDDDD"} title='Light Preset'>
                                <MenuItem bgColor={"transparent"} cursor={"unset"}>
                                    <Flex w={"100%"} justifyContent={"space-evenly"} flexDirection={"row"}>
                                        {renderPresetButtons()}
                                    </Flex>
                                </MenuItem>
                            </MenuGroup>
                        )
                        : (<div/>)}
                </MenuList>

            </Menu>: <IconButton
                        {...iconButtonStyles}
                        icon={< IoMenu />}
                        aria-label="menu"
                        isDisabled={true}
                        
                        _disabled={{
                        bgColor: "#898989",
                        cursor: "not-allowed"
                    }}/>}
            <DraggablePinButton/>
            
            <IconButton
                {...iconButtonStyles}
                icon={<MdFullscreen />}
                aria-label="fullscreen"
                onClick={handleMapFullscreenToggle}
            />
            <IconButton onClick={handlePlayPause} aria-label={animationRef.isPlaying
                    ? "pause"
                    : "play"} {...iconButtonStyles} icon={animationRef.isPlaying
                    ? <BsFillPauseFill color="#ffffff"/>
                    : <BsFillPlayFill color="#ffffff"/>}/>
            <IconButton onClick={handleReset} aria-label="stop" {...iconButtonStyles } icon={< IoStop />}/>
            <IconButton onClick={handleRecord} aria-label="record" {...iconButtonStyles } bgColor={animationRef.isRecording?"#f5425a":"rgba(0,0,0,0.6)"} _hover={{bgColor:animationRef.isRecording?"rgba(245, 66, 90,0.8)":"rgba(0,0,0,0.6)"}} icon={< PiRecordFill />}/>
        </Row>
    );
};

export default MapPanel;