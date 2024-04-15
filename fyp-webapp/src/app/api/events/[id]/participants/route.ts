import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const eventId = parseInt(params.id, 10); // Parse as integer
    if (isNaN(eventId)) { // Check if NaN
        return NextResponse.json("Invalid 'id' parameter", { status: 400 });
    }
    const event = await prisma.event.findUnique({
        where: {
            id: eventId
        },
        select:{
            participants:true
        }
    });

    if (!event) {
        return NextResponse.json("Participants not found", { status: 404 });
    }

    try {
        return NextResponse.json(event);
    } catch (error) {
        console.error("Error reading file:", error);
        return NextResponse.json("Error reading file", { status: 500 });
    }
}