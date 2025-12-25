import mongoose, { Document, Schema } from "mongoose";

export interface IPartnerApplication extends Document {
  businessName: string;
  businessType: string;
  yearEstablished: string;
  website?: string;
  country: string;
  contactName: string;
  designation: string;
  email: string;
  phone: string;
  services: string[];
  markets: string;
  referralsPerMonth: string;
  familiarWithCommission: string;
  agreeGenuineInfo: string;
  agreeNDA: string;
  partnershipReason: string;
  status: "pending" | "approved" | "rejected" | "under-review";
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PartnerApplicationSchema = new Schema(
  {
    businessName: { type: String, required: true },
    businessType: { type: String, required: true },
    yearEstablished: { type: String, required: true },
    website: { type: String },
    country: { type: String, required: true },
    contactName: { type: String, required: true },
    designation: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    services: { type: [String], required: true },
    markets: { type: String, required: true },
    referralsPerMonth: { type: String, required: true },
    familiarWithCommission: { type: String, required: true },
    agreeGenuineInfo: { type: String, required: true },
    agreeNDA: { type: String, required: true },
    partnershipReason: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "under-review"],
      default: "pending",
    },
    notes: { type: String },
    reviewedBy: { type: String },
    reviewedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const PartnerApplication =
  mongoose.models.PartnerApplication ||
  mongoose.model<IPartnerApplication>(
    "PartnerApplication",
    PartnerApplicationSchema
  );
