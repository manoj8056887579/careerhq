import mongoose, { Schema, Model } from "mongoose";
import type { UniversalModule } from "@/types/universal-module";

const CustomFieldSchema = new Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const UniversalModuleSchema = new Schema<UniversalModule>(
  {
    moduleType: {
      type: String,
      required: true,
      enum: [
        "study-india",
        "placement-india",
        "placement-abroad",
        "internship-india",
        "internship-abroad",
        "mbbs-india",
        "mbbs-abroad",
        "llm",
        "uni-project",
        "school-project",
        "mou-project",
        "loans",
      ],
      index: true,
    },
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    detailedDescription: { type: String, required: true },
    category: { type: String, required: true, index: true },
    customFields: [CustomFieldSchema],
    highlights: [{ type: String }],
    coverImage: { type: String, required: true },
    galleryImages: [{ type: String }],
    published: { type: Boolean, default: false, index: true },
    slug: { type: String, unique: true, sparse: true },
  },
  {
    timestamps: true,
  }
);

// Create compound index for efficient queries
UniversalModuleSchema.index({ moduleType: 1, published: 1, createdAt: -1 });
UniversalModuleSchema.index({ moduleType: 1, category: 1 });

// Generate slug from title before saving
UniversalModuleSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

const UniversalModuleModel: Model<UniversalModule> =
  mongoose.models.UniversalModule ||
  mongoose.model<UniversalModule>("UniversalModule", UniversalModuleSchema);

export default UniversalModuleModel;
