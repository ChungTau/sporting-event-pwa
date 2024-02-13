import { useEffect, useState } from "react";
import Center from "../../../../components/Center";
import PlanServices from "../../../../services/planServices";
import { Box, SimpleGrid, Text, Image } from "@chakra-ui/react";
import Plan from "../../../../models/Plan";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

interface PlanCardProps {
    plan: Plan;
}

const PlanCard = ({ plan }: PlanCardProps) => {
    return (
        <Box maxW={"100%"} borderWidth="1px" borderRadius="lg" overflow="hidden" p="5" bgColor={"#FFFFFF"}>
            <Image src={plan.thumbnail} alt={`Image of ${plan.name}`} objectFit="contain" />
            <Text mt={3} fontSize="xl" fontWeight="bold">{plan.name}</Text>
            {/* Additional details here */}
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
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={{ base: "4", md: "6", lg: "8" }} p="4">
                {plans.map(plan => (
                    <PlanCard key={plan.id} plan={plan} />
                ))}
            </SimpleGrid>

        </div>
    );
};

export default MyPlanPage;