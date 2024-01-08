import { MenuItem, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Tooltip } from "@chakra-ui/react";
import { useState } from "react";

interface SliderMenuItemProps {
    label : string;
    min : number;
    max : number;
    step : number;
    value : number;
    icon : React.ReactElement;
    onChange : (value : number) => void;
}

const SliderMenuItem : React.FC < SliderMenuItemProps > = ({
    label,
    min,
    max,
    step,
    value,
    icon,
    onChange
}) => {
    const [showTooltip,
        setShowTooltip] = useState(false);
    return (
        <MenuItem _active={{ bgColor: "rgba(0,0,0,0.2)", color: "#db7987" }}
        _hover={{ bgColor: "rgba(0,0,0,0.2)" }}
        color="white"
        bgColor="transparent">
            <Slider
                aria-label={`slider-ex-${label}`}
                step={step}
                min={min}
                max={max}
                value={value}
                onChange={(val) => onChange(val)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}>
                <SliderTrack bg="red.100">
                    <SliderFilledTrack bg="tomato"/>
                </SliderTrack>
                <Tooltip
                    hasArrow
                    bg="teal.500"
                    color="white"
                    placement="top"
                    isOpen={showTooltip}
                    label={`${label}: ${value}`}>
                    <SliderThumb boxSize={6}>{icon}</SliderThumb>
                </Tooltip>
            </Slider>
        </MenuItem>
    );
};

export default SliderMenuItem;