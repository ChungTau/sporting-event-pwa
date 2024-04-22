import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request : NextRequest,{ params }: { params: { id: number } }){
    const id =  params.id;
    if(!id){
        return NextResponse.json("Missing 'id' parameter", {status:405});
    }
    const plans = await prisma.event.findMany({
        where: {ownerId: id.toString()},select:{
            id: true,
            name: true,
            image: true,
            venue: true,
            type: true,
            startDate: true,
            endDate: true,
            owner:true,
            maxParti:true
        }
    });
    return NextResponse.json(plans);
}
