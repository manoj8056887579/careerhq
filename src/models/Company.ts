import mongoose, { Schema, Model } from "mongoose";

export interface Company {
  id: string;
  name: string;
  logo: string; // Cloudinary image ID
  moduleType: "placement-india"; // Only for placement-india
  createdAt?: Date;
  updatedAt?: Date;
}

const CompanySchema = new Schema<Company>(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String, required: true },
    moduleType: {
      type: String,
      required: true,
      enum: ["placement-india"],
      default: "placement-india",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for efficient queries
CompanySchema.index({ moduleType: 1, createdAt: -1 });

const CompanyModel: Model<Company> =
  mongoose.models.Company || mongoose.model<Company>("Company", CompanySchema);

export default CompanyModel;
