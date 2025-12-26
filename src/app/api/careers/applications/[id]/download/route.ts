import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import JobApplication from "@/models/JobApplication";
import { getResumeInfo } from "@/lib/resume-upload-utils";
import fs from "fs";
import path from "path";

// GET /api/careers/applications/[id]/download - Download resume
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    // Find the application
    const application = await JobApplication.findById(id);

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (!application.resumeId) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }

    // Get resume info
    const resumeInfo = getResumeInfo(application.resumeId);
    const filepath = path.join(process.cwd(), "public", resumeInfo.publicUrl);

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return NextResponse.json(
        { error: "Resume file not found" },
        { status: 404 }
      );
    }

    // Read file
    const fileBuffer = fs.readFileSync(filepath);

    // Create a safe filename for download
    const safeApplicantName = application.name.replace(/[^a-zA-Z0-9]/g, "_");
    const downloadFilename = `${safeApplicantName}_Resume${resumeInfo.extension}`;

    // Return file with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": resumeInfo.mimeType,
        "Content-Disposition": `attachment; filename="${downloadFilename}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error downloading resume:", error);
    return NextResponse.json(
      { error: "Failed to download resume" },
      { status: 500 }
    );
  }
}
