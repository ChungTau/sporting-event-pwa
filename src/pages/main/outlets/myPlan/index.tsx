import { useEffect, useState } from "react";
import Center from "../../../../components/Center";
import PlanServices from "../../../../services/planServices";
import { Box, SimpleGrid, Text, Image, Tooltip, VStack } from "@chakra-ui/react";
import Plan from "../../../../models/Plan";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import Row from "../../../../components/Row";
import { Info } from "../../../../models/GpxData";
import { useNavigate } from "react-router-dom";

interface PlanCardProps {
    plan: Plan;
}

const PlanCard = ({ plan }: PlanCardProps) => {
    const parsedInfo = JSON.parse(plan.info) as Info;
    const navigator = useNavigate();
    return (
        <Box cursor={'pointer'} maxW={"100%"} borderWidth="1px" borderRadius="lg" overflow="hidden" p="4" px={3} bgColor={"#FFFFFF"} onClick={()=>{navigator(`/plan/${plan.id}`)}}>
            <Image src={plan.thumbnail} alt={`Image of ${plan.name}`} objectFit="contain" />
            <Tooltip justifyContent={'center'} alignItems={'center'} textAlign={'center'} label={plan.name} aria-label="A tooltip">
                <Text justifyContent={'center'} alignItems={'center'} textAlign={'center'} mt={3} fontSize={["sm", "md", "lg", "xl"]} fontWeight="bold" isTruncated>{plan.name}</Text>
            </Tooltip>
            <Row justifyContent={'space-evenly'} bgColor={'rgba(0,0,0,0.1)'} p={2} borderRadius={4} mt={2}>
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