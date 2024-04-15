import { NextRequest, NextResponse } from "next/server";


export async function PUT(request: NextRequest){
    const body = await request.json();
    const {privacy, userId} = body;
    
    if(!userId || !privacy){
        return NextResponse.json({ message: "Missing required fields" },{status:500});
    }

    try{
        const newPrivacy = await prisma.user.update({
            where:{
                id: userId
            },
            data:{
                privacy: privacy
            }
        });

        return NextResponse.json(newPrivacy);
    }catch(error){
        console.error("Failed to update privacy:", error);
        return NextResponse.json({ message: "Failed to update privacy" }, { status: 500 });
    }
};