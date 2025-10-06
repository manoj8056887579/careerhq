import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ModuleCategoryModel from "@/models/ModuleCategory";

// GET - Fetch categories for a specific module type
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const moduleType = searchParams.get("moduleType");

    if (!moduleType) {
      return NextResponse.json(
        { error: "moduleType is required" },
        { status: 400 }
      );
    }

    const categories = await ModuleCategoryModel.find({ moduleType })
      .sort({ name: 1 })
      .lean();

    const formattedCategories = categories.map((cat) => ({
      ...cat,
      id: cat._id.toString(),
      _id: undefined,
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST - Create a new category
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { name, moduleType } = await request.json();

    if (!name || !moduleType) {
      return NextResponse.json(
        { error: "name and moduleType are required" },
        { status: 400 }
      );
    }

    const category = await ModuleCategoryModel.create({ name, moduleType });

    return NextResponse.json(
      {
        ...category.toObject(),
        id: category._id.toString(),
        _id: undefined,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating category:", error);

    // Check for MongoDB duplicate key error
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { error: "Category already exists for this module type" },
        { status: 409 }
      );
    }

    // Extract error message if available
    const errorMessage =
      error && typeof error === "object" && "message" in error
        ? String(error.message)
        : "Failed to create category";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
