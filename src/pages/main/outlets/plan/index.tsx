import Column from "../../../../components/Column";
import CheckpointTable from "./CheckpointTable";
import { PlanMapView } from "./PlanMapView";

function PlanPage(){
    return(
        <Column gap={5}>
            <PlanMapView/>
            <CheckpointTable/>
        </Column>
    );
};

export default PlanPage;