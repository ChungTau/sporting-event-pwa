import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const planId = parseInt(params.id, 10); // Parse as integer
    if (isNaN(planId)) { // Check if NaN
        return NextResponse.json("Invalid 'id' parameter", { status: 400 });
    }
    const plan = await prisma.plan.findUnique({
        where: {
            id: planId
        },
    });

    if (!plan) {
        return NextResponse.json("Plan not found", { status: 404 });
    }

    try {
        const filePath = join(process.cwd(), 'public', plan.gpxFile);
        const file = await readFile(filePath, 'utf8');
        return NextResponse.json({...plan, gpxFile: file});
    } catch (error) {
        console.error("Error reading file:", error);
        return NextResponse.json("Error reading file", { status: 500 });
    }
}
