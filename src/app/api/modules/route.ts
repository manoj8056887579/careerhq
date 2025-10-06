import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import UniversalModuleModel from "@/models/UniversalModule";
import type { CreateUniversalModuleData } from "@/types/universal-module";
import { handleImageUpload } from "@/lib/image-upload-utils";

// GET - Fetch all modules or filter by moduleType
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const moduleType = searchParams.get("moduleType");
    const category = searchParams.get("category");
    const published = searchParams.get("published");

    const filter: Record<string, unknown> = {};
    if (moduleType) filter.moduleType = moduleType;
    if (category) filter.category = category;
    if (published !== null) filter.published = published === "true";

    const modules = await UniversalModuleModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    const formattedModules = modules.map((moduleDoc) => ({
      ...moduleDoc,
      id: moduleDoc._id.toString(),
      _id: undefined,
    }));

    return NextResponse.json(formattedModules);
  } catch (error) {
    console.error("Error fetching modules:", error);
    return NextResponse.json(
      { error: "Failed to fetch modules" },
      { status: 500 }
    );
  }
}

// POST - Create a new module
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Parse form data to handle both JSON and file uploads
    const contentType = request.headers.get("content-type");
    let data: CreateUniversalModuleData;
    let coverImageFile: File | null = null;
    let galleryImageFiles: File[] = [];

    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();

      // Extract JSON data
      const jsonData = formData.get("data") as string;
      data = JSON.parse(jsonData);

      // Extract cover image file if present
      coverImageFile = formData.get("coverImageFile") as File | null;

      // Extract gallery image files if present
      const galleryFiles = formData.getAll("galleryImageFiles");
      galleryImageFiles = galleryFiles.filter(
        (file): file is File => file instanceof File
      );
    } else {
      data = await request.json();
    }

    // Validate required fields
    if (!data.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!data.moduleType) {
      return NextResponse.json(
        { error: "Module type is required" },
        { status: 400 }
      );
    }

    // Handle cover image upload if there's a file
    if (coverImageFile) {
      const coverImageId = await handleImageUpload(
        coverImageFile,
        undefined,
        `modules/${data.moduleType}`
      );
      data.coverImage = coverImageId || "";
    }

    // Handle gallery images upload if there are files
    if (galleryImageFiles.length > 0) {
      const uploadedGalleryIds: string[] = [];
      for (const file of galleryImageFiles) {
        const imageId = await handleImageUpload(
          file,
          undefined,
          `modules/${data.moduleType}/gallery`
        );
        if (imageId) {
          uploadedGalleryIds.push(imageId);
        }
      }
      data.galleryImages = [
        ...(data.galleryImages || []),
        ...uploadedGalleryIds,
      ];
    }

    const newModule = await UniversalModuleModel.create(data);

    return NextResponse.json(
      {
        ...newModule.toObject(),
        id: newModule._id.toString(),
        _id: undefined,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating module:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create module";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
