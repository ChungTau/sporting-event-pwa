import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    const body = await request.json();
    const {userId,  // Assuming you have user's ID in session
    latitude,
    longitude,
    eventId} = body;

    if (!userId || !latitude || !longitude || !eventId) {
        return NextResponse.json({ message: "Missing required fields" },{status:500});
    }
    try {
    const newLocation = await prisma.liveLocation.upsert({
        where: {
            userId_eventId: {  // This uses the composite key
                userId: userId,
                eventId: eventId
            }
        },
        update: {
            latitude,
            longitude,
            timestamp: new Date()  // Update timestamp to now on each update
        },
        create: {
            userId,
            eventId,
            latitude,
            longitude
        }
    });

    return NextResponse.json(newLocation);
    } catch (error) {
        console.error("Failed to upsert live location:", error);
        return NextResponse.json({ message: "Failed to upsert live location" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const body = await request.json();
    const { userId, eventId } = body;

    // Validate the required fields
    if (!userId || !eventId) {
        return NextResponse.json({ message: "Missing required fields: userId or eventId" }, { status: 400 });
    }

    try {
        // Attempt to delete the live location
        const deletedLocation = await prisma.liveLocation.delete({
            where: {
                userId_eventId: {
                    userId: userId,
                    eventId: eventId
                }
            }
        });

        // If successful, return the deleted object
        return NextResponse.json({
            message: "Live location deleted successfully",
            deletedLocation
        });
    } catch (error :any) {
        console.error("Error deleting live location:", error);
        if (error.code === "P2025") {
            return NextResponse.json({ message: "No live location found with the given userId and eventId" }, { status: 404 });
        }
        return NextResponse.json({ message: "Error deleting live location", error: error }, { status: 500 });
    }
}