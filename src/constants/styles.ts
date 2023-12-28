import { COLOR_PRIMARY_RGB, COLOR_SECONDARY } from "./palatte";

export const commonInputStyles = {
    _focusVisible: {
        border: `2px solid ${COLOR_SECONDARY}`
    },
    bgColor: 'whiteAlpha.600',
    border: `2px solid rgba(${COLOR_PRIMARY_RGB}, 1)`,
    color: `rgba(${COLOR_PRIMARY_RGB}, 1)`,
    fontSize: ["sm", "md"]
};