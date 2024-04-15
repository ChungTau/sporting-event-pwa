import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { useEffect, useState } from "react";
import { MarkerData } from "@/types/mapbox-marker";

// Helper function to map service strings to Option objects
const mapServicesToOptions = (services: string[]): Option[] => {
  return services.map(service => ({
    label: service.charAt(0).toUpperCase() + service.slice(1), // Capitalize first letter
    value: service
  }));
};


interface PlanCheckpointDialogProps {
    open: boolean;
    onClose: (open: boolean) => void;
    onSubmit : (data : MarkerData) => void;
    checkpointData : MarkerData;
}

const OPTIONS: Option[] = [
    { label: 'Food', value: 'food' },
    { label: 'Drinks', value: 'drinks'},
    { label: 'Aid Station', value: 'aid'},
  ];

function PlanCheckpointDialog({open, onClose, onSubmit, checkpointData}: PlanCheckpointDialogProps) {
    const [name, setName] = useState<string>('');
    const [value, setValue] = useState<Option[]>([]);

    const handleSubmit = () => {
        const serviceValues = value.map(option => option.value); // This creates an array of strings
        onSubmit({
            name: name,
            services: serviceValues, // Use the array of strings here
            distance: checkpointData.distance ?? 0,
            elevationGain: checkpointData.elevationGain ?? 0,
            elevation: checkpointData.elevation ?? 0,
            distanceInter: checkpointData.distanceInter ?? 0,
            id: checkpointData.id ?? "",
            position: checkpointData.position ?? null,
            removable: checkpointData.removable ?? true
        });
        resetForm();
    };

    const handleClose = (open:boolean) => {
        resetForm();
        onClose(open);
    };
    
    const resetForm = () => {
        setName('');
        setValue([]);
    };

    useEffect(()=>{
      if(checkpointData){
        setName(checkpointData.name??'');
        setValue(checkpointData.services ? mapServicesToOptions(checkpointData.services) : []);
      }
    },[checkpointData]);

    return (
      <Dialog open={open} defaultOpen={false} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[445px] z-[300]">
          <DialogHeader>
            <DialogTitle>Create new checkpoint</DialogTitle>
            <DialogDescription>
              {"Make new checkpoint here. Click save when you&apos;re done."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-5 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                  id="name"
                  placeholder="CP 1"
                  className="col-span-4"
                  value={name}
                  onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-5 items-center gap-4">
              <Label htmlFor="services" className="text-right">
                Services
              </Label>
              <div className="col-span-4">
              <MultipleSelector
                    value={value}
                    onChange={setValue}
                    selectFirstItem={false}
                    defaultOptions={OPTIONS}
                    hidePlaceholderWhenSelected
                    placeholder="Select services you like..."
                    emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        no results found.
                    </p>
                    }
                />
              </div>
                
            </div>
          </div>
          <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  export default PlanCheckpointDialog;