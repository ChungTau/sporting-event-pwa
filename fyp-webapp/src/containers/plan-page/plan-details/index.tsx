import { Fragment } from "react";
import PlanCheckpoints from "../plan-checkpoints";
import PlanDescription from "../plan-description";
import PlanSubmit from "../plan-submit";

interface PlanDetailsProps {
    isCreating?: boolean;
};

function PlanDetails ({isCreating = true}: PlanDetailsProps){
return(<Fragment>
    <PlanDescription/>
    <PlanCheckpoints/>
    {isCreating && <PlanSubmit/>}
</Fragment>);
}

export default PlanDetails;