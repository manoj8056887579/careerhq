import { connectToDatabase } from "@/lib/mongodb";
import { Lead } from "@/models/lead";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Email or phone is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let lead;
    if (email) {
      lead = await Lead.findOne({ email: email.toLowerCase() });
    } else if (phone) {
      // Normalize phone number for search
      const normalizedPhone = phone.startsWith("+91")
        ? phone
        : `+91${phone}`;
      lead = await Lead.findOne({ phone: normalizedPhone });
    }

    if (lead) {
      return NextResponse.json({
        exists: true,
        lead: {
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          program: lead.program,
        },
      });
    }

    return NextResponse.json({ exists: false });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to verify user" },
      { status: 500 }
    );
  }
}
