import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import CompanyModel from "@/models/Company";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const moduleType = searchParams.get("moduleType") || "placement-india";

    const companies = await CompanyModel.find({ moduleType })
      .sort({ createdAt: -1 })
      .lean();

    const companiesWithId = companies.map((company) => ({
      ...company,
      id: company._id.toString(),
      _id: undefined,
    }));

    return NextResponse.json(companiesWithId);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const logo = formData.get("logo") as string;
    const moduleType = (formData.get("moduleType") as string) || "placement-india";

    if (!name || !logo) {
      return NextResponse.json(
        { error: "Name and logo are required" },
        { status: 400 }
      );
    }

    const company = await CompanyModel.create({
      name,
      logo,
      moduleType,
    });

    return NextResponse.json({
      ...company.toObject(),
      id: company._id.toString(),
    });
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { error: "Failed to create company" },
      { status: 500 }
    );
  }
}
