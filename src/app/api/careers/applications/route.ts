import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import JobApplication from "@/models/JobApplication";
import Job from "@/models/Job";
import { uploadResume } from "@/lib/resume-upload-utils";

// Allowed origins for production
const allowedOrigins = [
  "https://careerhq.in",
  "https://www.careerhq.in",
  "http://localhost:3000",
];

// Get CORS headers based on request origin
function getCorsHeaders(request: NextRequest) {
  const origin = request.headers.get("origin");
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);
  const allowOrigin = isAllowedOrigin ? origin : allowedOrigins[0];

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Allow-Credentials": "true",
  };
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: getCorsHeaders(request) });
}

interface ApplicationQuery {
  jobId?: string;
  status?: string;
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
}

// GET /api/careers/applications - Get all applications with optional filtering
export async function GET(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request);

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = Number.parseInt(searchParams.get("limit") || "50");
    const page = Number.parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    // Build query
    const query: ApplicationQuery = {};

    if (jobId) {
      query.jobId = jobId;
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { jobTitle: { $regex: search, $options: "i" } },
      ];
    }

    const applications = await JobApplication.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await JobApplication.countDocuments(query);

    return NextResponse.json(
      {
        applications: applications.map((app) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const appData = app as any;
          return {
            ...appData,
            id: String(appData._id),
            _id: undefined,
          };
        }),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/careers/applications - Create a new job application
export async function POST(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request);

  try {
    await connectToDatabase();

    // Parse form data to handle file upload
    const formData = await request.formData();

    // Extract data
    const jobId = formData.get("jobId") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const coverLetter = formData.get("coverLetter") as string;
    const resumeFile = formData.get("resume") as File | null;

    // Validate required fields
    if (!jobId || !name || !email || !phone || !resumeFile) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Verify job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Upload resume to public/resumes folder
    const resumePath = await uploadResume(resumeFile);

    if (!resumePath) {
      return NextResponse.json(
        { error: "Failed to upload resume" },
        { status: 500, headers: corsHeaders }
      );
    }

    // Create application
    const application = new JobApplication({
      jobId,
      jobTitle: job.title,
      name,
      email,
      phone,
      resumeId: resumePath,
      coverLetter: coverLetter || undefined,
      status: "pending",
    });

    await application.save();

    return NextResponse.json(application.toJSON(), {
      status: 201,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500, headers: corsHeaders }
    );
  }
}
