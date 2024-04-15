import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: NextRequest){
    const body = await request.json();
    const {image, userId} = body;
    
    if(!userId || !image){
        return NextResponse.json({ message: "Missing required fields" },{status:500});
    }

    try{
        const newAvatar = await prisma.user.update({
            where:{
                id: userId
            },
            data:{
                backgroundImage: image
            }
        });

        return NextResponse.json(newAvatar);
    }catch(error){
        console.error("Failed to update Background Image:", error);
        return NextResponse.json({ message: "Failed to update Background Image" }, { status: 500 });
    }
};