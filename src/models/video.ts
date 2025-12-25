import mongoose, { Document, Schema } from "mongoose";

export interface IVideo extends Document {
  title: string;
  description: string;
  youtubeUrl: string;
  videoId: string;
  thumbnail: string;
  views: number;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    youtubeUrl: { type: String, required: true },
    videoId: { type: String, required: true },
    thumbnail: { type: String, required: true },
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date },
  },
  {
    timestamps: true,
    strict: false, // Allow fields not in schema
  }
);

// Delete the model if it exists to force reload with new schema
if (mongoose.models.Video) {
  delete mongoose.models.Video;
}

export const Video = mongoose.model<IVideo>("Video", VideoSchema);
