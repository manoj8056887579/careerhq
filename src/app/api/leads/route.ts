import { connectToDatabase } from "@/lib/mongodb";
import { Lead } from "@/models/lead";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    // Verify reCAPTCHA token if provided and configured
    if (data.recaptchaToken) {
      const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
      const isDevelopment = process.env.NODE_ENV === "development";
      
      if (recaptchaSecret && recaptchaSecret !== 'your_recaptcha_secret_key_here' && !isDevelopment) {
        try {
          const recaptchaResponse = await fetch(
            "https://www.google.com/recaptcha/api/siteverify",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: `secret=${recaptchaSecret}&response=${data.recaptchaToken}`,
            }
          );

          const recaptchaData = await recaptchaResponse.json();

          console.log("reCAPTCHA verification result:", {
            success: recaptchaData.success,
            score: recaptchaData.score,
            action: recaptchaData.action,
            errors: recaptchaData["error-codes"],
          });

          // Only fail if reCAPTCHA explicitly fails (not on low score for now)
          if (!recaptchaData.success) {
            console.error("reCAPTCHA verification failed:", recaptchaData["error-codes"]);
            return NextResponse.json(
              { 
                error: "reCAPTCHA verification failed. Please refresh and try again.",
                details: recaptchaData["error-codes"]
              },
              { status: 400 }
            );
          }

          // Log low scores but don't block (adjust threshold as needed)
          if (recaptchaData.score < 0.5) {
            console.warn("Low reCAPTCHA score:", recaptchaData.score);
          }
        } catch (error) {
          console.error("reCAPTCHA verification error:", error);
          // Continue even if reCAPTCHA verification fails (network issues, etc.)
        }
      } else {
        if (isDevelopment) {
          console.log("Development mode: Skipping reCAPTCHA verification");
        } else {
          console.warn("reCAPTCHA secret key not configured, skipping verification");
        }
      }
      
      // Remove recaptchaToken from data before saving
      delete data.recaptchaToken;
    }

    // Check for duplicate email or phone
    const existingLead = await Lead.findOne({
      $or: [{ email: data.email?.toLowerCase() }, { phone: data.phone }],
    });

    if (existingLead) {
      return NextResponse.json(
        {
          error: "A user with this email or phone number already exists",
          field:
            existingLead.email === data.email?.toLowerCase()
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

    // Ensure consent is set (default to true if not provided for backward compatibility)
    if (data.consent === undefined) {
      data.consent = true;
    }

    const lead = await Lead.create(data);
    return NextResponse.json({ lead });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}

interface LeadQuery {
  status?: string;
  program?: string | { $ne: string };
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const program = searchParams.get("program");

    const skip = (page - 1) * limit;

    await connectToDatabase();

    // Build query
    const query: LeadQuery = {};
    if (status && status !== "all") {
      query.status = status;
    }
    if (program && program !== "all") {
      // Special handling for "Study Abroad" - show all non-Career Test leads
      if (program === "Study Abroad") {
        query.program = { $ne: "Career Test" };
      } else {
        query.program = program;
      }
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { program: { $regex: search, $options: "i" } },
      ];
    }

    // Get total count
    const total = await Lead.countDocuments(query);

    // Get paginated results
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      leads,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
