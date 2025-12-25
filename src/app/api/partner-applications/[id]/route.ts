import { connectToDatabase } from "@/lib/mongodb";
import { PartnerApplication } from "@/models/partner-application";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const application = await PartnerApplication.findById(id);

    if (!application) {
      return NextResponse.json(
        { error: "Partner application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Error fetching partner application:", error);
    return NextResponse.json(
      { error: "Failed to fetch partner application" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const data = await request.json();

    await connectToDatabase();

    const application = await PartnerApplication.findByIdAndUpdate(
      id,
      {
        ...data,
        ...(data.status && data.status !== "pending"
          ? { reviewedAt: new Date() }
          : {}),
      },
      { new: true, runValidators: true }
    );

    if (!application) {
      return NextResponse.json(
        { error: "Partner application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Error updating partner application:", error);
    return NextResponse.json(
      { error: "Failed to update partner application" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const application = await PartnerApplication.findByIdAndDelete(id);

    if (!application) {
      return NextResponse.json(
        { error: "Partner application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Partner application deleted" });
  } catch (error) {
    console.error("Error deleting partner application:", error);
    return NextResponse.json(
      { error: "Failed to delete partner application" },
      { status: 500 }
    );
  }
}
