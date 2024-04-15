import prisma from "@/lib/prisma";
import { mkdir, stat, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

const relativeUploadDir = `/uploads/${new Date(Date.now())
    .toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-")}`;


export async function POST(request: NextRequest){
    const body = await request.json();
    const {name, gpxFile, thumbnail, info, ownerId} = body;
    const blobFile = new Blob([gpxFile], { type: 'application/gpx+xml' });
    const file = Buffer.from(await blobFile.arrayBuffer());
    const uploadDir = join(process.cwd(), "public", relativeUploadDir);
    try {
        await stat(uploadDir);
      } catch (e: any) {
        if (e.code === "ENOENT") {
          // This is for checking the directory is exist (ENOENT : Error No Entry)
          await mkdir(uploadDir, { recursive: true });
        } else {
          console.error(
            "Error while trying to create directory when uploading a file\n",
            e
          );
          return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
          );
        }
      }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}.gpx}`;
    await writeFile(`${uploadDir}/${filename}`, file);
    const fileUrl = `${relativeUploadDir}/${filename}`;
    const newPlan = await prisma.plan.create({
        data:{
            name,
            gpxFile:fileUrl,
            thumbnail,
            info,
            ownerId
        }
    });
    return NextResponse.json({"success":true, "message":"Create plan success", "plan": newPlan});
}