'use client';

import PrivateRoute from "@/components/PrivateRoute";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserDataStore } from "@/store/userUserDataStore";
import { User } from "@prisma/client";
import { Loader2, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function getInitials(name:string) {
    return name
        .split(' ') // Split the name by spaces
        .map((n) => n[0]) // Take the first character of each part
        .join(''); // Join the initials into a single string
}

function UserProfile({params} : {
    params: {
        id: string
    }
}){
    const [loading, setLoading] = useState(false);
    const [uData, setUData] = useState<User|null>(null);
    const [accessDeniedError, setAccessDeniedError] = useState<boolean>(false);
    const {userData, setUserData} = useUserDataStore();
    const isMe = params.id === userData?.id;

    const togglePrivacy = async () => {
        try {
            if (!userData || userData.id === null) {
                throw new Error("User ID not found");
            }

            const newPrivacy = userData.privacy === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';
            const response = await fetch(`/api/users/privacy`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: userData.id,
                    privacy: newPrivacy
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update privacy');
            }

            const updatedUserData = await response.json();
            setUserData(updatedUserData);
            setUData(updatedUserData); // Update local state to reflect the change
        } catch (error) {
            console.error("Error updating privacy:", error);
        }
    };

    const updateAvatar = async(image:string) => {
        try{
            if(!userData || userData.id === null){
                throw new Error("User ID not found");
            }

            const response = await fetch(`/api/users/updateAvatar`,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: userData.id,
                    image
                })
            });

            const updatedUserAvatar = await response.json();
            setUserData(updatedUserAvatar);
            setUData(updatedUserAvatar);
        }catch(error){

        }
    };

    const updateBackgroundImage = async(image:string) => {
        try{
            if(!userData || userData.id === null){
                throw new Error("User ID not found");
            }

            const response = await fetch(`/api/users/updateBgImage`,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: userData.id,
                    image
                })
            });

            const updatedUserAvatar = await response.json();
            setUserData(updatedUserAvatar);
            setUData(updatedUserAvatar);
        }catch(error){

        }
    };

    useEffect(() => {
            setLoading(true);
            if(isMe){
                setLoading(false);
                setUData(userData);
            }else{
                
                const fetchUser = async() => {
                    try{
                        const response = await fetch(`/api/users/${params.id}`);
                        if(!response.ok){
                            if(response.status === 403){
                                setAccessDeniedError(true);
                            }else{
                                throw new Error("Failed to fetch user");
                            }
                        }
                        const data = await response.json();
                        setUData(data);
                        setLoading(false);
                    }catch(error:any){
                        console.error("Error fetching user:", error);
                        setAccessDeniedError(error.status === 403);
                        setLoading(false);
                    }
                };
                
                fetchUser();
            }

    },[params.id]);

    const ProfileAccessComponent = () => {
        if(loading){
            return(<div className="w-full h-full flex justify-center items-center">
            <Loader2 className="h-10 w-10 animate-spin" />
        </div>);
        }else{
            if(accessDeniedError){
                return(
                    <div className="text-center">
                        <p>Access Denied</p>
                    </div>
                );
            }else{
                return(
                    <div className="w-full h-full flex flex-col gap-2">
                        <div className="flex flex-row bg-gray-200 dark-zinc-600 relative w-full h-[400px] rounded-md">
                    <img className="bg-gray-200 dark-zinc-600 w-full h-full rounded-md border-none border-0 object-cover" src={uData?.backgroundImage ?? "https://www.mensjournal.com/.image/t_share/MTk2MTM2OTYwMjAwMDI1NjA1/utmb_main.jpg"}/>
                        <div className="absolute bottom-4 left-4 flex flex-row items-end gap-4">
                            <Avatar className="sm:w-[120px] sm:h-[120px] w-[70px] h-[70px] border-white border-4">
                                <AvatarImage className="object-cover" src={uData?.image??"https://github.com/shadcn.png"} />
                                
                                <AvatarFallback>{uData?.name ?getInitials(uData?.name!): ""}</AvatarFallback>
                                {isMe && <Input
                                    type="file"
                                    accept=".jpg, .jpeg, .png"
                                    className="w-full h-full opacity-0 absolute inset-0 cursor-pointer z-30"
                                    onChange={(event) => {
                                        const file = event.target.files?.[0];
                                        if (file) {
                                          const reader = new FileReader();
                                          reader.onload = () => {
                                            if (reader.result) {
                                                updateAvatar(reader.result as string);
                                              //setImage(reader.result as string);
                                            }
                                          };
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                />}
                            </Avatar>
                            <div className="text-2xl text-white font-semibold">{uData?.name}</div>
                        </div>
                        {isMe && <Button variant={"ghost"} size={"icon"} className="absolute right-4 top-4 bg-white ">
                            <Upload className="h-4 w-4 text-zinc-700 dark:text-zinc-700"/>
                            <Input
                                type="file"
                                accept=".jpg, .jpeg, .png"
                                className="w-full h-full opacity-0 absolute inset-0 cursor-pointer z-30"
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                        if (reader.result) {
                                            updateBackgroundImage(reader.result as string);
                                            //setImage(reader.result as string);
                                        }
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                    }}
                            />
                        </Button>}
                    </div>
                    {
                        isMe && <Button className="w-full" onClick={togglePrivacy}>
                        {uData?.privacy}
                    </Button>
                    }
                    </div>
                );
            }
        }
    }

    return(
        <PrivateRoute>
            <ProfileAccessComponent/>
        </PrivateRoute>
    );
};

export default UserProfile;