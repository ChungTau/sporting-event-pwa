import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest,  { params }: { params: { id: string } }) {
    const user = await prisma.user.findUnique({
        
        where: {
            id: params.id,
        },
    });


    if (!user) {
        return NextResponse.json("User not found", { status: 404 });
    }

    // Check if the user's profile is private and if the requester is authorized
    if (user.privacy === "PRIVATE") {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    try {
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json("Error reading user", { status: 500 });
    }
}
