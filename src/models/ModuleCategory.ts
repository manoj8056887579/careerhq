import mongoose, { Schema, Model } from "mongoose";
import type { ModuleCategory } from "@/types/universal-module";

const ModuleCategorySchema = new Schema<ModuleCategory>(
  {
    name: { type: String, required: true, trim: true },
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
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate categories per module type
ModuleCategorySchema.index({ name: 1, moduleType: 1 }, { unique: true });

const ModuleCategoryModel: Model<ModuleCategory> =
  mongoose.models.ModuleCategory ||
  mongoose.model<ModuleCategory>("ModuleCategory", ModuleCategorySchema);

export default ModuleCategoryModel;
