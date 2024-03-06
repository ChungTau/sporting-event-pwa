import { MouseEventHandler, useEffect, useState } from "react";
import Center from "../../../../components/Center";
import PlanServices from "../../../../services/planServices";
import { Box, SimpleGrid, Text, Image, Tooltip, VStack } from "@chakra-ui/react";
import Plan from "../../../../models/Plan";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import Row from "../../../../components/Row";
import { Info } from "../../../../models/GpxData";
import { useNavigate } from "react-router-dom";
import { COLOR_PRIMARY_RGB, COLOR_SECONDARY_LIGHT } from "../../../../constants/palatte";

interface PlanCardProps {
    plan: Plan;
    clickable?: boolean;
    isSelected?: boolean;
    onClick?: MouseEventHandler<HTMLDivElement> | undefined;
}

export const PlanCard = ({ plan, clickable = true, isSelected, onClick}: PlanCardProps) => {
    const parsedInfo = plan.info;
    const navigator = useNavigate();
    return (
        <Box cursor={'pointer'} maxW={"400px"} borderWidth="1px" borderRadius="lg" overflow="hidden" p="4" px={3} bgColor={isSelected ? `rgba(${COLOR_PRIMARY_RGB}, 0.6)` : "#FFFFFF"} onClick={clickable ?()=>{ navigator(`/plan/${plan.id}`)}:onClick}>
            <Image src={plan.thumbnail} alt={`Image of ${plan.name}`} objectFit="contain" />
            <Tooltip justifyContent={'center'} alignItems={'center'} textAlign={'center'} label={plan.name} aria-label="A tooltip">
                <Text justifyContent={'center'} alignItems={'center'} textAlign={'center'} mt={3} fontSize={["sm", "md", "lg", "xl"]} fontWeight="bold" isTruncated>{plan.name}</Text>
            </Tooltip>
            <Row justifyContent={'space-evenly'} bgColor={'rgba(0,0,0,0.08)'} p={2} borderRadius={4} mt={2}>
                <VStack alignItems={'left'} spacing={0}>
                    <Text fontWeight="semibold">Dist.</Text>
                    <Text fontSize={["xxs", "xs", "sm"]} >{parsedInfo.distance.toFixed(2)} KM</Text>
                </VStack>
                <VStack alignItems={'left'} spacing={0}>
                    <Text fontWeight="semibold">Gain</Text>
                    <Text fontSize={["xxs", "xs", "sm"]} >{parsedInfo.climb !== null ? parsedInfo.climb.toFixed(0) : ''} M</Text>
                </VStack>
                <VStack alignItems={'left'} spacing={0}>
                    <Text fontWeight="semibold">Loss</Text>
                    <Text fontSize={["xxs", "xs", "sm"]} >{parsedInfo.fall !== null ? parsedInfo.fall.toFixed(0) : ''} M</Text>
                </VStack>
            </Row>
        </Box>
    );
};


function MyPlanPage(){
    const {user} = useSelector((state : RootState) => state.user);
    const [plans, setPlans] = useState([] as Plan[]);

    useEffect(() => {
        const ownerId = user?.id;
        PlanServices.getPlansByOwnerId(ownerId!)
            .then(data => {
                if (data) {
                    setPlans(data);
                }
            })
            .catch(error => console.error(error));
    }, []);
    return(
        <div>
            <Center>My Plan</Center>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 3 }} spacing={{ base: "3", md: "4", lg: "6" }} p="4">
                {plans.map(plan => (
                    <PlanCard key={plan.id} plan={plan} />
                ))}
            </SimpleGrid>

        </div>
    );
};

export default MyPlanPage;