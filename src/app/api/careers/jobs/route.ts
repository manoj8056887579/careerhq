import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Job from "@/models/Job";
import type { CreateJobData } from "@/types/career";

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

interface JobQuery {
  department?: { $regex: RegExp };
  location?: { $regex: RegExp };
  type?: string;
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
  published?: boolean;
}

// GET /api/careers/jobs - Get all jobs with optional filtering
export async function GET(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request);

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");
    const location = searchParams.get("location");
    const type = searchParams.get("type");
    const search = searchParams.get("search");
    const limit = Number.parseInt(searchParams.get("limit") || "20");
    const page = Number.parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    // Build query
    const query: JobQuery = {};

    if (department && department !== "all") {
      query.department = { $regex: new RegExp(department, "i") };
    }

    if (location && location !== "all") {
      query.location = { $regex: new RegExp(location, "i") };
    }

    if (type && type !== "all") {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    // Add published filter for public API calls
    const includeUnpublished =
      searchParams.get("includeUnpublished") === "true";
    if (!includeUnpublished) {
      query.published = true;
    }

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Job.countDocuments(query);

    return NextResponse.json(
      {
        jobs: jobs.map((job) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const jobData = job as any;
          return {
            ...jobData,
            id: String(jobData._id),
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
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/careers/jobs - Create a new job
export async function POST(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request);

  try {
    await connectToDatabase();

    const data: CreateJobData = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "department",
      "location",
      "type",
      "experience",
      "description",
      "responsibilities",
      "requirements",
    ];

    for (const field of requiredFields) {
      if (!data[field as keyof CreateJobData]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    // Auto-generate slug from title if not provided or empty
    if (!data.slug || data.slug.trim() === "") {
      data.slug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");

      // Ensure slug is unique by appending timestamp if needed
      const existingJob = await Job.findOne({ slug: data.slug });
      if (existingJob) {
        data.slug = `${data.slug}-${Date.now()}`;
      }
    }

    const job = new Job(data);
    await job.save();

    return NextResponse.json(job.toJSON(), {
      status: 201,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500, headers: corsHeaders }
    );
  }
}
