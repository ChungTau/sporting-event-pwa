import PrivateRoute from "@/components/PrivateRoute";

export default function AddEventPage(){
  return (
        <PrivateRoute>
          <div>
            Add Event Page
          </div>
        </PrivateRoute>
    )
};
