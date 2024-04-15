import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const {id} = body;
    const user = await prisma.user.findUnique({
        where: {
            id: id
        },
    });

    if (!user) {
        return NextResponse.json("User not found", { status: 404 });
    }

    try {
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json("Error reading user", { status: 500 });
    }
}
