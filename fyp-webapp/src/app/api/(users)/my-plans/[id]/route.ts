import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request : NextRequest,{ params }: { params: { id: number } }){
    const id =  params.id;
    if(!id){
        return NextResponse.json("Missing 'id' parameter", {status:405});
    }
    const plans = await prisma.plan.findMany({
        where: {ownerId: id.toString()},select:{
            id: true,
            name: true,
            thumbnail: true,
            info: true
        }
        
    });
    return NextResponse.json(plans);
}
