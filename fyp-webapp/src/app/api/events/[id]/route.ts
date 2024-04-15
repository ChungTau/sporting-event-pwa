import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const eventId = parseInt(params.id, 10); // Parse as integer
    if (isNaN(eventId)) { // Check if NaN
        return NextResponse.json("Invalid 'id' parameter", { status: 400 });
    }
    const event = await prisma.event.findUnique({
        where: {
            id: eventId
        },
        include: {
            plan: true, // Include the related plan
            owner: true,
            participants: true,
        }
    });

    if (!event) {
        return NextResponse.json("Event not found", { status: 404 });
    }

    try {
        if (event.plan && event.plan.gpxFile) {
            const filePath = join(process.cwd(), 'public', event.plan.gpxFile);
            const file = await readFile(filePath, 'utf8');
            event.plan.gpxFile = file; // Attach the content of the GPX file to the plan object
        }
        return NextResponse.json(event);
    } catch (error) {
        console.error("Error reading file:", error);
        return NextResponse.json("Error reading file", { status: 500 });
    }
}


export async function PATCH(request: NextRequest,{ params }: { params: { id: string } }){
    const id =  parseInt(params.id,10);
    if(!id){
        return NextResponse.json("Missing 'id' parameter", {status:405});
    }
    const body = await request.json();
    const {userId} = body;
    const existingEvent = await prisma.event.findUnique({
        where: { id: id },
        include: { participants: true }
    });

    if (!existingEvent) {
        return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    const isParticipant = existingEvent.participants.some(participant => participant.id === userId);

    try {
        const updatedEvent = await prisma.event.update({
            where: { id: id },
            data: {
                participants: isParticipant
                    ? { disconnect: { id: userId } } // If user is a participant, disconnect them
                    : { connect: { id: userId } } // If user is not a participant, connect them
            },
            include: { participants: true }
        });

        const action = isParticipant ? "left" : "joined";
        return NextResponse.json({ success: true, message: `Successfully ${action} the event`, event: updatedEvent });
    } catch (error) {
        console.error(`Failed to ${isParticipant ? "leave" : "join"} event:`, error);
        return NextResponse.json({ success: false, message: `Failed to ${isParticipant ? "leave" : "join"} event` }, { status: 500 });
    }
}
