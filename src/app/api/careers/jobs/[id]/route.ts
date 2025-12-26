import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Job from "@/models/Job";
import type { CreateJobData } from "@/types/career";

// GET /api/careers/jobs/[id] - Get a single job by ID or slug
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    // Try to find by slug first
    let job = await Job.findOne({ slug: id }).lean();

    // If not found by slug, try by ID
    if (!job && /^[0-9a-fA-F]{24}$/.test(id)) {
      job = await Job.findById(id).lean();
    }

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jobData = job as any;

    return NextResponse.json({
      ...jobData,
      id: String(jobData._id),
      _id: undefined,
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}

// PUT /api/careers/jobs/[id] - Update a job
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const data: Partial<CreateJobData> = await request.json();

    // Find the existing job
    const existingJob = await Job.findById(id);

    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Auto-generate slug from title if slug is being updated and is empty
    if (data.title && (!data.slug || data.slug.trim() === "")) {
      data.slug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");

      // Ensure slug is unique (excluding current job)
      const existingSlugJob = await Job.findOne({
        slug: data.slug,
        _id: { $ne: id },
      });
      if (existingSlugJob) {
        data.slug = `${data.slug}-${Date.now()}`;
      }
    }

    // Update the job with new data
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        ...data,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...updatedJob.toJSON(),
      id: String(updatedJob._id),
      _id: undefined,
    });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}

// DELETE /api/careers/jobs/[id] - Delete a job
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    await Job.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
