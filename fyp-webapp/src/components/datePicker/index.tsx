import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

export function DatePickerWithRange({
    field,
    className,
  }: {field:any}&React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
        <Button variant="outline" className="min-w-[260px] justify-start text-left">
        <CalendarIcon className="mr-2" />
        {field.value.from && field.value.to ? `${format(field.value.from, 'MMM dd, yyyy')} - ${format(field.value.to, 'MMM dd, yyyy')}` : "Select period"}
    </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            selected={field.value}
            onSelect={field.onChange}
            disabled={
              (date)=>date < new Date()
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
  }