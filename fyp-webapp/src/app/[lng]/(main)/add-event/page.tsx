
"use client"


import PrivateRoute from "@/components/PrivateRoute";
import { Plan } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/datePicker";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addDays, startOfDay } from "date-fns";
import { TimePicker } from "@/components/ui/datetime-picker";
import { TimeValue } from "react-aria";
import { SubmissionStatus } from "@/types/submissionStatus";
import ResponseDialog from "@/components/dialog/ResponseDialog";
import Image from "next/image";

const MAX_FILE_SIZE = 50000000;
const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const formSchema = z.object({
  image: z
  .any()
  .refine((files) => {
     return files?.size <= MAX_FILE_SIZE;
  }, `Max image size is 5MB.`)
  .refine(
    (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.type),
    "Only .jpg, .jpeg, .png and .webp formats are supported."
  ),
  name: z.string().min(2).max(50),
  type: z.string(),
  privacy: z.string(),
  maxParti: z.number().or(z.string().length(0)).refine(val => !isNaN(val as any), {
    message: "Maximum participants must be a number",
  }),
  
  venue: z.string().min(2),
  plan:z.string(),
  period: z.object({
    from: z.date(),
    to: z.date(),
  }),
  startTime: z.object({
    hour: z.number().min(0).max(23),  // 0 to 23 hours
    minute: z.number().min(0).max(59),  // 0 to 59 minutes
    second: z.number().min(0).max(59).optional(),  // 0 to 59 seconds, optional
    millisecond: z.number().min(0).max(999).optional()  // 0 to 999 milliseconds, optional
  }),
  desc:  z
  .string()
  .min(10, {
    message: "Bio must be at least 10 characters.",
  })
  .max(160, {
    message: "Bio must not be longer than 30 characters.",
  }),
})

export default function AddEventPage(){
  const [image, setImage] = useState<string|null>(null);
  const session = useSession();
  const [userId, setUserId] = useState<string|undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const defaultStartDate = startOfDay(new Date());
  const defaultEndDate = addDays(defaultStartDate, 7);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(SubmissionStatus.Inactive);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "race",
      privacy: "public",
      maxParti: 1,
      venue: "",
      plan: '',  // Ensure this is set to an empty string or a valid default plan ID
      period: {
        from: defaultStartDate,
        to: defaultEndDate
      },
      startTime: {
        hour:12,
        minute:30,
        second:0,
        millisecond:0
      },
      desc: ""
    },
  });

  useEffect(()=>{
    if(session && session.status ==="authenticated"){
      setUserId(session.data.user.id);
    }
  },[session]);
  

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmissionStatus(SubmissionStatus.Loading);
    setIsModalOpen(true);
    const userId = (session.data?.user as any).id;
    if (!userId) {
        console.error("User ID not found in session data.");
        setSubmissionStatus(SubmissionStatus.Error);
        return;
    }
    const { period, startTime, ...otherValues } = values;
    const { from: startDate, to: endDate } = period;
    startDate.setHours(startTime.hour, startTime.minute, startTime.second, startTime.millisecond);
    const formData = {
      ...otherValues,
      startDate,
      endDate,
      planId: values.plan ? parseInt(values.plan, 10) : null,
      ownerId: userId,
    };

    // Handle image conversion to base64
    if (values.image) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(values.image);
      fileReader.onload = () => {
        formData.image = fileReader.result;
        sendFormData(formData);
      };
      fileReader.onerror = (error) => {
        console.error('Error converting image to Base64:', error);
      };
    } else {
      sendFormData(formData);
    }
  }

    async function sendFormData(formData:any) {
      const response = await fetch('/api/events/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmissionStatus(SubmissionStatus.Finished);
      }else{
          console.error("Failed to create event.");
          setSubmissionStatus(SubmissionStatus.Error);
      }
    }

    useEffect(() => {
      const fetchPlans = async () => {
          try {
              if (!userId) {
                  throw new Error("User ID not found");
              }
              
              const response = await fetch(`/api/my-plans/${userId}`);
              if (!response.ok) {
                  throw new Error("Failed to fetch plans");
              }
              
              const data = await response.json();
              setPlans(data);
          } catch (error) {
              //console.error("Error fetching plans:", error);
              // Handle error
          }
      };

      fetchPlans();
  }, [userId]);

  return (
        <PrivateRoute>
          <div className="w-full h-full">
      <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full ">
        <div className="relative w-full h-[300px] dark:bg-zinc-700 bg-gray-200 rounded-md">
          <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      className="w-full h-full opacity-0 absolute inset-0 cursor-pointer z-10"
                      onBlur={field.onBlur}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        field.onChange(file);
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (reader.result) {
                              setImage(reader.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
              )}
            />
            {image && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-md overflow-clip">
                        <Image src={image} width={0}
  height={0} style={{width: '100%', height:400}} alt="Uploaded" className="rounded-md object-cover"/>
                      </div>
                    )}
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Event name" {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
       <div className="flex flex-row items-center gap-3">
       <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Type</FormLabel>
              <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Type" {...field} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="race">Race</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="leisure">Leisure</SelectItem>
                </SelectContent>
              </Select>

              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="privacy"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Privacy</FormLabel>
              <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Privacy" {...field} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>

              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maxParti"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Max. of Parti.</FormLabel>
              <FormControl>
                <Input
                  placeholder="Max. of Parti."
                  type="number"
                  defaultValue={1}
                  {...field}
                  onChange={e => field.onChange(parseInt(e.target.value) || "")} // Convert the input value to a number or reset to empty string
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

       </div>
       <div className="flex flex-row items-center gap-3">
       <FormField
          control={form.control}
          name="venue"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Venue</FormLabel>
              <FormControl>
                <Input placeholder="Venue" {...field} className="w-full"/>
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />

      <FormField
        control={form.control}
        name="plan"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Plan</FormLabel>
            <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Plan" {...field} />
              </SelectTrigger>
              <SelectContent>
              {plans.length > 0 ? plans.map((plan) => (
                      <SelectItem
                        key={plan.id}
                        value={plan.id.toString()}
                      >
                        {plan.name}
                      </SelectItem>
                    )) : <SelectItem value="loading" disabled className="text-gray-400"
                  >Loading...</SelectItem>}
              </SelectContent>
            </Select>

            </FormControl>
            
            <FormMessage />
          </FormItem>
        )}
      />

       </div>
       
       <div className="flex sm:flex-row flex-col items-center sm:gap-3 gap-10">
       <FormField
          control={form.control}
          name="period"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Period</FormLabel>
              <FormControl>
              <DatePickerWithRange
               field={field}
              />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}

        />
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Start Time</FormLabel>
              <FormControl>
              <TimePicker  ariaLabel="Choose a time" value={field.value as TimeValue} onChange={field.onChange} ref={field.ref}/>
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
          
        />
       </div>
       <FormField
          control={form.control}
          name="desc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your event"
                  className="resize-none dark:border-gray-200"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> other users and organizations.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Submit</Button>
      </form>
    </FormProvider>
    </div>
    <ResponseDialog open={isModalOpen} status={submissionStatus} name="Event" redirectPath="my-events"/>
        </PrivateRoute>
    )
};
