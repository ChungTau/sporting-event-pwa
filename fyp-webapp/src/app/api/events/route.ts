import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const body = await request.json();
    const {name, type, privacy, maxParti, desc, image, venue, startDate, endDate, planId, ownerId} = body;
    const newEvent = await prisma.event.create({
        data:{
            name,
            type,
            privacy,
            maxParti,
            desc,
            image,
            venue,
            startDate,
            endDate,
            planId,
            ownerId
        }
    });

    return NextResponse.json({"success":true, "message":"Create event success", "event": newEvent});
}

export async function GET(request : NextRequest){

    const plans = await prisma.event.findMany({
        where: {privacy: "public"},select:{
            id: true,
            name: true,
            image: true,
            venue: true,
            type: true,
            startDate: true,
            endDate: true,
            startTime:true,
            owner:true,
            maxParti:true
        }
    });
    return NextResponse.json(plans);
}
