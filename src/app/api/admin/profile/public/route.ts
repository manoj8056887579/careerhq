import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";

// GET - Fetch public admin profile data (no authentication required)
export async function GET() {
  try {
    await connectToDatabase();

    // Get the first admin (assuming single admin setup)
    const admin = await Admin.findOne().select("mapLink emails phones address socialLinks");

    if (!admin) {
      return NextResponse.json({
        mapLink: "",
        emails: [],
        phones: [],
        address: "",
        socialLinks: {},
      });
    }

    return NextResponse.json({
      mapLink: admin.mapLink || "",
      emails: admin.emails || [],
      phones: admin.phones || [],
      address: admin.address || "",
      socialLinks: admin.socialLinks || {},
    });
  } catch (error) {
    console.error("Error fetching public admin profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
