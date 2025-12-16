import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import { getSession } from "@/lib/auth";

// GET - Fetch admin profile
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const admin = await Admin.findById(session.id).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: admin.name,
      email: admin.email,
      emails: admin.emails || [],
      phones: admin.phones || [],
      address: admin.address || "",
      mapLink: admin.mapLink || "",
      socialLinks: admin.socialLinks || {},
    });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update admin profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    console.log("Session:", session);

    if (!session || !session.id) {
      console.log("Unauthorized: No session or id");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, emails, phones, address, mapLink, socialLinks } = body;

    console.log("Full body received:", body);
    console.log("Update data:", { name, emails, phones, address, mapLink, socialLinks });
    console.log("mapLink value:", mapLink);
    console.log("mapLink type:", typeof mapLink);
    console.log("mapLink length:", mapLink?.length);

    await connectToDatabase();

    const admin = await Admin.findById(session.id);

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // Update fields
    if (name !== undefined) admin.name = name;
    if (emails !== undefined) admin.emails = emails;
    if (phones !== undefined) admin.phones = phones;
    if (address !== undefined) admin.address = address;
    if (mapLink !== undefined) {
      console.log("Setting mapLink to:", mapLink);
      admin.mapLink = mapLink;
    }
    if (socialLinks !== undefined) admin.socialLinks = socialLinks;

    console.log("Admin before save:", {
      mapLink: admin.mapLink,
      mapLinkLength: admin.mapLink?.length
    });

    await admin.save();

    console.log("Admin after save:", {
      mapLink: admin.mapLink,
      mapLinkLength: admin.mapLink?.length
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      profile: {
        name: admin.name,
        email: admin.email,
        emails: admin.emails,
        phones: admin.phones,
        address: admin.address,
        mapLink: admin.mapLink,
        socialLinks: admin.socialLinks,
      },
    });
  } catch (error) {
    console.error("Error updating admin profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
