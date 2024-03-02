import { useParams } from "react-router-dom";
import Column from "../../../../components/Column";
import { GPXProvider } from "../../../../providers/GPXProvider";
import CheckpointTable from "./CheckpointTable";
import { PlanMapView } from "./PlanMapView";
import SubmitButton from "./SubmitButton";

function PlanPage(){
    const { planId } = useParams();
    return(
       <GPXProvider>
         <Column gap={5}>
            <PlanMapView/>
            <CheckpointTable/>
            {planId === undefined ?<SubmitButton/> : null}
        </Column>
       </GPXProvider>
    );
};

export default PlanPage;