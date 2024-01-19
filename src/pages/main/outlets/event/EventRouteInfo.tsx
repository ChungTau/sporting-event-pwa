import Column from "../../../../components/Column";
import {Text} from "@chakra-ui/react";

export interface EventRouteInfoProp {
    title: string;
    value: number | string;
    unit: string;
};

const EventRouteInfo = ({title, value, unit}:EventRouteInfoProp) => {
    return (
        <Column gap={0}>
            <Text color={'gray.300'} fontSize={'small'}>{title}</Text>
            <Text fontSize={'large'} fontWeight={600}>{`${value} ${unit}`}</Text>
        </Column>
    );
};

export default EventRouteInfo;