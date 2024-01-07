import Column from "../../../../components/Column";
import { GPXProvider } from "../../../../providers/GPXProvider";
import CheckpointTable from "./CheckpointTable";
import { PlanMapView } from "./PlanMapView";
import SubmitButton from "./SubmitButton";

function PlanPage(){
    return(
       <GPXProvider>
         <Column gap={5}>
            <PlanMapView/>
            <CheckpointTable/>
            <SubmitButton/>
        </Column>
       </GPXProvider>
    );
};

export default PlanPage;