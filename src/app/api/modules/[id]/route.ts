import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import UniversalModuleModel from "@/models/UniversalModule";
import type { UpdateUniversalModuleData } from "@/types/universal-module";
import {
  handleImageUpload,
  deleteImageFromCloudinary,
} from "@/lib/image-upload-utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch a single module by ID
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const { id } = await params;

    const moduleData = await UniversalModuleModel.findById(id).lean();

    if (!moduleData) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...moduleData,
      id: moduleData._id.toString(),
      _id: undefined,
    });
  } catch (error) {
    console.error("Error fetching module:", error);
    return NextResponse.json(
      { error: "Failed to fetch module" },
      { status: 500 }
    );
  }
}

// PUT - Update a module
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const { id } = await params;

    // Parse form data to handle both JSON and file uploads
    const contentType = request.headers.get("content-type");
    let data: Partial<UpdateUniversalModuleData>;
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

    delete data.id;

    // Find the existing module
    const existingModule = await UniversalModuleModel.findById(id);
    if (!existingModule) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    // Handle cover image upload if there's a new file
    if (coverImageFile) {
      const newCoverImageId = await handleImageUpload(
        coverImageFile,
        existingModule.coverImage,
        `modules/${existingModule.moduleType}`
      );
      if (newCoverImageId) {
        data.coverImage = newCoverImageId;
      }
    }

    // Handle gallery images upload if there are new files
    if (galleryImageFiles.length > 0) {
      const uploadedGalleryIds: string[] = [];
      for (const file of galleryImageFiles) {
        const imageId = await handleImageUpload(
          file,
          undefined,
          `modules/${existingModule.moduleType}/gallery`
        );
        if (imageId) {
          uploadedGalleryIds.push(imageId);
        }
      }
      // Append new gallery images to existing ones
      data.galleryImages = [
        ...(existingModule.galleryImages || []),
        ...uploadedGalleryIds,
      ];
    }

    const updatedModule = await UniversalModuleModel.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedModule) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...updatedModule.toObject(),
      id: updatedModule._id.toString(),
      _id: undefined,
    });
  } catch (error: unknown) {
    console.error("Error updating module:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update module";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE - Delete a module
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const { id } = await params;

    // Find the module first to get the image IDs
    const moduleToDelete = await UniversalModuleModel.findById(id);
    if (!moduleToDelete) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    // Delete cover image from Cloudinary if it exists
    if (moduleToDelete.coverImage) {
      await deleteImageFromCloudinary(moduleToDelete.coverImage);
    }

    // Delete gallery images from Cloudinary if they exist
    if (
      moduleToDelete.galleryImages &&
      moduleToDelete.galleryImages.length > 0
    ) {
      for (const imageId of moduleToDelete.galleryImages) {
        await deleteImageFromCloudinary(imageId);
      }
    }

    // Delete the module from database
    await UniversalModuleModel.findByIdAndDelete(id);

    return NextResponse.json({ message: "Module deleted successfully" });
  } catch (error) {
    console.error("Error deleting module:", error);
    return NextResponse.json(
      { error: "Failed to delete module" },
      { status: 500 }
    );
  }
}
