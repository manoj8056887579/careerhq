import { connectToDatabase } from "@/lib/mongodb";
import { Video } from "@/models/video";
import { NextResponse } from "next/server";

// Helper function to extract YouTube video ID from URL
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const video = await Video.findById(id);

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ video });
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { error: "Failed to fetch video" },
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

    // If YouTube URL is being updated, extract new video ID
    let updateData = { ...data };
    if (data.youtubeUrl) {
      const videoId = extractYouTubeId(data.youtubeUrl);
      if (!videoId) {
        return NextResponse.json(
          { error: "Invalid YouTube URL" },
          { status: 400 }
        );
      }
      updateData.videoId = videoId;
      updateData.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    // Update publishedAt if isPublished is being set to true
    if (data.isPublished === true && !data.publishedAt) {
      updateData.publishedAt = new Date();
    } else if (data.isPublished === false) {
      updateData.publishedAt = null;
    }

    const video = await Video.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ video });
  } catch (error) {
    console.error("Error updating video:", error);
    return NextResponse.json(
      { error: "Failed to update video" },
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

    const video = await Video.findByIdAndDelete(id);

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
