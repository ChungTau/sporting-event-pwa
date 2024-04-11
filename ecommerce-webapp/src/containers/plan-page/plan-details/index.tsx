import { Fragment } from "react";
import PlanCheckpoints from "../plan-checkpoints";
import PlanDescription from "../plan-description";

function PlanDetails (){
return(<Fragment>
    <PlanDescription/>
    <PlanCheckpoints/>
</Fragment>);
}

export default PlanDetails;