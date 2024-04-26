import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { gpx } from "@tmcw/togeojson";
//@ts-ignore
import { DOMParser } from 'xmldom';
import fs from 'fs';
import path from 'path';
import {
    Feature,
    lineString,
    length,
    along,
    point,
    lineSlice,
    distance,
    nearestPointOnLine
    //@ts-ignore
} from '@turf/turf';
import { User } from "@prisma/client";

type Coordinate = {
    latitude: number;
    longitude: number;
    timestamp?: string;
};

function splitRouteIntoSegments(route:Feature) {
    const totalLength = length(route, { units: 'kilometers' });
    const segments = [];
    let currentDistance = 0;

    while (currentDistance < totalLength) {
        const start = along(route, currentDistance, { units: 'kilometers' });
        currentDistance += 0.1;
        const end = along(route, Math.min(currentDistance, totalLength), { units: 'kilometers' });
        if (start && end) {
            const segment = lineSlice(start, end, route);
            segments.push(segment);
        }
    }

    return segments;
}


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
            plan: true,
            liveLocations: {
                include: {
                    user: true
                }
            }
        }
    });

    if (!event || !event.plan || !event.plan.gpxFile) {
        return new Response(JSON.stringify({ message: "GPX file not found or not specified" }), { status: 404 });
    }

    const pathSegments = event?.plan?.gpxFile.split('/');
    const filePath = path.resolve(process.cwd(), 'public', ...pathSegments);

    // Read the GPX file asynchronously
    const gpxData = fs.readFileSync(filePath, 'utf-8');

    // Parse XML data
    const xml = new DOMParser().parseFromString(gpxData, 'text/xml');

    const geojson = gpx(xml);
    const routes = geojson.features[0];
    const segments = splitRouteIntoSegments(routes);
    let totalDistances: { user: User, distance: number }[] = [];
    for (const liveLocation of event?.liveLocations || []) {
        const coordinates: Coordinate[] = liveLocation.coordinates as Coordinate[];
        if (coordinates.length > 0) {
            const lastCoord = coordinates[coordinates.length - 1];
            const userPoint = point([lastCoord.longitude, lastCoord.latitude]);
            const nearest = nearestPointOnLine(segments[liveLocation.lastCheckpoint], userPoint);
    
            if (distance(userPoint, point(segments[liveLocation.lastCheckpoint].geometry.coordinates.slice(-1)[0])) < 0.02) {
                await updateLastCheckpoint(liveLocation.userId, liveLocation.eventId, liveLocation.lastCheckpoint + 1);
            }
    
            const traveledDistance = liveLocation.lastCheckpoint*0.1 + length(lineSlice(point(segments[liveLocation.lastCheckpoint].geometry.coordinates[0]), nearest, segments[liveLocation.lastCheckpoint]));
            totalDistances.push({ user: liveLocation.user, distance: traveledDistance });
        }
    }

    try {
        totalDistances.sort((a, b) => b.distance - a.distance);
        return NextResponse.json(totalDistances);
    } catch (error) {
        console.error("Error reading file:", error);
        return NextResponse.json("Error reading file", { status: 500 });
    }
}


// Function to update the last checkpoint index for a specific live location
async function updateLastCheckpoint(userId: string, eventId: number, newCheckpointIndex: number) {
    try {
        const updatedLiveLocation = await prisma.liveLocation.update({
            where: {
                userId_eventId: {
                    userId: userId,
                    eventId: eventId
                }
            },
            data: {
                lastCheckpoint: newCheckpointIndex
            }
        });
        console.log("Updated live location:", updatedLiveLocation);
        return updatedLiveLocation;
    } catch (error) {
        console.error("Failed to update live location:", error);
        throw new Error("Failed to update live location.");
    }
}
