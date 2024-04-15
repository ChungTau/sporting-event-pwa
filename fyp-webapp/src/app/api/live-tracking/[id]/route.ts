import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest,{ params }: { params: { id: string } }) {
    const eventId = parseInt(params.id);
    if (!eventId || isNaN(eventId)) {
        return NextResponse.json({ message: "Invalid or missing event ID" }, { status: 400 });
    }

    try {
        const locations = await prisma.liveLocation.findMany({
            where: {
                eventId: eventId
            },
            include: {
                user: true,  // Optionally include user details
            }
        });

        return NextResponse.json(locations, { status: 200 });
    } catch (error) {
        console.error("Failed to retrieve live locations:", error);
        return NextResponse.json({ message: "Failed to retrieve live locations" }, { status: 500 });
    }
}