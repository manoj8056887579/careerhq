import { connectToDatabase } from "@/lib/mongodb";
import { PartnerApplication } from "@/models/partner-application";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    // Check for duplicate email or phone
    const existingApplication = await PartnerApplication.findOne({
      $or: [{ email: data.email?.toLowerCase() }, { phone: data.phone }],
    });

    if (existingApplication) {
      return NextResponse.json(
        {
          error: "An application with this email or phone number already exists",
          field:
            existingApplication.email === data.email?.toLowerCase()
              ? "email"
              : "phone",
        },
        { status: 409 }
      );
    }

    // Normalize email to lowercase
    if (data.email) {
      data.email = data.email.toLowerCase();
    }

    const application = await PartnerApplication.create(data);
    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error("Error creating partner application:", error);
    return NextResponse.json(
      { error: "Failed to create partner application" },
      { status: 500 }
    );
  }
}

interface ApplicationQuery {
  status?: string;
  businessType?: string;
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const businessType = searchParams.get("businessType");

    const skip = (page - 1) * limit;

    await connectToDatabase();

    // Build query
    const query: ApplicationQuery = {};
    if (status && status !== "all") {
      query.status = status;
    }
    if (businessType && businessType !== "all") {
      query.businessType = businessType;
    }
    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: "i" } },
        { contactName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
      ];
    }

    // Get total count
    const total = await PartnerApplication.countDocuments(query);

    // Get paginated results
    const applications = await PartnerApplication.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      applications,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching partner applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch partner applications" },
      { status: 500 }
    );
  }
}
