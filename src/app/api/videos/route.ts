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

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    console.log("Received data:", data);

    // Extract video ID from YouTube URL
    const videoId = extractYouTubeId(data.youtubeUrl);
    if (!videoId) {
      console.error("Invalid YouTube URL:", data.youtubeUrl);
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    console.log("Extracted video ID:", videoId);

    // Generate thumbnail URL
    const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    // Create video with extracted data
    const videoData = {
      title: data.title,
      description: data.description,
      youtubeUrl: data.youtubeUrl,
      videoId,
      thumbnail,
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
      publishedAt: data.isPublished ? new Date() : null,
    };

    console.log("Creating video with data:", videoData);

    const video = await Video.create(videoData);

    console.log("Video created successfully:", video._id);

    return NextResponse.json({ video }, { status: 201 });
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { 
        error: "Failed to create video",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

interface VideoQuery {
  isPublished?: boolean;
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");
    const includeUnpublished = searchParams.get("includeUnpublished") === "true";

    const skip = (page - 1) * limit;

    await connectToDatabase();

    // Build query
    const query: VideoQuery = {};
    
    // Only show published videos by default (unless admin is viewing)
    if (!includeUnpublished) {
      query.isPublished = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Get total count
    const total = await Video.countDocuments(query);

    // Get paginated results
    const videos = await Video.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      videos,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
